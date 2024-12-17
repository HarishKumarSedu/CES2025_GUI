import os
from box.exceptions import BoxValueError
import yaml
from logger import log 
import json
from ensure import ensure_annotations
from box import ConfigBox
from typing import Any
from EasyMCP2221 import Device


@ensure_annotations
def read_yaml(path_to_yaml) -> ConfigBox:
    try:
        with open(path_to_yaml) as yaml_file:
            content = yaml.safe_load(yaml_file)
            log.info(f"yaml file: {path_to_yaml} loaded successfully")
            return ConfigBox(content)
    except BoxValueError:
        raise ValueError("yaml file is empty")
    except Exception as e:
        raise e

def get_device(deviceNo=0):
    try:
        device = Device(devnum=deviceNo)
        return device
    except Exception as e :
        log.error(e)
        return None
        
        
