import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ComponentData {
  componentName: string
  description: string
  code: string
  preview: React.FC // Keep preview for now
}

export interface InstallationStep {
  id: number
  title: string
  commands?: string[]
  codeSnippets?: {
    filename: string
    language: string
    code: string
  }[]
}

export interface PropsData {
  componentName: string
  props: {
    propName: string
    description: string
    type: string
    defaultValue: string
  }[]
}

export interface ComponentState {
  currentComponentName: string | null
  currentComponentData: ComponentData | null
  installationSteps: {
    cli: InstallationStep[]
    manual: InstallationStep[]
  }
  propsData: PropsData[]
}

const initialState: ComponentState = {
  currentComponentName: null,
  currentComponentData: null,
  installationSteps: { cli: [], manual: [] },
  propsData: [],
}

export const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    setInstallationSteps(state, action: PayloadAction<{ cli: InstallationStep[], manual: InstallationStep[] }>) {
      state.installationSteps = action.payload
    },
    setPropsData(state, action: PayloadAction<PropsData[]>) {
      state.propsData = action.payload
    },
    setCurrentComponentData(state, action: PayloadAction<ComponentData>) {
      state.currentComponentData = action.payload
      state.currentComponentName = action.payload.componentName
    },
  },
})

export const { setInstallationSteps, setPropsData, setCurrentComponentData } = componentSlice.actions
export default componentSlice.reducer
