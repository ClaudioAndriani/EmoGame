import React, { useEffect, useState, useRef } from 'react'
import StimulusGroup from './StimulusGroup'
import axios from 'axios'

/*
name: str
thumbnail: logo
file: mp4/mp3/txt/png
*/
const VisualizeStimulus = ({ currentAction, setCurrentSection, currentStimuli, setCurrentStimuli }) => {
    const [stimulusList, setStimulusList] = useState([])
    const serverErrorMsg = useRef(null)

    const headers = {
        'Content-Type': 'text/plain'
    };

    const inManageGames = window.location.pathname === '/manage-games'
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/get_all_stimulus", {}, {headers})
                setStimulusList(resp.data.stimulusList)
            } catch (error) {
                serverErrorMsg.current.className = 'errorMsg visible'
            }
        } 
        fetchData()
    }, [])

    const noSelectedMsg = useRef(null)

    const handlePlaySelected = () => {
        if (currentStimuli.length > 0) {
            setCurrentSection('PlayStimulus')
        } else {
            noSelectedMsg.current.className = 'visible errorMsg'
        }
    }

    const handleDeleteSelected = () => {
        if (currentStimuli.length > 0) {
            setCurrentSection('DeleteStimulus')
        } else {
            noSelectedMsg.current.className = 'visible errorMsg'
        }
    }

    return (
        <>
            <h2 className='titleHeader'>Stimoli presenti nel database</h2>
            <div className='modal'>
                <p ref={serverErrorMsg} className="errorMsg nonVisible">Errore con il server, riprovare più tardi</p>
                <div className='stimulusList' onMouseEnter={() => {noSelectedMsg.current.className = 'nonVisible errorMsg'}}>
                {
                    stimulusList.map((obj) => {
                        const {category, stimuli} = obj
                        return (<StimulusGroup key={category} groupName={category} list={stimuli} currentAction={currentAction} currentStimuli={currentStimuli} setCurrentStimuli={setCurrentStimuli} />)
                    })
                }

                </div>
                <div className='buttonGroup'>
                    <button onClick={() => {(inManageGames ? setCurrentSection('EditGame') : setCurrentSection('StimulusMenu')); setCurrentStimuli([])}}>Indietro</button>
                    {
                        !inManageGames ?
                            (currentAction === 'visualizeStimulus' ?
                                <button onClick={handlePlaySelected}>Riproduci stimolo selezionato</button>
                            :
                                <button onClick={handleDeleteSelected}>Rimuovi selezionati</button>)
                        :
                            <button onClick={() => setCurrentSection('EditGame')}>Conferma stimoli selezionati</button>
                    }
                </div>
                <p ref={noSelectedMsg} className='errorMsg nonVisible'>Selezionare degli stimoli da {currentAction === 'visualizeStimulus' ? 'riprodurre' : 'rimuovere'}</p>
                
            </div>
        </>
    )
}

export default VisualizeStimulus