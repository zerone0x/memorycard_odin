import { useState, useEffect } from "react";

export default function useLocalStorageState(key: string, defaultValue:any) {
    const [value, setValue] = useState(function(){
        const storedValue = localStorage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : defaultValue
    })

    useEffect(
        function(){
            localStorage.setItem(key, JSON.stringify(value))
        },[value, key]
    )
    return [value, setValue]
}