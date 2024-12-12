
from app import app
from common import get_device
from flask import jsonify,Response
from common import read_yaml 
from pathlib import Path 
import EasyMCP2221
from logger import log
from time import sleep
import pandas as pd 
import re 
import json


DEVICE = read_yaml(Path('config/DeviceAddress.yaml'))

app.config['UPLOAD_FOLDER'] = './data'
ALLOWED_EXTENSIONS = {'txt','csv','json'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/device/sweep',methods=['GET'])
def sweep_devices():
    device = get_device()
    if device:
        "{'unsaved_SRAM': {}, 'status': {'GPIO': {'gp0': 0, 'gp1': 16, 'gp2': 16, 'gp3': 16}, 'dac_ref': 4, 'dac_value': 8, 'adc_ref': 3, 'i2c_dirty': False}, 'VID': 1240, 'PID': 221, 'devnum': 0, 'usbserial': '0000281728', 'open_timeout': 0, 'cmd_retries': 1, 'trace_packets': False, 'debug_messages': 0, 'hidhandler': <hid.device object at 0x0000027D41918400>}"
        log.debug(f'MCP : {device.__dict__}')
        adresses = IVM6311_demo_slaves(device=device)
        if adresses :
                log.error(f'Deviceses are not found : {adresses}')
                return jsonify({'error':{'Not Found' : adresses}}),500
        else:
            vbso = bus_Voltage(device=device, addr=DEVICE.I2C.VBSOADC)
            vbias = bus_Voltage(device=device, addr=DEVICE.I2C.VBAISADC)
            log.debug(f'Deviceses are found Successfully: {DEVICE.I2C}')
            return jsonify({'success':{'Deviceses' : DEVICE.I2C,'vbso':vbso,'vbias':vbias}}),200
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

def IVM6311_demo_slaves(device=None):
    adresses=[]
    for addr in DEVICE.I2C.values():
        try:
            device.I2C_read(addr)
            sleep(0.01)
        except EasyMCP2221.exceptions.NotAckError:
            adresses.append(addr)
            pass
    return adresses

def IVM6310_Dragonfly_demo_slaves(device=None):
    adresses=[]
    for addr in DEVICE.DRAGONFLY.values():
        try:
            device.I2C_read(addr)
            sleep(0.01)
        except EasyMCP2221.exceptions.NotAckError:
            adresses.append(addr)
            pass
    return adresses

# decorator to check weather mcp connected or not 
def device_check(func,device):
    def wrapper():
        if device:
            return func()
        else:
            log.error(f'MCP not Connected')
            return jsonify({'error':'MCP not Connected'}),500
    return wrapper

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
    
def write_into_slaves(device=EasyMCP2221,scriptPath=""):
    # device = get_device() 
    # audio_slaves = {key:value for key,value in DEVICE.I2C.items() if key  in ['IVM6311_1','IVM6311_2','ADI_1','ADI_2']}
    
    if scriptPath:
        if re.findall(r'\.([a-zA-Z0-9]+)$',scriptPath)[-1] in  ['csv','txt'] :
            data = pd.read_csv(scriptPath)
            data.reset_index(inplace=True)
            for index, row in data.iterrows():
                # sleep(0.01)
                if row['Command'] == 'WR-Reg':
                    device_data = row['DATA'].split('DATA:')[-1].strip()
                    device_data = [int(i, 16) for i  in device_data.split(' ') ]  if (' ' in device_data)  else [int(device_data,16)]
                    page=int(row['Page'].split('PAGE:')[-1].strip(), 16)
                    addr=int(row['ADD'].split('ADD:')[-1].strip(), 16)
                    sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
                    # if sad in DEVICE.AUDIO.values():
                    #     device_data.insert(0,page) # insert the page address 
                    device_data.insert(0,addr) # put register address at the begining
                    # print('sad =',hex(sad),'data = ',device_data)
                    device.I2C_Slave(sad).write(device_data)
                if row['Command'] == 'WR-bit':
                    device_data = int(row['DATA'].split('DATA:')[-1].strip(),16)
                    msb = int(row['MSB'].split('MSB:')[-1].strip(),16)
                    lsb = int(row['LSB'].split('LSB:')[-1].strip(),16)
                    addr=int(row['ADD'].split('ADD:')[-1].strip(), 16)
                    sad=int(row['SAD'].split('SAD:')[-1].strip(), 16)
                    slave = device.I2C_Slave(sad)
                    device_read_data=int.from_bytes(slave.read_register(addr),'little')
                    mask = ~(((1 << msb - lsb + 1)) -1) << lsb
                    device_data = [(device_read_data & mask ) | device_data << lsb ]
                    # if sad in DEVICE.AUDIO.values():
                    #     device_data.insert(0,page) # insert the page address 
                    device_data.insert(0,addr) # put register address at the begining
                    # print('sad =',hex(sad),'data = ',device_data)
                    slave.write(device_data)
        
        elif re.findall(r'\.([a-zA-Z0-9]+)$',scriptPath)[-1] == 'json':
            with open(scriptPath,'r') as file :
                data = json.load(file)
                for command in data:
                    msb = command.get('msb')
                    msb = command.get('lsb')
                    sad = command.get('sad')
                    device_data = command.get('data')
                    slave = device.I2C_Slave(sad)
                    if msb == None or lsb == None:
                        slave.write(device_data)
                    else:
                        device_read_data=int.from_bytes(slave.read_register(data[0]),'little')
                        # device_read_data=0 # debugging line 
                        mask = ~(((1 << (msb - lsb + 1))) -1) << lsb
                        device_data = [(device_read_data & mask ) | device_data[1] << lsb ]
                        device_data.insert(0,data[0]) # insert the address of the device 
                        slave.write(device_data)
