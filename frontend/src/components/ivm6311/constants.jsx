export const BASE_URL = 'http://localhost:5000'
export const DEVICE_SWEEP_URL = BASE_URL+'/device/sweep'
export const GET_SETUP_STATE = BASE_URL+'/ivm6311/setup-state'
export const ADC_CHECK_URL = BASE_URL+'/ivm6311/getadc/'
export const SET_POTVALUE_URL = BASE_URL+'/ivm6311/setpot'
export const IVM_POWERUP_SCRIPT_URL = BASE_URL+'/ivm6311/powerup-script-ivm-only'
export const IVM_POWERDOWN_SCRIPT_URL = BASE_URL+'/ivm6311/powerdown-script-ivm-only'
export const POWERUP_ALL_SCRIPT_URL = BASE_URL+'/ivm6311/powerup-all-script'
export const POWERDOWN_ALL_SCRIPT_URL = BASE_URL+'/ivm6311/powerdown-all-script'
export const START_END_URL = BASE_URL+'/ivm6311/start-end'
export const START_END_IVM_ONLY_URL = BASE_URL+'/ivm6311/start-end-ivm-only'

export const SLAVE_DEVICES={
    "IVM6311_1" :  "0x6D",
    "IVM6311_2" :  "0x6C",
    "ADI_1"     :  "0x34",
    "ADI_2"     :  "0x36",
    "VBSOPOT"   :  "0x2F",
    "VBSOADC"   :  "0x29",
    "VBAISPOT"  :  "0x2D",
    "VBAISADC"  :  "0x18",
}