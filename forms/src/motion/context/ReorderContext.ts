
import { createContext } from "../../preact/compat"
import { ReorderContextProps } from "../components/Reorder/types"

export const ReorderContext = createContext/* <ReorderContextProps<any> | null> */(
    null
)
