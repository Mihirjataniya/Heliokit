import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ComponentData {
  componentName: string
  description: string
  code: string
  preview: React.FC
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
  allComponents: ComponentData[]
}

const initialState: ComponentState = {
  currentComponentName: null,
  currentComponentData: null,
  installationSteps: { cli: [], manual: [] },
  propsData: [],
  allComponents: [],
}

export const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    setAllComponents(state, action: PayloadAction<ComponentData[]>) {
      state.allComponents = action.payload
    },
    setInstallationSteps(state, action: PayloadAction<{ cli: InstallationStep[], manual: InstallationStep[] }>) {
      state.installationSteps = action.payload
    },
    setPropsData(state, action: PayloadAction<PropsData[]>) {
      state.propsData = action.payload
    },
    setCurrentComponent(state, action: PayloadAction<string>) {
      state.currentComponentName = action.payload
      const index = state.allComponents.findIndex(comp => comp.componentName === action.payload)
      if (index !== -1) {
        state.currentComponentData = state.allComponents[index]
      } else {
        state.currentComponentData = null
      }
    },
  },
})

export const { setAllComponents, setInstallationSteps, setPropsData, setCurrentComponent } = componentSlice.actions
export default componentSlice.reducer
