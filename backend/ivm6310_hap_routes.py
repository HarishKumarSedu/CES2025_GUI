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
from common_routes import IVM6310_Hap_demo_slaves
from time import sleep

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
                log.error(f'Deviceses are  found : {notfound_slave_addresses}')
                return jsonify({'success':{'message':'IVM6310 HAP Button demo running','Deviceses':DEVICE.HAP}}),200
            # else:
            #     [LF_Speaker,RH_Speaker]=list(DEVICE.HAP.keys())
                # get the status of the slaves 
                # slaves_status = IVM6310_Status(device=device)
                # # slaves_status = [{DEVICE.DRAGONFLY.IVM6310_LF:'OFF'},{DEVICE.DRAGONFLY.IVM6310_RH:'OFF'}] # debugging line 
                # if slaves_status[0].get(LF_Speaker) == 'OFF':
                #     # run the Leftdragon fly script 
                #     write_into_slaves(device=device,scriptPath='scripts/DragonFly_left.json')
                #     log.info(f'IVM6310 Dragon fly demo left speaker scripte written')
                # if slaves_status[1].get(RH_Speaker) == 'OFF':
                #     # run the Leftdragon fly script 
                #     write_into_slaves(device=device,scriptPath='scripts/DragonFly_right.json')
                #     log.info(f'IVM6310 Dragon fly demo right speaker scripte written')
                # # get the slaves status after writing script 
                # slaves_status = IVM6310_Status(device=device)
                # # slaves_status = [{DEVICE.DRAGONFLY.IVM6310_LF:'ON'},{DEVICE.DRAGONFLY.IVM6310_RH:'ON'}] # debugging line 
                # if (slaves_status[0].get(LF_Speaker) == 'ON') & \
                #     (slaves_status[1].get(RH_Speaker) == 'ON') :
                #     log.info(f'IVM6310 Dragon fly demo is on')
                    # return jsonify({'success':{'message':'IVM6310 HAP Button demo running','Deviceses':DEVICE.HAP}}),200
            # else:
            #     log.error(f'IVM6310 Dragon HAP Button is OFF check with hardware')
            #     return jsonify({'error':'IVM6310 HAP Button demo stoped!, please check hardware'}),500
                    # write_into_slaves(device=device,scriptPath='scripts/DragonFly_right.json')
                    # write_into_slaves(device=device,scriptPath='scripts/DragonFly_left.json')
                    # slaves_status = IVM6310_Status(device=device)
                    # print(slaves_status)
                    # return jsonify({'success':{'message':'IVM6310 Dragon fly demo running','Deviceses':DEVICE.DRAGONFLY}}),200
    else:
        log.error(f'MCP not Connected')
        return jsonify({'error':'MCP not Connected'}),500