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
from common_routes import IVM6310_Dragonfly_demo_slaves,write_into_slaves,allowed_file
from time import sleep

DEVICE = read_yaml(Path('config/DeviceAddress.yaml'))

@app.route('/ivm6310/dragon-fly-setup-state',methods=['GET'])
def Ivm6310_dragonfly_setup():
    device = get_device()
    #check weather the mcp is connected or not 
    if device:
    # if True: # debugging purpose line 
        # check the request 
        if request.method == 'GET':
            notfound_slave_addresses = IVM6310_Dragonfly_demo_slaves(device=device)
            # notfound_slave_addresses = [] # debugging purpose line 
            # check for the salve devices are connected 
            if notfound_slave_addresses:
                log.error(f'Deviceses are not found : {notfound_slave_addresses}')
                return jsonify({'error':{'message':'Devices not Found','Deviceses' : notfound_slave_addresses}}),500
            else:
                [LF_Speaker,RH_Speaker]=list(DEVICE.DRAGONFLY.keys())
                # get the status of the slaves 
                slaves_status = IVM6310_Status(device=device)
                # slaves_status = [{DEVICE.DRAGONFLY.IVM6310_LF:'OFF'},{DEVICE.DRAGONFLY.IVM6310_RH:'OFF'}] # debugging line 
                if slaves_status[0].get(LF_Speaker) == 'OFF':
                    # run the Leftdragon fly script 
                    write_into_slaves(device=device,scriptPath='scripts/DragonFly_left.json')
                    log.info(f'IVM6310 Dragon fly demo left speaker scripte written')
                if slaves_status[1].get(RH_Speaker) == 'OFF':
                    # run the Leftdragon fly script 
                    write_into_slaves(device=device,scriptPath='scripts/DragonFly_right.json')
                    log.info(f'IVM6310 Dragon fly demo right speaker scripte written')
                # get the slaves status after writing script 
                slaves_status = IVM6310_Status(device=device)
                # slaves_status = [{DEVICE.DRAGONFLY.IVM6310_LF:'ON'},{DEVICE.DRAGONFLY.IVM6310_RH:'ON'}] # debugging line 
                if (slaves_status[0].get(LF_Speaker) == 'ON') & \
                    (slaves_status[1].get(RH_Speaker) == 'ON') :
                    log.info(f'IVM6310 Dragon fly demo is on')
                    return jsonify({'success':{'message':'IVM6310 Dragon fly demo running','Deviceses':DEVICE.DRAGONFLY}}),200
                else:
                    log.error(f'IVM6310 Dragon fly demo is OFF check with hardware')
                    return jsonify({'error':'IVM6310 Dragon fly demo stoped!, please check hardware'}),500
                    # write_into_slaves(device=device,scriptPath='scripts/DragonFly_right.json')
                    # write_into_slaves(device=device,scriptPath='scripts/DragonFly_left.json')
                    # slaves_status = IVM6310_Status(device=device)
                    # print(slaves_status)
                    # return jsonify({'success':{'message':'IVM6310 Dragon fly demo running','Deviceses':DEVICE.DRAGONFLY}}),200
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

def IVM6310_Status(device:EasyMCP2221):
    slaves = DEVICE.DRAGONFLY
    ############################# 
    # @ to check the device in the IVM6310 configuration for external boost 
    # @ page 0 - Reg 0x15 - value - 0x1D 
    # @ page 0 - Reg 0xB7 - value - 0x27
    # @ page 1 - Reg 0x12 - value - 0x03
    # @ page 1 - Reg 0x13 - value - 0x03
    # @ Page change Register address 0xFE
    ############################# 
    slaves_status = []
    for name, address in slaves.items():
        slave = device.I2C_Slave(address)
        def reg_value_check ( page,reg,value) : 
            slave.write([0xFE,page])
            data = hex(int.from_bytes(slave.read_register(reg),'little'))
            # print(f'page = {page}, reg = {hex(reg)}, data = {data} status : {data == hex(value)} ')
            return  data == hex(value)
        
        if reg_value_check(page=0,reg=0x15,value=0x1D) & \
           reg_value_check(page=0,reg=0xB7,value=0x27) & \
           reg_value_check(page=1,reg=0x12,value=0x03) & \
           reg_value_check(page=1,reg=0x13,value=0x03) \
           :
               slaves_status.append({
                   name : "ON"
               })
        else:
               slaves_status.append({
                   name : "OFF"
               })
    return slaves_status
            

@app.route('/ivm6310/dragon-fly-left-script', methods=['GET', 'POST'])
def ivm6310_dragonfly_leftspeaker_script():
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
                data = pd.read_csv(StringIO(data),sep=';',index_col=False)
                data.reset_index(inplace=True)
                with open('scripts/DragonFly_left.csv','w') as file :
                    data.to_csv(file)
                # make the json data from text 
                script_data = []
                for index, row in data.iterrows():
                    if row['Command'] == 'WR-Reg':
                        device_data = row['DATA'].split('DATA:')[-1].strip()
                        device_data = [int(i, 16) for i  in device_data.split(' ') ]  if (' ' in device_data)  else [int(device_data,16)]
                        page=int(row['Page'].split('PAGE:')[-1].strip(), 16)
                        addr=int(row['ADD'].split('ADD:')[-1].strip(), 16)
                        sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
                        msb = None
                        lsb = None
                    elif row['Command'] == 'WR-bit':
                        device_data = row['DATA'].split('DATA:')[-1].strip()
                        device_data = [int(i, 16) for i  in device_data.split(' ') ]  if (' ' in device_data)  else [int(device_data,16)]
                        page=int(row['Page'].split('PAGE:')[-1].strip(), 16)
                        addr=int(row['ADD'].split('ADD:')[-1].strip(), 16)
                        sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
                        msb = int(row['MSB'].split('MSB:')[-1].strip(),16)
                        lsb = int(row['LSB'].split('LSB:')[-1].strip(),16)
                    
                    # if sad in DEVICE.AUDIO.values():
                    #     device_data.insert(0,page) # insert the page address 
                    device_data.insert(0,addr) # put register address at the begining
                    script_data.append({
                        "sad":sad,
                        "data" : device_data,
                        "msb" : msb,
                        "lsb" : lsb
                    })
                if script_data:
                    with open('scripts/DragonFly_left.json','w') as file :
                        json.dump(script_data,file)
                    return jsonify({'success':'IVM6310 Dragon fly left speaker script uploaded successfully'}),200
                else:
                    return jsonify({'error':'IVM6310 Dragon fly left speaker script is empty'}),500
        except Exception as e:
            log.info(f'IVM6310 Dragon fly left speaker script  not uploaded in server : {e}')
            return jsonify({'error':'IVM6310 Dragon fly left speaker  script not uploaded in server'}),500
    if request.method == 'GET':
        return '''
        <!doctype html>
        <title>Upload IVM6310 Dragon fly Left Script</title>
        <h1>Upload IVM6310 Dragon fly Left Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''
@app.route('/ivm6310/dragon-fly-right-script', methods=['GET', 'POST'])
def ivm6310_dragonfly_rightspeaker_script():
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
                data = pd.read_csv(StringIO(data),sep=';',index_col=False)
                data.reset_index(inplace=True)
                with open('scripts/DragonFly_right.csv','w') as file :
                    data.to_csv(file)
                # make the json data from text 
                script_data = []
                for index, row in data.iterrows():
                    if row['Command'] == 'WR-Reg':
                        device_data = row['DATA'].split('DATA:')[-1].strip()
                        device_data = [int(i, 16) for i  in device_data.split(' ') ]  if (' ' in device_data)  else [int(device_data,16)]
                        page=int(row['Page'].split('PAGE:')[-1].strip(), 16)
                        addr=int(row['ADD'].split('ADD:')[-1].strip(), 16)
                        sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
                        msb = None
                        lsb = None
                    elif row['Command'] == 'WR-bit':
                        device_data = row['DATA'].split('DATA:')[-1].strip()
                        device_data = [int(i, 16) for i  in device_data.split(' ') ]  if (' ' in device_data)  else [int(device_data,16)]
                        page=int(row['Page'].split('PAGE:')[-1].strip(), 16)
                        addr=int(row['ADD'].split('ADD:')[-1].strip(), 16)
                        sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
                        msb = int(row['MSB'].split('MSB:')[-1].strip(),16)
                        lsb = int(row['LSB'].split('LSB:')[-1].strip(),16)
                    
                    # if sad in DEVICE.AUDIO.values():
                    #     device_data.insert(0,page) # insert the page address 
                    device_data.insert(0,addr) # put register address at the begining
                    script_data.append({
                        "sad":sad,
                        "data" : device_data,
                        "msb" : msb,
                        "lsb" : lsb
                    })
                if script_data:
                    with open('scripts/DragonFly_right.json','w') as file :
                        json.dump(script_data,file)
                    return jsonify({'success':'IVM6310 Dragon fly right speaker script uploaded successfully'}),200
                else:
                    return jsonify({'error':'IVM6310 Dragon fly right speaker script is empty'}),500
        except Exception as e:
            log.info(f'IVM6310 Dragon fly right speaker script  not uploaded in server : {e}')
            return jsonify({'error':'IVM6310 Dragon fly right speaker  script not uploaded in server'}),500
    if request.method == 'GET':
        return '''
        <!doctype html>
        <title>Upload IVM6310 Dragon fly Left Script</title>
        <h1>Upload IVM6310 Dragon fly Left Script</h1>
        <form method=post enctype=multipart/form-data name="startup-script">
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''

            
        
        
        
        
    