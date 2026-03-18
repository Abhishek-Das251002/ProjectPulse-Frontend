import { createContext, useState } from "react";

export const currUser = createContext({})

export function CurrUserProvider({children}){
    const [currUserInfo, setCurrUserInfo] = useState("")
    return (
        <currUser.Provider value={{currUserInfo, setCurrUserInfo}}>
            {children}
        </currUser.Provider>
    )
}