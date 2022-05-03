import React, { useEffect } from 'react'
import { PanelProps } from '@grafana/data'
import { SimpleOptions } from 'types'
import Unity from 'react-unity-webgl'
import { getLocationSrv } from '@grafana/runtime'
import { setUnityContext } from 'auxUnityContext'


interface Props extends PanelProps<SimpleOptions> {}



export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {

  var unityContext = setUnityContext(options.folderUnityBuild, options.nameOfFilesUnityBuild)

  //Variables que tengo que pasar a opciones
  //const field_deviceId = "headers_hono-device-id"
  //const property_start = "value_"
  //const property_end = "_properties"
  //const variable_deviceId = "deviceId"
  //const messageUnityToGetData = "GetData"
  //const functionUnityToReceiveData = "SetValues"
  //const folderUnityBuild = "raspberry"
  //const nameOfFilesUnityBuild = "myunityapp"
/*
  const unityContext = new UnityContext({
    loaderUrl: "public/unitybuild/" + options.folderUnityBuild + "/" + options.nameOfFilesUnityBuild + ".loader.js",
    dataUrl: "public/unitybuild/" + options.folderUnityBuild + "/" + options.nameOfFilesUnityBuild + ".data",
    frameworkUrl: "public/unitybuild/" + options.folderUnityBuild + "/" + options.nameOfFilesUnityBuild + ".framework.js",
    codeUrl: "public/unitybuild/" + options.folderUnityBuild + "/" + options.nameOfFilesUnityBuild + ".wasm"
  })*/

  const getAllDevicesId = () => {
    var res:any = new Set()
    data.series.forEach((serie) => {
      serie.fields.forEach((field) => {
        if (field.labels && field.labels[options.field_deviceId] !== null) {
          res.add(field.labels[options.field_deviceId])
        }
      })
    })
    return Array.from<string>(res)
  }

  /**
   * 
   * @param deviceId 
   * @returns JSON with the value of each of the device properties at the given time
   */
  const getDataFromDevice = (deviceId:string) => {
    console.log(data)
    var res:any = {}
    data.series.forEach((serie) => {
      serie.fields.forEach((field) => {
        if(field.name.startsWith(options.property_start) && field.labels
            && field.labels[options.field_deviceId] !== null
            && field.labels[options.field_deviceId] === deviceId) {

            const name = field.name
            const endSubstring = (name.includes(options.property_end)) ? name.indexOf(options.property_end) : name.length
            const nameProperty = name.substring(((options.property_start).length), endSubstring)
            var valueProperty = null

            if(field.state && field.state.calcs && field.state.calcs !== {}) {
              const calcs = field.state.calcs
              valueProperty = (calcs['lastNotNull']) ? calcs.lastNotNull : field.values.get(field.values.length-1)
            }

            res[nameProperty] = valueProperty
        }
      })
    })
    return res
  }

  useEffect(() => {
    unityContext = setUnityContext(options.folderUnityBuild, options.nameOfFilesUnityBuild)
  }, [options])

  useEffect(() => {
    unityContext = setUnityContext(options.folderUnityBuild, options.nameOfFilesUnityBuild)
    if(unityContext !== undefined) unityContext.on(options.messageUnityToGetData, handleOnSendDataToUnity)
  }, [])  

  useEffect(() => {
    getAllDevicesId().forEach((deviceId:string) => {
      if(unityContext !== undefined) unityContext.send(
        deviceId,
        options.functionUnityToReceiveData,
        JSON.stringify(getDataFromDevice(deviceId))
      )
      console.log("UnityContext send to deviceId " + deviceId)
    })
  }, [data]) 

  const handleOnSendDataToUnity = (deviceId : string) => {
      console.log("deviceId: " + deviceId)

      var queryObj:any = {}
      queryObj[("var-" + options.variable_deviceId)] = deviceId

      getLocationSrv().update({
        query: queryObj,
        partial: true,
        replace: true,
      });

      if(unityContext !== undefined){
        unityContext.send(
          deviceId,
          options.functionUnityToReceiveData,
          JSON.stringify(getDataFromDevice(deviceId))
        )
        console.log("UnityContext send")
      } 
    
  }

  if(unityContext !== undefined){
    return (
      <div>
        <Unity style={{width:width, height:height}} unityContext={unityContext}/>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
  
};
