import React, { useEffect, useRef, useState } from 'react'
import GStimulusRow from './GStimulusRow';
import axios from 'axios'

const EditGame = ({ currentSection, setCurrentSection, currentAction, currentGame, setCurrentGame, currentStimuli, setCurrentStimuli, setCurrentAction, setStimuliRows, stimuliRows }) => {

    const createAction = currentAction === 'createGame';
    const addMiddleAction = currentAction === 'addMiddleGame';
    const modifyAddGame = currentAction === 'modifyAddGame';
    const modifyAddedTailGame = currentAction === 'modifyAddedTailGame';
    const modifyMiddleGame = currentAction === 'modifyMiddleGame';

    const [creationCompleted, setCreationCompleted] = useState(false);
    const gameNameRef = useRef(null)
    const errorMsg = useRef(null)

    const emptyGameMsg = useRef(null)
    const emptyGameNameMsg = useRef(null)
    const serverErrorMsg = useRef(null)

    const headers = {
        'Content-Type': 'text/plain'
    };

    const clearErrorMsg = () => {
        if (errorMsg.current) {
            errorMsg.current.className = 'errorMsg nonVisible';
        }
        emptyGameMsg.current.className = 'errorMsg nonVisible';
        emptyGameNameMsg.current.className = 'errorMsg nonVisible';
        serverErrorMsg.current.className = 'errorMsg nonVisible';
    }

    const deleteStimulus = (index) => {
        setStimuliRows(stimuliRows.filter((val, i) => i !== index))
    }

    const moveStim = (arr, index, op) => {
        let tempArr = [...arr]
        const tempStim = tempArr[index]
        tempArr[index] = tempArr[op(index)]
        tempArr[op(index)] = tempStim
        return tempArr
    }

    const moveUp = (index) => {
        setStimuliRows(moveStim(stimuliRows, index, (index) => index - 1))
    }

    const moveDown = (index) => {
        setStimuliRows(moveStim(stimuliRows, index, (index) => index + 1))
    }

    useEffect(() => {
        if (creationCompleted === false) {
            gameNameRef.current.value = currentGame

            if (addMiddleAction || modifyMiddleGame) {
                const index = currentStimuli.slice(0, 1)[0] + 1
                setCurrentStimuli(currentStimuli.slice(1))
                const firstPartArr = stimuliRows.slice(0, index)
                const secondPartArr = stimuliRows.slice(index)
                setStimuliRows([...firstPartArr, ...currentStimuli.slice(1), ...secondPartArr])
                setCurrentStimuli([])
                if (addMiddleAction) setCurrentAction('createGame')
                else if (modifyMiddleGame) setCurrentAction('modifyGame')
            } else if (createAction) {
                setStimuliRows([])
                setStimuliRows([...stimuliRows, ...currentStimuli])
                setCurrentStimuli([])
            } else if (modifyAddGame) {
                const fetchRows = async () => {
                    try {
                        const resp = await axios.post("http://localhost:8080/get_game_stimulus_rows", {currentGame}, {headers})
                        if (resp.data.valid) {
                            setStimuliRows(resp.data.stimuliList)
                        } else {
                            serverErrorMsg.current.className = 'errorMsg visible'
                            console.error('error on receiving stimuli: ', resp.data.message)
                        }
                    } catch(error) {
                        serverErrorMsg.current.className = 'errorMsg visible'
                    }
                }
                fetchRows()
            } else if (modifyAddedTailGame) {
                setStimuliRows([...stimuliRows, ...currentStimuli])
                setCurrentStimuli([])
            }
        }
    }, [])

    const handleAddStimulusBottom = () => {
        if (modifyAddGame) setCurrentAction('modifyAddedTailGame')
        setCurrentSection('VisualizeStimulus')
    }

    const changeName = () => {
        errorMsg.current.className = 'nonVisible'
        setCurrentGame(gameNameRef.current.value)
    }

    const handleUpdateGame = async () => {
        clearErrorMsg()
        const gameName = gameNameRef.current.value
        let valid = true;
        if (createAction) {
            try {
                const resp = await axios.post("http://localhost:8080/is_gameName_already_present", {gameName}, {headers})
                valid = resp.data.valid
                if (!valid) {
                    errorMsg.current.className = 'visible'
                }
            } catch (error) {
                serverErrorMsg.current.className = 'errorMsg visible'
            }
        }

        if (stimuliRows.length === 0) {
            valid = false;
            emptyGameMsg.current.className = 'visible errorMsg'
        }

        if (gameName === '') {
            valid = false;
            emptyGameNameMsg.current.className = 'visible errorMsg'
        }

        if (valid) {
            try {
                const rowsTemp = stimuliRows.map((row, i) => { return {...row, index: i}})
                const obj = {gameName, rows: rowsTemp}

                const resp = await axios.post("http://localhost:8080/add_update_game", obj, {headers})
                valid = resp.data.valid
                if (!valid) {
                    serverErrorMsg.current.className = 'errorMsg visible'
                } else {
                    setStimuliRows([])
                    setCreationCompleted(true)
                    setCurrentGame('')
                }
            } catch (error) {
                serverErrorMsg.current.className = 'errorMsg visible'
            }
        }
    }

    return (
        <>
            <h2 className='titleHeader'>{createAction ? "Crea un nuovo gioco" : "Modifica un gioco esistente"}</h2>
            <div className='modal gameEditor' onMouseEnter={clearErrorMsg}>
                { !creationCompleted ? 
                    <>
                        <input ref={gameNameRef} onChange={changeName} placeholder="Nome gioco..." maxLength={50}/>
                        <p ref={errorMsg} style={{color: '#cc0000', fontSize: 'large'}} className="nonVisible">Nome gioco già in uso</p>
                        <div className='GStimuluRow'>
                            { stimuliRows.map((row, index) => 
                                <GStimulusRow 
                                    key={index} 
                                    stimulus={row} 
                                    position={
                                        index === 0 ? 
                                            'first' 
                                        : (index === stimuliRows.length - 1) ? 
                                            'last'
                                            : 'middle'}
                                    index={index}
                                    deleteStimulus={deleteStimulus}
                                    moveUp={moveUp}
                                    moveDown={moveDown}
                                    setCurrentStimuli={setCurrentStimuli}
                                    setCurrentSection={setCurrentSection}
                                    setCurrentAction={setCurrentAction}
                                    currentAction={currentAction}
                                /> 
                            )}
                        </div>
                    </>
                    :
                    <p style={{color: 'green'}}>Aggiunta completata con successo</p>
                }
                <div style={{marginTop: 0, display: 'flex', justifyContent: 'space-between'}}>
                    { !creationCompleted ?
                        <>
                            <button onClick={
                                () => { 
                                    if (createAction) {
                                        setCurrentSection('GamesMenu')
                                        setCurrentGame('')
                                    }
                                    else {
                                        setCurrentSection('VisualizeGames');
                                        setCurrentAction('modifyGame')
                                    }
                                    setStimuliRows([])
                                }}>Annulla</button>
                            <button onClick={handleAddStimulusBottom}>Aggiungi stimolo in coda</button>
                            <button onClick={handleUpdateGame}>Conferma {createAction ? 'creazione' : 'modifiche'}</button>
                        </>
                        :
                        <button onClick={() => { 
                                if (createAction) {
                                    setCurrentSection('GamesMenu')
                                }
                                else {
                                    setCurrentSection('VisualizeGames');
                                    setCurrentAction('modifyGame')
                                }
                            }
                        } style={{margin: 'auto', marginTop: '0.5em'}}>Indietro</button>
                    }
                </div>
                <p ref={emptyGameMsg} className='errorMsg nonVisible'>Il gioco deve contenere almeno uno stimolo</p>
                <p ref={emptyGameNameMsg} className='errorMsg nonVisible'>Il nome del gioco deve contenere almeno un carattere</p>
                <p ref={serverErrorMsg} className='errorMsg nonVisible'>Errore con il server, riprovare più tardi</p>
            </div>
        </>
    )
}

export default EditGame