import React, { useEffect, useState } from 'react'
import { DataFrame, PanelProps, VariableModel } from '@grafana/data'
import { SimpleOptions } from 'types'
import Unity, { UnityContext } from 'react-unity-webgl'
import { getLocationSrv, getTemplateSrv } from '@grafana/runtime'


interface Props extends PanelProps<SimpleOptions> { }

enum Mode {
  specificGameObject,
  identifierAsGameObject
}

export const UnityPanel: React.FC<Props> = ({ options, data, width, height }) => {

  const [mode, setMode] = useState<Mode>(Mode.specificGameObject)
  const [unityContext, setUnityContext] = useState<UnityContext>()
  const [isLoaded, setIsLoaded] = useState(false)

  const createUnityContext = () => {
    const folder = options.folderUnityBuild
    const filesName = options.nameOfFilesUnityBuild
    setUnityContext(new UnityContext({
      loaderUrl: "public/unitybuild/" + folder + "/" + filesName + ".loader.js",
      dataUrl: "public/unitybuild/" + folder + "/" + filesName + ".data",
      frameworkUrl: "public/unitybuild/" + folder + "/" + filesName + ".framework.js",
      codeUrl: "public/unitybuild/" + folder + "/" + filesName + ".wasm"
    }))
  }

  /**
   * 
   * @param deviceId 
   * @returns JSON with the value of each of the device properties at the given time
   */

  /*
  const getDataFromDevice = (deviceId:string) => {
    console.log(data)
    let res:any = {}
    data.series.forEach((serie) => {
      serie.fields.forEach((field) => {
        if(field.name.startsWith(options.property_start) && field.labels
            && field.labels[options.field_deviceId] !== null
            && field.labels[options.field_deviceId] === deviceId) {

            const name = field.name
            const endSubstring = (name.includes(options.property_end)) ? name.indexOf(options.property_end) : name.length
            let nameProperty = name.substring(((options.property_start).length), endSubstring)
            const subName = name.substring((endSubstring + options.property_end.length))
            nameProperty = nameProperty + subName
            let valueProperty = null

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
*/

  const addToObject = (res: any, first: number | string, second: number | string, field: string, value: string | number) => {
    let aux_time = (res[first]) ? res[first] : {}
    let aux_id = (res[first] && res[first][second]) ? res[first][second] : {}
    return {
      ...res,
      [first]: {
        ...aux_time,
        [second]: {
          ...aux_id,
          [field]: value

        }
      }
    }
  }

  const addToObjectById = (res: any, time: number, field: string, value: string | number, id: string) => {
    return addToObject(res, id, time, field, value)
  }

  const addToObjectByTime = (res: any, time: number, field: string, value: string | number, id: string) => {
    return addToObject(res, time, id, field, value)
  }

  const getVariables = (variables: string[] = []) => {
    let res: any = {}
    const dashboard_variables: VariableModel[] = getTemplateSrv().getVariables()
    variables = variables.filter((item: string) => item.length > 0 && (!item.startsWith("$") || item.length > 1))
    variables.forEach((item: string) => {
      let newItem = {}

      if (item.startsWith("$")) {
        let var_find = dashboard_variables.find((v: VariableModel) => v.name === item.substring(1))
        if (var_find) {
          newItem = {
            [var_find.name]: getTemplateSrv().replace(item).trim()
          }
        }

      } else {
        let split = item.split(":")
        newItem = (split.length < 2) ? {
          [item]: item
        } : {
          [split[0].trim()]: split.slice(1).join(":").trim()
        }
      }

      res = {
        ...res,
        ...newItem
      }
    })
    return res
  }

  const getAllData = (fields: string[] = []) => {
    //Initialise result and select add function
    let res: any = {}
    const funcAdd: any = (mode === Mode.specificGameObject) ? addToObjectByTime : addToObjectById
    //Filter the series by those with fields I am interested in.
    let series: DataFrame[] = (fields.length === 0) ? data.series : data.series.filter(s => s.fields.some(r => fields.includes(r.name)))
    //Scroll through the series
    series.forEach((serie) => {
      //Search for the time field in the series
      const time_field = serie.fields.find((e) => e["name"] === "Time")
      if (time_field !== undefined) {
        //Search for the fields that correspond to the ones I am looking for
        const searched_fields = (fields.length === 0) ? serie.fields.filter(s => s.name !== "Time") : serie.fields.filter(s => fields.includes(s.name))
        searched_fields.forEach((field) => {
          const id = (field.labels) ? field.labels[options.field_deviceId] : "undefined"
          for (let i = 0; i < serie.length; i++) {
            res = funcAdd(res, time_field.values.get(i), field.name, field.values.get(i), id)
          }
        })
      }
    })
    return res
  }

  const handleDataFromUnity = (deviceId: string) => {
    console.log("deviceId: " + deviceId)

    let queryObj: any = {}
    queryObj[("var-" + options.variable_deviceId)] = deviceId

    getLocationSrv().update({
      query: queryObj,
      partial: true,
      replace: true,
    });
  }

  useEffect(() => {
    setMode((options.useSpecificGameObject) ? Mode.specificGameObject : Mode.identifierAsGameObject)
    createUnityContext()
  }, [options])

  useEffect(() => {
    if (unityContext !== undefined) {
      unityContext.on(options.messageUnityToGetData, handleDataFromUnity)
      unityContext.on("loaded", () => setIsLoaded(true))
    }
  }, [unityContext])

  useEffect(() => {
    console.log("useEffect data options")
    if (unityContext !== undefined && isLoaded) {
      let vars = getVariables(options.variables_to_send)
      if (Object.keys(vars).length > 0) {
        vars = {
          variables: vars
        }
      }
      let dataToSend = getAllData(options.fields_to_send)

      if (mode === Mode.specificGameObject) {
        dataToSend = { ...vars, series: dataToSend }
        console.log(dataToSend)
        unityContext.send(
          options.gameObjectUnityToReceiveData,
          options.functionUnityToReceiveData,
          JSON.stringify(dataToSend)
        )
      } else {
        Object.keys(dataToSend).forEach((id: string) => {
          let data_id = { ...vars, series: dataToSend[id] }
          console.log(data_id)
          unityContext.send(
            id,
            options.functionUnityToReceiveData,
            JSON.stringify(data_id)
          )
        })
      }
      console.log("Todo enviado")
    }
  }, [data, options, isLoaded, mode])

  return (unityContext !== undefined) ?
    <div>
      <Unity style={{ width: width, height: height }} unityContext={unityContext} tabIndex={1} />
    </div>
    : <div></div>

};
