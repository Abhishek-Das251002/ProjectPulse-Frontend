import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';   
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { currUser } from "./userContext";
import AuthenticateUser from "./authLogic";

const App = () => {
  const [logInfo, setLogInfo] = useState({
    email: "",
    password: "",
  })
  const [currToken,setCurrToken] = useState(localStorage.getItem("token"))
  const [loginMsg, setLoginMsg] = useState(<p className="text-secondary fs-5">Please enter your details.</p>)
  // const {currUserInfo, setCurrUserInfo} = useContext(currUser)
  const navigate = useNavigate()
  const location = useLocation()

  AuthenticateUser({currToken}, "/dashboard")
  


//   useEffect(() => {
//   async function checkLoginData(){
//     if(currToken){
//       try{
//         const response = await axios.get("http://localhost:3000/verifyUser",{
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${currToken}`
//           }
//         })

//         if(response){
//           console.log(response)
//           setCurrUserInfo({email: response.data.email, name: response.data.name})
//           navigate("/dashboard")  
//         }

//       }catch(error){
//         console.log(error)
//       }
//     }
//   }

//   checkLoginData()

// }, [currToken])


    useEffect(() => {
      if(location.state?.message){
        setLoginMsg(<p className="text-danger fs-5">{location.state.message}</p>)
      }
    },[location])

  function handleSubmit(e){
    e.preventDefault()
    axios.post("http://localhost:3000/admin/login",logInfo)
    .then(res => {
      localStorage.setItem("token", res.data.token)
      setCurrToken(localStorage.getItem("token"))
    })
    .catch(error => {
      if(error.response.status === 404){
        setLoginMsg(<p className="text-danger">User does'nt exist, Register before Login</p>) 
      }else if(error.response.status === 401){
        setLoginMsg(<p className="text-danger">Wrong Password, Please Enter correct Password.</p>) 
      }
    })
    
  }

  return (
    <div className="loginScreen" style={{background: "#F4F6F9"}}>
      <div className="logInBox">
        <div className="text-center">
          <h3 style={{color: '#2F3E8F', fontWeight: "bold"}}>ProjectPulse</h3>
          <h1>Log in to your account</h1>
          {loginMsg}
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="fs-5">
              <label>Email: </label><br />
              <input className="form-control" value={logInfo.email} type="text" onChange={(e) => setLogInfo({...logInfo, email: e.target.value})} required/>
              <label >Password: </label><br />
              <input className="form-control" value={logInfo.password} type="password" onChange={(e) => setLogInfo({...logInfo, password: e.target.value})} required/>
              <button type="submit">Sign In</button>
              <p style={{color: "#2F3E8F", textDecoration: "underline", textAlign: "center", cursor: "pointer"}} onClick={() => navigate("/signup")}>Click here to Register</p>
            </div>
        </form>
      </div>
    </div>
  )
}

export default App;