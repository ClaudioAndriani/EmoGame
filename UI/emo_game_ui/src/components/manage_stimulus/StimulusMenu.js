import React from 'react'
import { useNavigate } from 'react-router-dom'

const StimulusMenu = ({setCurrentAction, setCurrentSection}) => {
  const navigate = useNavigate()
  
  return (
      <>
        <h2 className='titleHeader'>Seleziona un'operazione da effettuare</h2>
        <div className='modal'>
          <button onClick={() => setCurrentSection('AddNewStimulus')}>Aggiungi stimoli</button>
          <button onClick={() => {
              setCurrentAction('visualizeStimulus');
              setCurrentSection('VisualizeStimulus');
            }}>Visualizza stimoli</button>
          <button onClick={() => {
              setCurrentAction('deleteStimulus');
              setCurrentSection('VisualizeStimulus');
            }}>Cancella stimoli</button>
          <button onClick={() => navigate('/')}>Indietro</button>
        </div>
      </>
    )
}

export default StimulusMenu