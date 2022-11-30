import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";

// CONTEXT

interface QueryErrorResetBoundaryValue {
  clearReset: () => void
  isReset: () => boolean
  reset: () => void
}

function createValue(): QueryErrorResetBoundaryValue {
  let isReset = false
  return {
    clearReset: () => {
      isReset = false
    },
    reset: () => {
      isReset = true
    },
    isReset: () => {
      return isReset
    },
  }
}

const QueryErrorResetBoundaryContext = React.createContext(createValue())

// HOOK

export const useQueryErrorResetBoundary = () =>
  React.useContext(QueryErrorResetBoundaryContext)

// COMPONENT

export interface QueryErrorResetBoundaryProps {
  children:
    | ((value: QueryErrorResetBoundaryValue) => any)
    | any
}

export const QueryErrorResetBoundary: any = ({
  children,
}) => {
  const value = React.useMemo(() => createValue(), [])
  return (
    <QueryErrorResetBoundaryContext.Provider value={value}>
      {typeof children === 'function'
        ? (children as Function)(value)
        : children}
    </QueryErrorResetBoundaryContext.Provider>
  )
}
