import { useState } from "react";
import contextMenu from "./ContextSnip";


const ContextState=(props)=>{
    const parameters={"login":false,notes:[]}
    const [state, setstate] = useState(parameters)
    const update=(val)=>{
        
        let newState={...state,...val}
        setstate(newState)
    }
    return(
        <contextMenu.Provider value={{state,update}} >
        {props.children}
        </contextMenu.Provider>
    )
}
export default ContextState;