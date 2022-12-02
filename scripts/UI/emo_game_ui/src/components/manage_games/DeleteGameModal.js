import React, {useState, useRef} from 'react'
import axios from 'axios'

const DeleteGameModal = ({ setCurrentGame, currentGame, setCurrentSection, setCurrentAction, }) => {

    const [deleted, setDeleted] = useState(false)
    const serverErrorMsg = useRef(null)
    
    const headers = {
        'Content-Type': 'text/plain'
    };

    const handleDeleteGame = async () => {
        try {
            const resp = await axios.post("http://localhost:8080/delete_game", {gameName: currentGame}, {headers})
            if (resp.data.valid) {
                setDeleted(true)
                setCurrentGame('')
            } else {
                serverErrorMsg.current.className = 'errorMsg visible'
            }
          } catch (error) {
            serverErrorMsg.current.className = 'errorMsg visible'
          }
    }

    return (
        <div className='modal'>
            <h2 className='titleHeader'>Sicuro di voler rimuovere questo gioco?</h2>
            <p ref={serverErrorMsg} className="errorMsg nonVisible">Errore con il server, riprovare più tardi</p>
            {!deleted ?
                <>
                    <button onClick={() => setCurrentSection('VisualizeGames')}>No</button>
                    <button onClick={handleDeleteGame}>Si</button>
                </>
                :
                <>
                    <p style={{color: 'green'}}>Cancellazione avvenuta con successo</p>
                    <button onClick={() => setCurrentSection('VisualizeGames')}>Indietro</button>
                </>
            }
        </div>
    )
}

export default DeleteGameModal