from common import read_yaml
from pathlib import Path
import os 
from app import app
import EasyMCP2221
from flask import jsonify,request,redirect,flash,url_for
from common import get_device
import json
from logger import log
from werkzeug.utils import secure_filename
import re 
import pandas as pd 
from io import StringIO
from common_routes import IVM6311_demo_slaves,write_into_slaves,allowed_file
from time import sleep

DEVICE = read_yaml(Path('config/DeviceAddress.yaml'))

@app.route('/ivm6311/setup-adi_turn_off',methods=['GET'])
def adi_turn_off():
    device = get_device()
    adi1 = device.I2C_Slave(0x34).write([0x8,0x13])
    adi2 = device.I2C_Slave(0x36).write([0x8,0x13])
    return jsonify({})
    
@app.route('/ivm6311/setup-adi_tur_on',methods=['GET'])
def adi_turn_on():
    device = get_device()
    adi1 = device.I2C_Slave(0x34).write([0x8,0x12])
    adi2 = device.I2C_Slave(0x36).write([0x8,0x12])
    return jsonify({})
    
@app.route('/ivm6311/setup-state',methods=['GET'])
def get_state():
    device = get_device()
    if device:
        audio_slaves = DEVICE.AUDIO
        print(DEVICE.AUDIO)
        message={}
        alldevices_state = False
        ivm_state = False
        for name, address in audio_slaves.items():
            try:
                if re.findall('ADI',name):
                    slave = device.I2C_Slave(address)
                    message.update({hex(address):'OFF'}) if int(int.from_bytes(slave.read_register(0x08),'little')) == 0x13 else message.update({hex(address):'ON'})
                if re.findall('IVM',name):
                    slave = device.I2C_Slave(address)
                    slave.write([0xfe,0x00]) # shift it to page zero
                    if int(int.from_bytes(slave.read_register(0x19),'little')) == 0x1:
                        message.update({hex(address):'ON'})
                        ivm_state=True
                    else:
                        message.update({hex(address):'OFF'})
                        ivm_state=False
                alldevices_state=True
                alldevices_state = alldevices_state & ivm_state
            except EasyMCP2221.exceptions.NotAckError as e:
                alldevices_state=False
                message.update({address:'Disconnected'})
        return jsonify({'success':{'deviceState':{'state':alldevices_state,'onlyivm':ivm_state}},'message':message}),200
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500
            
@app.route('/ivm6311/setpot',methods=['POST'])
def setPot_resistance__value():
    device = get_device()
    if device:
        try :
            data = request.json
            potaddr = int(data.get('potAddr'),16)
            adcaddr = int(data.get('adcAddr'),16)
            if (potvalue := data.get('value')):
                potvalue = int('0x'+ potvalue,16)
                pot = device.I2C_Slave(potaddr)
                pot.write([0x02,potvalue])
                return get_adcVbus__Voltage(addr=adcaddr)
            else :
                log.error(f'Device invalud pot value {potvalue}')
                return jsonify({'error':f'Invalid pot value {potvalue}'}),500
                
        except EasyMCP2221.exceptions.NotAckError as e:
            log.error(f'Device Not Found {data.potAddr}')
            return jsonify({'error':f'Device Not Found {data.potAddr}'}),500
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

def bus_Voltage(device=None,addr=0x29):
    try:
        sleep(0.1)
        BoostADC = device.I2C_Slave(addr)
        BoostADC.write([0x0B,0x5C])
        Vsense_LSB = int.from_bytes(BoostADC.read_register(0x0D),'little') # LSB of the ADC value 
        Vsense_MSB = int.from_bytes(BoostADC.read_register(0x11),'little') # LSB of the ADC value 
        FSV = (40 - 40/2047) 
        Vsense = ((Vsense_MSB << 8 ) | Vsense_LSB) >> 5 
        Vbus = round(FSV*Vsense / 2047,2)
        return Vbus
    except EasyMCP2221.exceptions.NotAckError as e:
        log.error(f'Device Not Found {addr}')
        return jsonify({'error':f'Device Not Found {addr}'}),500


@app.route('/ivm6311/getadc/<int:addr>',methods=['GET'])
def get_adcVbus__Voltage(addr):
    device = get_device()
    if device:
        Vbus = bus_Voltage(device=device,addr=addr)
        log.info(f'ADC {addr} Vbus {Vbus}V')
        return jsonify({'success':{'adc':Vbus}}),200
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500



@app.route('/ivm6311/powerup-script-ivm-only', methods=['GET', 'POST'])
def ivmpowerup_script():
    if request.method == 'POST':
        try:
            # check if the post request has the file part
            if 'file' not in request.files:
                flash('No file part')
                return redirect(request.url)
            file = request.files['file']
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                flash('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                data='\n'.join(file.read().decode('utf-8').splitlines()[2:])
                with open('scripts/onlyivmpowerup.csv','w') as file :
                    data = pd.read_csv(StringIO(data),sep=';',index_col=False).to_csv(file)
                    log.info('IVM Powerup Script uploaded sucessfully')
            return jsonify({'success':'IVM Powerup Script uploaded sucessfully'}),200
        except Exception as e:
            log.info(f'IVM Powerup Script not uploaded in server : {e}')
            return jsonify({'error':'IVM Powerup Script not uploaded in the server'}),500
            
    if request.method == 'GET': 
        return '''
        <!doctype html>
        <title>Upload IVM Power Up Script</title>
        <h1>Upload IVM Power Up Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''
@app.route('/ivm6311/powerup-all-script', methods=['GET', 'POST'])
def allpowerup_script():
    if request.method == 'POST':
        try:
            # check if the post request has the file part
            if 'file' not in request.files:
                flash('No file part')
                return redirect(request.url)
            file = request.files['file']
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                flash('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                data='\n'.join(file.read().decode('utf-8').splitlines()[2:])
                with open('scripts/powerupall.csv','w') as file :
                    data = pd.read_csv(StringIO(data),sep=';',index_col=False).to_csv(file)
                    log.info(' Powerup Script uploaded sucessfully')
            return jsonify({'success':'All Devices Powerup Script uploaded sucessfully'}),200
        except Exception as e:
            log.info(f'adi Powerup Script not uploaded in server : {e}')
            return jsonify({'error':'All Devices Powerup Script not uploaded in the server'}),500
            
    if request.method == 'GET': 
        return '''
        <!doctype html>
        <title>Upload ADI Power Up Script</title>
        <h1>Upload ADI Power Up Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''


@app.route('/ivm6311/powerdown-all-script', methods=['GET', 'POST'])
def allpowerdown_script():
    if request.method == 'POST':
        try:
            # check if the post request has the file part
            if 'file' not in request.files:
                flash('No file part')
                log.warning('No file Part in the request')
                return redirect(request.url)
            file = request.files['file']
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                flash('No selected file')
                log.warning('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                data='\n'.join(file.read().decode('utf-8').splitlines()[2:])
                with open('scripts/powerdownall.csv','w') as file :
                    pd.read_csv(StringIO(data),sep=';',index_col=False).to_csv(file)

                return jsonify({'success':'All Devices Powerdown Script uploaded sucessfully'}),200
        except Exception as e:
            log.info(f'All Devices Powerdown Script not uploaded in server : {e}')
            return jsonify({'error':'All Devices Powerdown Script not uploaded in server'}),500
    if request.method == 'GET':
        return '''
        <!doctype html>
        <title>Upload ADI Power down Script</title>
        <h1>Upload ADI Power down Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''
@app.route('/ivm6311/powerdown-script-ivm-only', methods=['GET', 'POST'])
def ivmpowerdown_script():
    if request.method == 'POST':
        try:
            # check if the post request has the file part
            if 'file' not in request.files:
                flash('No file part')
                log.warning('No file Part in the request')
                return redirect(request.url)
            file = request.files['file']
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                flash('No selected file')
                log.warning('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                data='\n'.join(file.read().decode('utf-8').splitlines()[2:])
                with open('scripts/onlyivmpowerdown.csv','w') as file :
                    pd.read_csv(StringIO(data),sep=';',index_col=False).to_csv(file)

                return jsonify({'success':'IVM Powerdown Script uploaded sucessfully'}),200
        except Exception as e:
            log.info(f'IVM Powerdown Script not uploaded in server : {e}')
            return jsonify({'error':'IVM Powerdown Script not uploaded in server'}),500
    if request.method == 'GET':
        return '''
        <!doctype html>
        <title>Upload IVM Power down Script</title>
        <h1>Upload IVM Power down Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''
        
@app.route('/ivm6311/start-end',methods=['POST'])
def start__end():
    # check all the devices exits
    device = get_device() 
    if device:
        if request.method == 'POST':
            notfound_slave_addresses = IVM6311_demo_slaves(device=device)
            if notfound_slave_addresses:
                log.error(f'Deviceses are not found : {notfound_slave_addresses}')
                return jsonify({'error':{'Not Found' : notfound_slave_addresses}}),500
            else:
                state = request.json.get('state')
                if not state :
                    log.info(f'Powerup Sequence initiated for all devices')
                    write_into_slaves(device=device,scriptPath='scripts/powerupall.csv')
                elif  state:

                    log.info(f'Powerdown Sequence initiated for all devices')
                    write_into_slaves(device=device,scriptPath='scripts/powerdownall.csv')
                else :
                    log.info(f'Powerdown Sequence initiated')

        vbso = bus_Voltage(device=device, addr=DEVICE.I2C.VBSOADC)
        vbias = bus_Voltage(device=device, addr=DEVICE.I2C.VBAISADC)
        return jsonify({'success':{'vbso':vbso,'vbias':vbias}}),200
            # return jsonify({'success':{'vbso':4.84,'vbias':6.25}}),200
                
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500
    
@app.route('/ivm6311/start-end-ivm-only',methods=['POST'])
def start__end__ivmonly():
    # check all the devices exits
    device = get_device() 
    if device:
        if request.method == 'POST':
            # notfound_slave_addresses = IVM6311_demo_slaves(device=device)
            notfound_slave_addresses = []
            if notfound_slave_addresses:
                log.error(f'Deviceses are not found : {notfound_slave_addresses}')
                return jsonify({'error':{'Not Found' : notfound_slave_addresses}}),500
            else:
                onlyivm = request.json.get('onlyivm')
                if not  onlyivm:
                    log.info(f'only ivm Powerup Sequence initiated')
                    write_into_slaves(device=device,scriptPath='scripts/onlyivmpowerup.csv')
                elif  onlyivm:
                    log.info(f'only ivm Powerdown Sequence initiated')
                    write_into_slaves(device=device,scriptPath='scripts/onlyivmpowerdown.csv')
                else :
                    log.info(f'Powerdown Sequence initiated')

        vbso = bus_Voltage(device=device, addr=DEVICE.I2C.VBSOADC)
        vbias = bus_Voltage(device=device, addr=DEVICE.I2C.VBAISADC)
        return jsonify({'success':{'vbso':vbso,'vbias':vbias}}),200
        # return jsonify({'success':{'vbso':4.84,'vbias':6.25}}),200
                
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

