
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
        adresses = slaves(device=device)
        if adresses :
                log.error(f'Deviceses are not found : {adresses}')
                return jsonify({'error':{'Not Found' : adresses}}),500
        else:
            log.error(f'Deviceses are not found : {DEVICE.I2C}')
            return jsonify({'error':{'Not Found' : DEVICE.I2C}}),200
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500

def slaves(device=None):
    adresses=[]
    for addr in DEVICE.I2C.values():
        try:
            device.I2C_read(addr)
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