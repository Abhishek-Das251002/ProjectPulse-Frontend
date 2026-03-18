import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import checkEmail from "./validateEmail"

export const SignUp = () => {

    const [userInfo, setUserInfo] = useState({
        name: "", 
        email: "", 
        password: ""
    })
    const [signupMsg, setSignupMsg] = useState(<p className="text-secondary fs-5">Please enter your details.</p>)
    const navigate = useNavigate()


    function checkPass(key) {
        if (key.length < 8) return false;
        if (key === key.toLowerCase()) return false;
        if (!/[0-9]/.test(key)) return false;
        if (!/[^a-zA-Z0-9\s]/.test(key)) return false

        return true;
    }

    function addUser(e){
        e.preventDefault()

        const isValidEmail = checkEmail(userInfo.email)
        const isValidPass = checkPass(userInfo.password)

        if(!isValidEmail && !isValidPass){
            setSignupMsg(<p className="text-danger fs-5">Please enter valid email address and password.</p>)
        }
        else if(!isValidEmail){
            setSignupMsg(<p className="text-danger fs-5">Please enter valid email address.</p>)
        }
        else{
            console.log()
            setSignupMsg(<p className="text-danger fs-5">Password should have atleast 8 characters and must contain a capital letter, number and a special character.</p>)
        }

        if(isValidEmail && isValidPass){
            axios.post("http://localhost:3000/allUsers", userInfo)
            .then(res => {
                console.log('user added', res.data)
                e.target.reset()
                navigate("/")
            })
            .catch(err => console.log('Error:', err.response?.data || err.message))
        }
    }
    return (
        <div className="loginScreen" style={{background: "#F4F6F9"}}>
            <div className="logInBox">
                <div className="text-center">
                    <h3 style={{color: '#2F3E8F', fontWeight: "bold"}}>ProjectPulse</h3>
                    <h1>Sign up on ProjectPulse</h1>
                    {signupMsg}
                </div>
                <form onSubmit={(e) => addUser(e)}>
                    <div className="fs-5">
                        <label>Name: </label><br />
                        <input className="form-control" value={userInfo.name} type="text" onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} required/>
                        <label>Email: </label><br />
                        <input className="form-control" value={userInfo.email} type="text" onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} required/>
                        <label>Password: </label><br />
                        <input className="form-control" value={userInfo.password} type="password" onChange={(e) => setUserInfo({...userInfo, password: e.target.value})} required/>
                        <button>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp