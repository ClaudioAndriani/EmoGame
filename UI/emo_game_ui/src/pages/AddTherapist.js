import React, {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTherapist = () => {
  const [isValid, setIsValid] = useState(true)
  const navigate = useNavigate()

  const therapistName = useRef()
  const therapistPassword = useRef()
  const therapistCheck = useRef()

  const nameError = useRef()
  const emailError = useRef()
  const passwordError = useRef()
  const checkError = useRef()

  const successMsg = useRef()
  const serverErrorMsg = useRef()

  const headers = {
    'Content-Type': 'text/plain'
  };

  const checkUserName = async () => {
    const name = therapistName.current.value;
    

    const obj = {
      "email": name,
    }
    try {
      const resp = await axios.post('http://localhost:8080/check_register_therapist', obj, {headers})
      if (resp.data.valid) {
        setIsValid(true); 
        nameError.current.className = 'errorMsg nonVisible';
      } else {
        setIsValid(false);
        nameError.current.className = 'errorMsg visible';
      }
    } catch (error) {
      serverErrorMsg.current.className = 'visible errorMsg'
    }
  }

  const handleAddTherapist = async () => {
    checkError.current.className = 'errorMsg nonVisible';
    passwordError.current.className = 'errorMsg nonVisible';
    nameError.current.className = 'errorMsg nonVisible';
    emailError.current.className = 'errorMsg nonVisible';

    const name = therapistName.current.value;
    const password = therapistPassword.current.value;
    const check = therapistCheck.current.value;

    const VALIDATE_EMAIL = /^([a-z0-9_.-]+)@([\da-z.-]+).([a-z.]{2,26})$/
    const VALIDATE_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,17}$/

    // controllo corrispondenza password
    let isOkay = true;
    if (password !== check) {
      checkError.current.className = 'errorMsg visible';
      isOkay = false;
    }
    if (!password.match(VALIDATE_PASSWORD)) {
      passwordError.current.className = 'errorMsg visible';
      isOkay = false;
    }
    if (!isValid) {
      nameError.current.className = 'errorMsg visible';
      isOkay = false;
    }
    if (!name.match(VALIDATE_EMAIL)) {
      emailError.current.className = 'errorMsg visible';
      isOkay = false;
    }

    if (isOkay) {
      const obj = {
        "email": name,
        'password': password,
      }
      try {
        const resp = await axios.post('http://localhost:8080/register_therapist', obj, {headers})
        if (resp.data.valid) {
          successMsg.current.className = 'visible'
        } else {
          serverErrorMsg.current.className = 'visible errorMsg'
        }
      } catch (error) {
        serverErrorMsg.current.className = 'visible errorMsg'
      }
    }
  }

  return (
    <>
      <h2 className='titleHeader'>Inserisci i dati del terapista da aggiungere</h2>
      <div className='modal'>
        <p ref={successMsg} className="nonVisible" style={{color: 'green'}}>Acount terapista creato con successo</p>
        <p ref={serverErrorMsg} className="errorMsg nonVisible" style={{color: 'green'}}>Errore del server, riprovare più tardi</p>
        <input onFocus={() => {setIsValid(true); nameError.current.className = 'errorMsg nonVisible';}} onBlur={checkUserName} ref={therapistName} type="email" className='textField' placeholder='Nome utente (email)...' required maxLength={25}></input>
        <p ref={emailError} className='errorMsg nonVisible'>Formato email non valido</p>
        <p ref={nameError} className='errorMsg nonVisible'>Questo nome utente è già in uso</p>
        <input ref={therapistPassword} type="password" className='textField' placeholder='Password...' required maxLength={16}></input>
        <p ref={passwordError} className='errorMsg nonVisible'>La password deve essere lunga dagli 8 ai 16 caratteri, e deve contenere maiuscole, minuscole e almeno un numero</p>
        <input ref={therapistCheck} type="password" className='textField' placeholder='Reinserisci password...' required></input>
        <p ref={checkError} className='errorMsg nonVisible'>Le password devono corrispondere</p>
        <button onClick={handleAddTherapist}>Registra terapista</button>
        <button onClick={() => navigate('/')}>Indietro</button>
      </div>
    </>
  )
}

export default AddTherapist
