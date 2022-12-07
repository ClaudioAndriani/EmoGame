import React from 'react'
import { useNavigate } from 'react-router-dom';

const EndGameScreen = ({ setCurrentSection }) => {
    const navigate = useNavigate()

    return (
        <div className='modal'>
            <h1 className='titleHeader'>Partita terminata</h1>
            <h2 className='titleHeader'>Il giocatore può lasciare la postazione al terapista</h2>
            <button className="saveMatchBtn" onClick={() => setCurrentSection('SaveMatch')}>Prosegui alla schermata del terapista</button>
            <button className="saveMatchBtn" onClick={() => navigate('/')}>Annulla gioco</button>
        </div>
    )
}

export default EndGameScreen