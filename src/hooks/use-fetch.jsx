
import { useSession } from "@clerk/clerk-react";
import {useState} from "react";

// const { useSession } = require("@clerk/clerk-react");
// const { useState } = require("react");

const useFetch = (cb, options = {}) => {
    const[data, setData] = useState(undefined);
    const[loading, setLoading] = useState(null);
    const[error, setError] = useState(null);

    const {session} = useSession();
    const fn = async(...args)=>{
        setLoading(true);
        setError(null);
    
    try{
        const supabaseAccessToken = await session.getToken({
            template:"supabase",
        });
        const respone = await cb(supabaseAccessToken, options, ...args);
          setData(respone);
          setError(null);
      }
      catch(error){
        setError(error)
       } finally{

        setLoading(false)
        }
      };
return {fn,data, loading, error};
};
export default useFetch;