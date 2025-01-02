from common import read_yaml
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
from common_routes import IVM6310_Hap_demo_slaves, write_into_slaves
from time import sleep
from hap import load_button_powerUp, load_button_clk, load_button_pattern

DEVICE = read_yaml('config/DeviceAddress.yaml')

@app.route('/hap/hap-setup-state',methods=['GET'])
def Ivm6310_hap_setup():
    device = get_device()
    #check weather the mcp is connected or not 
    if device:
    # if True: # debugging purpose line 
        # check the request 
        if request.method == 'GET':
            notfound_slave_addresses = IVM6310_Hap_demo_slaves(device=device)
            # notfound_slave_addresses = [] # debugging purpose line 
            # check for the salve devices are connected 
            if notfound_slave_addresses:
                log.error(f'Deviceses are not found : {notfound_slave_addresses}')
                return jsonify({'error':{'message':'Devices not Found','Deviceses' : str(notfound_slave_addresses)}}),500
            else:
            #     log.error(f'Deviceses are  found : {notfound_slave_addresses}')
            #     return jsonify({'success':{'message':'IVM6310 HAP Button demo running','Deviceses':DEVICE.HAP}}),200
            # else:
                [button]=list(DEVICE.HAP.keys())
                load_button_powerUp(device=device)
                # # write low pass filter
                # write_into_slaves(device=device, scriptPath='scripts/LP_hapt_patter.csv')
                load_button_clk(device=device)
                load_button_pattern(device=device)
                log.error(f'IVM6310 HAP Button demo running')
                return jsonify({'success':{'message':'IVM6310 HAP Button demo running','Deviceses':DEVICE.HAP}}),200
               
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500