import StatePool from 'state-pool'

const initialDeviceState = {
    state: false,
    onlyivm:false
      
  }
  //  key based approch
export const initialDeviceStatus = StatePool.createState(initialDeviceState);

// global state based approch 

// export let deviceState = createGlobalState(initialDeviceState)

export const BASE_URL = 'http://localhost:5000'