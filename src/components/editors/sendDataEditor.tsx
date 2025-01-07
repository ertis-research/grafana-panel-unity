import { SelectableValue, StandardEditorProps } from '@grafana/data'
import { Field, Input, Select } from '@grafana/ui'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { defaultSendAllData, defaultSendData, defaultSendDataById } from 'utils/defaults'
import { enumToSelect } from 'utils/functions'
import { getQueryOptions } from 'utils/grafana'
import { ISelect, SendData, SendDataMode, SendAllData, SendDataById } from 'utils/types'

interface Props extends StandardEditorProps<SendData> { }

export const SendDataEditor: React.FC<Props> = ({ item, value, onChange, context }) => {
    if (!value) {
        value = defaultSendData;
    }

    const modeOptions: ISelect[] = enumToSelect(SendDataMode)
    const [mode, setMode] = useState<SelectableValue<SendDataMode>>({ label: value.mode, value: value.mode })

    const queryOptions: ISelect[] = getQueryOptions(context.data)
    const [query, setQuery] = useState<SelectableValue<string>>({ label: value.grafanaQuery, value: value.grafanaQuery })

    const handleOnChangeUnityFunction = (event: ChangeEvent<HTMLInputElement>) => {
        value.unityFunc = event.currentTarget.value
        onChange(value)
    }

    const handleOnChangeGroupBy = (event: ChangeEvent<HTMLInputElement>) => {
        value.groupBy = event.currentTarget.value
        onChange(value)
    }

    const handleOnChangeIdColumn = (event: ChangeEvent<HTMLInputElement>) => {
        value.config = {
            ...value.config,
            idColumn: event.currentTarget.value
        }
        onChange(value)
    }

    const handleOnChangeRecvGameObj = (event: ChangeEvent<HTMLInputElement>) => {
        value.config = {
            ...value.config,
            recvGameObj: event.currentTarget.value
        }
        onChange(value)
    }

    const setDefaultConfigByMode = () => {
        switch (mode.value) {
            case SendDataMode.sameGameObj:
                value.config = defaultSendAllData
                break
            default:
                value.config = defaultSendDataById
        }
        onChange(value)
    }

    useEffect(() => {
        if (mode.value !== undefined && mode.value !== value.mode) {
            value.mode = mode.value
            setDefaultConfigByMode()
            onChange(value)
        }
    }, [mode])

    useEffect(() => {
        if (query.value !== undefined && query.value !== value.grafanaQuery) {
            value.grafanaQuery = query.value
            onChange(value)
        }
    }, [query])


    const getSendDataById = (config: SendDataById) => <Field label="ID column" required description="">
        <Input value={config.idColumn} onChange={handleOnChangeIdColumn} />
    </Field>

    const getSendAllData = (config: SendAllData) => <Field label="Id game object" required description="">
        <Input value={config.recvGameObj} onChange={handleOnChangeRecvGameObj} />
    </Field>

    const getConfigByMode = () => {
        if (value.mode === SendDataMode.sameGameObj) {
            return getSendAllData(value.config as SendAllData)
        } else {
            return getSendDataById(value.config as SendDataById)
        }
    }

    const getFilterData = <div>

    </div>

    return <div>
        <Field label="Grafana query" required description="">
            <Select
                value={query}
                options={queryOptions}
                onChange={(v) => setQuery(v)}
                menuPosition='fixed'
            />
        </Field>
        <Field label="Mode" required description="">
            <Select
                value={mode}
                options={modeOptions}
                onChange={(v) => setMode(v)}
                menuPosition='fixed'
            />
        </Field>
        {getConfigByMode()}
        <Field label="Unity function" required description="">
            <Input value={value.unityFunc} required onChange={handleOnChangeUnityFunction} />
        </Field>
        <Field label="Field group by" description="Semicolon separator if more than one">
        <Input value={value.groupBy} onChange={handleOnChangeGroupBy} />
        </Field>
        {getFilterData}
    </div>
}
