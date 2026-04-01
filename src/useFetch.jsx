import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

        const fetchData = async () => {
            const token = localStorage.getItem("token")

            const headers = {
                "Content-Type": "application/json"
            }

            if(token){
                headers.Authorization  = `Bearer ${token}`
            }

            const response = await axios.get(url, {
               headers: headers,
            })

            setData(response.data)
            setLoading(false)
        }

        useEffect(() => {
            fetchData().catch(err => {
                if(err.response?.status === 401){
                    localStorage.removeItem("token")
                    navigate("/", {state: {message: "Your session has expired, please login again."}})
                }else{
                    setError(err.response?.data.message)
                }
            })
        },[url])

    return { data, error, refetch: fetchData,loading}
}