import React from 'react'
import { useNavigate } from 'react-router-dom'

const GamesMenu = ({setCurrentAction, setCurrentSection}) => {
  const navigate = useNavigate()
  
  return (
      <>
        <h2 className='titleHeader'>Seleziona un'operazione da effettuare</h2>
        <div className='modal'>
          <button onClick={() => {
            setCurrentAction('createGame');
            setCurrentSection('EditGame');
            }}>Aggiungi gioco</button>
          <button onClick={() => {
              setCurrentAction('modifyGame');
              setCurrentSection('VisualizeGames');
            }}>Modifica gioco</button>
          <button onClick={() => {
              setCurrentAction('deleteGame');
              setCurrentSection('VisualizeGames');
            }}>Cancella gioco</button>
          <button onClick={() => navigate('/')}>Indietro</button>
        </div>
      </>
    )
}

export default GamesMenu