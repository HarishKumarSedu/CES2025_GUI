
from app import app
from common import get_device
from flask import jsonify,Response
from common import read_yaml 
from pathlib import Path 
import EasyMCP2221
from logger import log

DEVICE = read_yaml(Path('config/DeviceAddress.yaml'))

@app.route('/device/sweep',methods=['GET'])
def sweep_devices():
    device = get_device()
    if device:
        "{'unsaved_SRAM': {}, 'status': {'GPIO': {'gp0': 0, 'gp1': 16, 'gp2': 16, 'gp3': 16}, 'dac_ref': 4, 'dac_value': 8, 'adc_ref': 3, 'i2c_dirty': False}, 'VID': 1240, 'PID': 221, 'devnum': 0, 'usbserial': '0000281728', 'open_timeout': 0, 'cmd_retries': 1, 'trace_packets': False, 'debug_messages': 0, 'hidhandler': <hid.device object at 0x0000027D41918400>}"
        log.debug(f'MCP : {device.__dict__}')
        adresses,notfound_addresses = slaves(device=device)
        if adresses and notfound_addresses:
                log.error(f'Deviceses are not found : {notfound_addresses}')
                return jsonify({'error':{'Not Found' : notfound_addresses}}),500
        if adresses and not notfound_addresses:
                log.info(f'Sweep sucessful: {DEVICE.I2C}')
                return jsonify({'successful':'All Deviceses are found'}),200
        else:
            log.error(f'Deviceses are not found : {DEVICE.I2C}')
            return jsonify({'error':{'Not Found' : DEVICE.I2C}}),500
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

def slaves(device=None):
    adresses=[]
    notfound_addresses={}
    for addr in range(0, 0x80):
        try:
            device.I2C_read(addr)
            adresses.append(addr)
        except EasyMCP2221.exceptions.NotAckError:
            pass
    # check the scan addresses are present in the provided device address configuration 
    notfound_addresses = {}
    for device_name, adress in DEVICE.I2C.items():
        if adress in adresses:
            pass
        else:
            notfound_addresses.update({
                device_name:adress
            })
    return adresses, notfound_addresses

# decorator to check weather mcp connected or not 
def device_check(func,device):
    def wrapper():
        if device:
            return func()
        else:
            log.error(f'MCP not Connected')
            return jsonify({'error':'MCP not Connected'}),500
    return wrapper