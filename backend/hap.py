import EasyMCP2221
from common import read_yaml
import json
DEVICE = read_yaml('config/DeviceAddress.yaml')
SLAVE_ADDR = DEVICE.HAP.IVM6310
from logger import log
def hap_powerUp(device:EasyMCP2221):
    log.info ( f'************************ Hap Power up ****************** ')
    slave = device.I2C_Slave(SLAVE_ADDR)
    # page 0
    slave.write([0xFE,0x00])
    slave.write([0x00,0x01])
    # page 1
    slave.write([0xFE,0x01])
    slave.write([0x0C,0x01])
    # print(f'reg = {hex(0x0C)} data = {hex(int.from_bytes(slave.read_register(0x0C),"little"))}')
    # page 0
    slave.write([0xFE,0x00])
    slave.write([0x15,0x1d])
    slave.write([0x16,0xf4])
    slave.write([0xb7,0x27])
    # print(f'reg = {hex(0xb7)} data = {hex(int.from_bytes(slave.read_register(0xb7),"little"))}')
    # page 1
    slave.write([0xFE,0x01])
    slave.write([0x12,0x03])
    slave.write([0x13,0x03])
    # page 0
    slave.write([0xFE,0x00])
    slave.write([0x4C,0x00])
    # print(f'reg = {hex(0x4C)} data = {hex(int.from_bytes(slave.read_register(0x4C),"little"))}')
    log.info ( f'************************ Hap Power up end ****************** ')

def load_pattren_to_hap(device: EasyMCP2221):
    
    with open('scripts/buttonregops.json','r') as file:
        data = json.load(file)
        # device = EasyMCP2221.Device()
        # call powerup
        hap_powerUp(device=device)
        slave = device.I2C_Slave(SLAVE_ADDR)
        for operation in data:
            if operation.get("addr"):
                page = ( operation.get("addr") & 4095) >>8 # extract page number 
                reg  = operation.get("addr") & 255 # extract page register address 
                # print(f' page = {hex(page)} reg={hex(reg)}')
                # select page 
                slave.write([0xFE,page]) # page write   
                if operation.get('type') == 'MSK_UPD':
                    value = operation.get("val")
                    mask = operation.get("msk")
                    # write operations  
                    read_data = int.from_bytes(slave.read_register(reg),'little')
                    data_write = (value  + ( read_data & ~mask)) & 255
                    slave.write([reg,data_write]) # write data into the register 
                    # post_read_data = int.from_bytes(slave.read_register(reg),'little')
                    # if (hex(page) == '0x2') & (hex(reg) == '0x60'):
                    #     print(f'ptn block change read data :{hex(post_read_data)} value : {hex(value)} mask data : {hex(post_read_data & mask)}')
                    # print(f'{operation.get("addr")} page = {hex(page)} reg={hex(reg)}, pre data = {hex(read_data)},post data = {hex(post_read_data)}')
                    
                if operation.get('type') == 'WRITE':
                    
                    value = operation.get("val")
                    slave.write([reg,value]) # write data into the register 
                    # print(f'PTN:> page = {hex(page)} reg={hex(reg)}, data = {hex(int.from_bytes(slave.read_register(reg),"little"))}')
        slave.write([0xFE,0x02])
        slave.write([0x70,0x01])
        log.info('>>>>>>>>>>>>>>>>> Hap Button Working >>>>>>>>>>>>>>>>')
        
if __name__ == '__main__':
    load_pattren_to_hap()