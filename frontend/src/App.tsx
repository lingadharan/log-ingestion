import './App.css';
import Home from './components/home';
import LoginPage from './components/userLogin/loginPage';
import SignUpPage from './components/userLogin/signupPage';
import StartingPage from './components/userLogin/startingPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
  return (

    <Routes>

      <Route path='/' element={<StartingPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/logs' element={<Home />} />

    </Routes>
  )
}

export default App;