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
def powerup_script():
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
                    log.info('Powerup Script uploaded sucessfully')
            return jsonify({'success':'Powerup Script uploaded sucessfully'}),200
        except Exception as e:
            log.info(f'Powerup Script not uploaded in server : {e}')
            return jsonify({'error':'Powerup Script not uploaded in server'}),500
            
    if request.method == 'GET': 
        return '''
        <!doctype html>
        <title>Upload Power Up Script</title>
        <h1>Upload Power Up Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''


@app.route('/ivm6311/powerdown-script', methods=['GET', 'POST'])
def powerdown_script():
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
                log.warning('No selected file')

                return jsonify({'success':'Powerdown Script uploaded sucessfully'}),200
        except Exception as e:
            log.info(f'Powerdown Script not uploaded in server : {e}')
            return jsonify({'error':'Powerdown Script not uploaded in server'}),500
    if request.method == 'GET':
        return '''
        <!doctype html>
        <title>Upload Power down Script</title>
        <h1>Upload Power down Script</h1>
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
            notfound_slave_addresses = slaves(device=device)
            if notfound_slave_addresses:
                log.error(f'Deviceses are not found : {notfound_slave_addresses}')
                return jsonify({'error':{'Not Found' : notfound_slave_addresses}}),500
            else:
                state = request.json.get('state')
                if state:
                    log.info(f'Powerup Sequence initiated')
                else :
                    log.info(f'Powerdown Sequence initiated')

        vbso = bus_Voltage(device=device, addr=DEVICE.I2C.VBSOADC)
        vbias = bus_Voltage(device=device, addr=DEVICE.I2C.VBAISADC)
        return jsonify({'success':{'vbso':vbso,'vbais':vbias}}),200
                
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500
