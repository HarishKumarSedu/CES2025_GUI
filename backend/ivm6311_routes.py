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
from common_routes import slaves,device_check

DEVICE = read_yaml(Path('config/DeviceAddress.yaml'))


@app.route('/ivm6311/setpot',methods=['POST'])
def setPot_resistance__value():
    device = get_device()
    if device:
        try :
            data = request.json
            print(data)
            potaddr = int(data.get('potAddr'),16)
            adcaddr = int(data.get('adcAddr'),16)
            potvalue = int(data.get('value'),16)
            pot = device.I2C_Slave(potaddr)
            pot.write([0x02,potvalue])
            return bus_Voltage(device=device,addr=adcaddr)
        except EasyMCP2221.exceptions.NotAckError as e:
            log.error(f'Device Not Found {data.potAddr}')
            return jsonify({'error':f'Device Not Found {data.potAddr}'}),500
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

def bus_Voltage(device=None,addr=0x29):
    try:
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

app.config['UPLOAD_FOLDER'] = './data'
ALLOWED_EXTENSIONS = {'txt','csv'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/ivm6311/powerup-script', methods=['GET', 'POST'])
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
                with open('scripts/powerup.csv','w') as file :
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
def adipowerup_script():
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
def adipowerdown_script():
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
@app.route('/ivm6311/powerdown-script', methods=['GET', 'POST'])
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
                with open('scripts/powerdown.csv','w') as file :
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
    # if device:
    if request.method == 'POST':
        # notfound_slave_addresses = slaves(device=device)
        notfound_slave_addresses = []
        if notfound_slave_addresses:
            log.error(f'Deviceses are not found : {notfound_slave_addresses}')
            return jsonify({'error':{'Not Found' : notfound_slave_addresses}}),500
        else:
            state = request.json.get('state')
            onlyivm = request.json.get('onlyivm')
            if not state and not onlyivm:
                log.info(f'Powerup Sequence initiated')
                write_into_slaves('scripts/powerupall.csv')
            elif  state and not onlyivm:
                
                log.info(f'Powerdown Sequence initiated')
                write_into_slaves('scripts/powerdownall.csv')
            elif not state and onlyivm:
                log.info(f'only ivm Powerup Sequence initiated')
                write_into_slaves('scripts/powerup.csv')
            elif  state and onlyivm:
                log.info(f'only ivm Powerdown Sequence initiated')
                write_into_slaves('scripts/powerdown.csv')
            else :
                log.info(f'Powerdown Sequence initiated')

    #     vbso = bus_Voltage(device=device, addr=DEVICE.I2C.VBSOADC)
    #     vbias = bus_Voltage(device=device, addr=DEVICE.I2C.VBAISADC)
    #     return jsonify({'success':{'vbso':vbso,'vbais':vbias}}),200
        return jsonify({'success':{'vbso':4.84,'vbias':6.25}}),200
                
    # else:
    #     log.error(f'MCP not Connected')
    #     return jsonify({'error':'MCP not Connected'}),500

def write_into_slaves(scriptPath=""):
    if scriptPath:
        data = pd.read_csv(scriptPath)
        data.reset_index(inplace=True)
        for index, row in data.iterrows():
            device_data = row['DATA'].split('DATA:')[-1].strip()
            device_data = [int(i, 16) for i  in device_data.split(' ') ]  if (' ' in device_data)  else [int(device_data,16)]
            page=int(row['Page'].split('PAGE:')[-1].strip(), 16)
            device_data.insert(0,page)
            sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
            print('sad =',hex(sad),'data = ',device_data)