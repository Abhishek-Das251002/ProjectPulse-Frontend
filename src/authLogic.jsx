import { useContext, useEffect} from "react";
import { currUser } from "./userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const AuthenticateUser = ({currToken},page) => {
    const {currUserInfo, setCurrUserInfo} = useContext(currUser)
    const navigate = useNavigate()

    return (
        useEffect(() => {
        async function checkLoginData(){
            if(currToken){
            try{
                const response = await axios.get("https://project-pulse-backend-nine.vercel.app/verifyUser",{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currToken}`
                }
                })

                if(response){
                setCurrUserInfo({email: response.data.email, name: response.data.name})
                navigate(page)  
                }

            }catch(error){
                console.log(error)
            }
            }
        }

        checkLoginData()

        }, [currToken])
    )
}

export default AuthenticateUser;