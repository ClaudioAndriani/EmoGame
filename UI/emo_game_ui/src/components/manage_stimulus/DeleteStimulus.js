import axios from 'axios'
import React, {useState, useRef} from 'react'

const DeleteStimulus = ({setCurrentSection, currentStimuli, setCurrentStimuli}) => {

    const [deleted, setDeleted] = useState(false)
    const serverErrorMsg = useRef(null)

    const headers = {
        'Content-Type': 'text/plain'
    };

    const handleDeleteStimuli = async () => {
        try {
            const resp = await axios.post('http://localhost:8080/delete_stimuli', {stimuli2del: currentStimuli.map((stimulus) => {return {'name': stimulus.name, 'file': stimulus.file}})}, {headers})
            if (resp.data.valid) {
                setCurrentStimuli([])
                setDeleted(true)
            } else {
                serverErrorMsg.current.className = 'errorMsg visible'
            }
        } catch (error) {
            serverErrorMsg.current.className = 'errorMsg visible'
        }
    }

    return (
        <div className='modal'>
            <h2 className='titleHeader'>Sicuro di voler rimuovere questi stimoli?</h2>
            <p ref={serverErrorMsg} className="errorMsg nonVisible">Errore con il server, riprovare più tardi</p>
            <div>
                <ul className='list_modal'>
                    {currentStimuli.map((el) => <li>{el.name}</li>)}
                </ul>
            </div>
            {!deleted ?
                <>
                    <button onClick={() => setCurrentSection('VisualizeStimulus')}>No</button>
                    <button onClick={handleDeleteStimuli}>Si</button>
                </>
                :
                <>
                    <p style={{color: 'green'}}>Cancellazione avvenuta con successo</p>
                    <button onClick={() => setCurrentSection('VisualizeStimulus')}>Indietro</button>
                </>
            }
        </div>
    )
}

export default DeleteStimulus