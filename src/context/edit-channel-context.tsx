'use client'

import {
  createContext,
  type Dispatch,
  useContext,
  useMemo,
  useReducer,
} from 'react'

type EditChannelModal = {
  [key: string]: boolean
}
type EditChannelModalDispatch = {
  type: 'APPEND',
  payload: {
    channelId: keyof EditChannelModal,
    value: EditChannelModal['key'],
  },
}
type EditChannelModalReducer = {
  value: EditChannelModal,
  dispatch: Dispatch<EditChannelModalDispatch>,
}

const modalReducer = (
  state: EditChannelModal,
  action: EditChannelModalDispatch,
): EditChannelModal => {
  switch (action.type) {
    case 'APPEND':
      return {
        ...state,
        [action.payload.channelId]: action.payload.value,
      }
    default:
      return state
  }
}

const initialValue = {}

const EditChannelModalContext = createContext<EditChannelModalReducer>(
  { value: initialValue, dispatch: () => initialValue },
)

export const EditChannelModalContextProvider = ({ children }: { children?: React.ReactNode }) => {
  const [value, dispatch] = useReducer(modalReducer, initialValue)
  const contextValue = useMemo(() => ({ value, dispatch }), [value, dispatch])
  return (
    <EditChannelModalContext.Provider value={contextValue}>
      {children}
    </EditChannelModalContext.Provider>
  )
}

const useAbstractDispatch = (channelId: string, value: boolean) => {
  const { dispatch } = useContext(EditChannelModalContext)
  return () => {
    dispatch({
      type: 'APPEND',
      payload: {
        channelId,
        value,
      },
    })
  }
}

export const useEditChannelValue = () => useContext(EditChannelModalContext).value
export const useEditChannelOpen = (channelId: string) => useAbstractDispatch(channelId, true)
export const useEditChannelClose = (channelId: string) => useAbstractDispatch(channelId, false)

export default EditChannelModalContext
