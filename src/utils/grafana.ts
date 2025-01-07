import { ISelect } from "./types"
import { LocationService, TemplateSrv } from "@grafana/runtime"
import { DataFrame, LoadingState, PanelData, VariableModel } from "@grafana/data"
import { safeMergeLists } from "./functions"

export const getOptionsVariable = (templateSrv: TemplateSrv): ISelect[] => {
    return templateSrv.getVariables()
        .map((item: VariableModel) => {
            return {
                label: (item.label) ? item.label : item.name,
                value: item.name
            }
        })
}

export const setGrafanaVariable = (location: LocationService, varName: string, value: string | number) => {
    let queryObj: any = {}
    queryObj[("var-" + varName)] = value
    location.partial(queryObj, true)
}

export const getQueryOptions = (data: DataFrame[]): ISelect[] => {
    return data.map((f: DataFrame) => {
        const id = (f.refId) ? f.refId : ""
        return {
            value: id,
            label: id
        }
    })
}

// Ahora mismo no estoy teniendo en cuenta el filtro de fields
export const getAllData = (data: PanelData) => {
    let res: any = []

    if (data.state === LoadingState.Done) {
        data.series.forEach((serie) => {
            let resSerie = Array(serie.length).fill({});
            serie.fields.forEach((field) => {
                const name = field.name
                for (let i = 0; i < serie.length; i++) {
                    resSerie[i] = {
                        ...resSerie[i],
                        ...field.labels,
                        [name]: field.values.get(i)
                    }
                }
            })
            res.push(resSerie)
        })
    }

    console.log("Format data", res)
    return res
}

export const groupBy = (data: any[], groupId: string[], isObject = true) => {
    let res: any = {}

    if (groupId.length > 0) {
        const unionSeries: any[] = data.flat()
        unionSeries.forEach((item) => {
            const groupKey = item[groupId[0]];
            if (!res[groupKey]) {
                res[groupKey] = [];
            }
            const { [groupId[0]]: _, ...rest } = item
            res[groupKey].push(rest)
        })
        if (groupId.length > 1) {
            Object.entries(res).forEach(([key, item]) => {
                res[key] = groupBy(item as any[], groupId.slice(1))
            })
        } else {
            Object.entries(res).forEach(([key, item]) => {
                res[key] = safeMergeLists(item as any[])
            })
        }
    }

    return res
}

/*
export const getData = (data: PanelData, options: SendData) => {
    //Initialise result and select add function
    let res: any = []

    if(options.grafanaQuery.trim() !== '') {
        //get specific query
        const serieData: DataFrame[] = data.series.filter((serie) => serie.refId === options.grafanaQuery)
        
        // set function to group
        const funcAdd: any = (options.mode === SendDataMode.sameGameObj) ? addToObjectByTime : addToObjectById
        
    }

    
    let series: DataFrame[] = (config.filter.columns.length === 0) ? data.series : data.series.filter(s => s.fields.some(r => config.filter.columns.includes(r.name)))
    //Scroll through the series
    series.forEach((serie) => {
        //Search for the time field in the series
        const time_field = serie.fields.find((e) => e["name"] === "Time")
        if (time_field !== undefined) {
            //Search for the fields that correspond to the ones I am looking for
            const searched_fields = (config.filter.columns.length === 0) ? serie.fields.filter(s => s.name !== "Time") : serie.fields.filter(s => config.filter.columns.includes(s.name))
            searched_fields.forEach((field) => {
                const id = (field.labels) ? field.labels[config] : "undefined"
                for (let i = 0; i < serie.length; i++) {
                    res = funcAdd(res, time_field.values.get(i), field.name, field.values.get(i), id)
                }
            })
        }
    })
    return res
}
*/
