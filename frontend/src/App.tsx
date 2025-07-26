import './App.css';
import Home from './components/home';
import LoginPage from './components/userLogin/loginPage';
import SignUpPage from './components/userLogin/signupPage';
import StartingPage from './components/userLogin/startingPage';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'


function App() {
  const clientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID!
  const navigation = useNavigate()
  const handleOnSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Credentials: ", credentialResponse);
    navigation('/')
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>

      <GoogleLogin
      onSuccess={(credentialResponse: CredentialResponse) => handleOnSuccess(credentialResponse)} 
      onError={()=>console.log("Error occure while sign in into account!!!")}
      />
      <Routes>
        <Route path='/' element={<StartingPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/logs' element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App;