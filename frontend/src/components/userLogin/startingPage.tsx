import { useNavigate } from 'react-router-dom'
import '../../App.css'

export default function StartingPage() {

  const navigation = useNavigate()
  
  return (
    <div>
      <h1> Welcome to Log Ingestion </h1>
      <div className='signup-or-login'>
        <p> Are you new to Log Ingestion? </p>
        <button onClick={()=> navigation("/signup")}>Sign Up</button>
        <p> Have you logged in before!!! </p>
        <button onClick={()=> navigation("/login")}>Log In</button>
      </div>
    </div>
  )
}