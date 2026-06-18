import { createContext } from "react-router";

type User = {
    id : any,
    [key:string]:any,
}

export const userAuthContext = createContext<User|null>()