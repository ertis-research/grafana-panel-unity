import React, { useEffect } from 'react'
import { PanelProps } from '@grafana/data'
import { SimpleOptions } from 'types'
import Unity, { UnityContext } from 'react-unity-webgl'
import { getLocationSrv } from '@grafana/runtime'


interface Props extends PanelProps<SimpleOptions> {}

const unityContext = new UnityContext({
  loaderUrl: "public/unitybuild/raspberry/myunityapp.loader.js",
  dataUrl: "public/unitybuild/raspberry/myunityapp.data",
  frameworkUrl: "public/unitybuild/raspberry/myunityapp.framework.js",
  codeUrl: "public/unitybuild/raspberry/myunityapp.wasm"
})

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {

  //Variables que tengo que pasar a opciones
  const field_deviceId = "headers_hono-device-id"
  const property_start = "value_"
  const property_end = "_properties"
  const variable_deviceId = "deviceId"
  const messageUnityToGetData = "GetData"
  const functionUnityToReceiveData = "SetValues"
  /**
   * 
   * @param deviceId 
   * @returns JSON with the value of each of the device properties at the given time
   */
  const getDataFromDevice = (deviceId:string) => {
    var res:any = {}
    data.series.forEach((serie) => {
      serie.fields.forEach((field) => {
        if(field.name.startsWith(property_start) && field.labels
            && field.labels[field_deviceId] !== null
            && field.labels[field_deviceId] === deviceId) {

            const name = field.name
            const endSubstring = (name.includes(property_end)) ? name.indexOf(property_end) : name.length
            const nameProperty = name.substring(((property_start).length), endSubstring)
            var valueProperty = null

            if(field.state && field.state.calcs && field.state.calcs !== {}) {
              const calcs = field.state.calcs
              valueProperty = (calcs['lastNotNull']) ? calcs.lastNotNull : Object.keys(calcs)[0]
            }

            res[nameProperty] = valueProperty
        }
      })
    })
    return res
  }

  useEffect(() => {
    unityContext.on(messageUnityToGetData, handleOnSendDataToUnity)
  }, [])  

  const handleOnSendDataToUnity = (deviceId : string) => {
      console.log("deviceId: " + deviceId)

      var queryObj:any = {}
      queryObj[("var-" + variable_deviceId)] = deviceId

      getLocationSrv().update({
        query: queryObj,
        partial: true,
        replace: true,
      });

      unityContext.send(
        deviceId,
        functionUnityToReceiveData,
        JSON.stringify(getDataFromDevice(deviceId))
      )
      console.log("UnityContext send")
    
  }

  return (
    <div>
      <Unity style={{width:width, height:height}} unityContext={unityContext}/>
    </div>
  )
};
