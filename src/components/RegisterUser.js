import React,{useContext, useState} from 'react'
import './registercss.css'
import contextMenu from '../context/ContextSnip'
import { useNavigate } from 'react-router-dom'
export default function RegisterUser() {
  const [User, setUser] = useState({name:"",email:"",password:""})
  const globalState=useContext(contextMenu)
  const navigate=useNavigate()
  const [msg, setmsg] = useState("")
  const HandleChange=(e)=>{
    let value;
    if(e.target.type==="email"){
      value={email:e.target.value}
    }
    else if(e.target.type==="text"){
      value={name:e.target.value}
    }
    else{
      value={password:e.target.value}
    }
    setUser({...User,...value})
  }
  const RegisterUser= async()=>{
    const url="http://localhost:5000/api/auth/createUser"
    const options={
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(User)
    }
    const result=await fetch(url,options)
    const jsonResult=await result.json()
 
    if(jsonResult.Success===1){
      globalState.update({login:true})
      localStorage.setItem('token',jsonResult.token)
      localStorage.setItem('user',User.name)

      navigate('/')
    }
    else {
      if(jsonResult.Success===-1){
        //email is already present
        setmsg("Provided Email has already used for an account. Use Different or login with email")
      }
      else{
        let Message=""
        for(let key in jsonResult.error){
          let element=jsonResult.error[key]
          if(element.path==="name"){
            Message+="Provide name with at least 3 characters!"
          }
          if(element.path==="email"){
            Message+=" Please provide a valid email Id!"
          }
          if(element.path==="password"){
            Message+=" Provide password with at least 5 characters!"
          }
        }
        setmsg(Message)
    }
    setTimeout(()=>{setmsg("")},2000)
  }
}
  return (
    <div className='RegisterArea'> 
        <div className="reg">
          <img id='SpecialUser' src={require("../Images/Logined.png")} alt="Register" />

            <div className="informationField">
                <i class="fa-solid fa-user"></i>
                <input type="text" placeholder='Enter Name' value={User.name} onChange={HandleChange}/>
            </div>
            <div className="informationField">
              <i class="fa-solid fa-envelope"></i>
                <input type="email" placeholder='Enter Email ID' value={User.email} onChange={HandleChange}/>
            </div>
            <div className="informationField">
              <i class="fa-solid fa-lock"></i>
                <input type="password" placeholder='Enter Password' value={User.password} onChange={HandleChange} />
            </div>
            <div className="submit-panel" style={{justifyContent:"flex-end"}}>
                
                <button onClick={RegisterUser}>Register</button>
            </div>
            
        </div>
        <div className="alertMsg">{msg}</div>
    </div>
  )
}
