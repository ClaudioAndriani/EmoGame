import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = ({user, setUser}) => {
  const navigate = useNavigate()

  if(user.type === 'null') {
    navigate('/login')
    
  }
  return (
    <>
      <h2 className='titleHeader'>Seleziona un'operazione da effettuare</h2>
      <div className='modal'>
        <button onClick={() => navigate('/manage_stimulus')}>Gestione stimoli</button>
        <button onClick={() => navigate('/manage-games')}>Gestione giochi</button>
        <button onClick={() => navigate('/game')}>Gioca</button>
        <button onClick={() => navigate('/analyze-game')}>Analizza risultati giochi</button>
        <button onClick={() => navigate('/create-therapist')}>Crea account terapista</button>
      </div>
    </>
  )
}

export default Home