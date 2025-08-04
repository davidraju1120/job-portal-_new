import {useState} from "react";

// const { useState } = require("react");

const useFetch = (cb, options = {}) => {
    const[data, setData] = useState(undefined);
    const[loading, setLoading] = useState(null);
    const[error, setError] = useState(null);


    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cb(options, ...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

return {fn,data, loading, error};
};
export default useFetch;