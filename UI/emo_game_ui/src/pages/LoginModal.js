import React, { useEffect } from 'react'
import {useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'
import axios from 'axios';

const LoginModal = ({user, setUser}) => {
  const navigate = useNavigate()

  const username = useRef(null)
  const password = useRef(null)

  const errorMsg = useRef(null)
  const serverErrorMsg = useRef(null)

  useEffect(() => {
    if (user.type !== 'null') {
      setUser({
        username: '',
        password: '',
        type: 'null',
      })
      navigate('/login')
    }
  }, [])

  const checkUserNameAndPassword = async () => {
    const headers = {
      'Content-Type': 'text/plain'
    };

    const obj = {
      "email": username.current.value,
      "password": password.current.value,
    }
    try {
      const resp = await axios.post('http://localhost:8080/check_login', obj, {headers})
      return resp.data.valid;
    } catch (error) {
      serverErrorMsg.current.className = 'errorMsg visible'
    }
  }

  const disableErrorMsg = () => {
    errorMsg.current.style.display = 'none'
  }

  const resetUserValues = () => {
    setUser({
      username: '',
      password: '',
      type: 'null',
    })
  }

  const handleChangeUsername = (event) => {
    setUser({
      ...user,
      username: event.target.value,
    })
    disableErrorMsg()
  }
    
  const handleChangePassword = (event) => {
    setUser({
      ...user,
      password: event.target.value,
    })
    disableErrorMsg()
  }

  const handleStartLogin = async () => {
    const checkUser = await checkUserNameAndPassword()
    if (checkUser) {
      setUser({
        ...user,
        type: 'therapist'
      })
      navigate('/')
    } else {
      errorMsg.current.style.display = 'block'
      resetUserValues()
    }
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleStartLogin();
    }
  }

  const handleStartGuest = () => {
    resetUserValues()
    disableErrorMsg()
    setUser({
      username: 'paziente',
      password: '',
      type: 'patient',
    })
    navigate('/game')
  }

  return (
    <>
        <h2 className='titleHeader'>Benvenuto nell'applicazione</h2>
        <div className='modal' onKeyDown={handleKeyDown}>
            <p ref={serverErrorMsg} className="errorMsg nonVisible">Errore con il server, riprovare più tardi</p>
            <input ref={username} className='textField' onFocus={disableErrorMsg} onChange={handleChangeUsername} placeholder='Nome utente...' maxLength={25}></input>
            <input ref={password} className='textField' onFocus={disableErrorMsg} onChange={handleChangePassword} type='password' placeholder='Password...' maxLength={16}></input>
            <button onClick={handleStartLogin}>Login</button>
            <p ref={errorMsg} style={{color: '#cc0000', display: 'none', fontSize: 'large'}}>Username o password non validi</p>
            <button onClick={handleStartGuest}>Continua senza login</button>
        </div>
    </>
  )
}

export default LoginModal