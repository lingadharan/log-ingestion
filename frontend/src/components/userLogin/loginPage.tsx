import { useState } from "react"
import { credentials } from "../../interface/interface"

export default function LoginPage() {

  const credential = {
    userName: "",
    password: ""
  }
  const [credentials, setCredentials] = useState<credentials>(credential)

  function handleCredentials(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }

  function onSubmit() {
    console.log(credentials)
  }

  return(
    <div className="signup-or-login">
      <label> User Name </label>
      <input type="text" name="userName" onChange={(e)=>handleCredentials(e)}></input>
      <label> Password </label>
      <input type="password" name="password" onChange={(e)=>handleCredentials(e)}/>
      <button onClick={onSubmit}>Submit</button>
    </div>
  )
}