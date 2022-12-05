import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import StimulusGroup from '../manage_stimulus/StimulusGroup'
import { useNavigate } from 'react-router-dom'

const SelectGameVisualizationMenu = ({
    setCurrentSection,
    setCurrentGame,
    player,
    setPlayer,
    setCurrentStimuli,
    matchData,
    setMatchData,
}) => {
    const navigate = useNavigate()

    const [gamesList, setGamesList] = useState([])
    const [selectedGroup, setSelectedGroup] = useState('')
    const noGameSelectedMsg = useRef(null)
    const playerName = useRef(null)
    const playerNameBlankMsg = useRef(null)
    const showLabelCB = useRef(null)
    
    
    useEffect(() => {
      noGameSelectedMsg.current.className = 'errorMsg nonVisible'
      setCurrentGame(selectedGroup)
    }, [selectedGroup])

    const headers = {
        'Content-Type': 'text/plain'
    };

    
    /*
    'assets/imageLogo.png'
    'assets/videoLogo.png'
    'assets/textLogo.png'
    'assets/audioLogo.png'
    */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/get_all_games", {}, {headers})
                setGamesList(resp.data.gamesList)
            } catch (error) {
                console.error(error)
            }
        } 
        fetchData()
    }, [])

    const handleUpdateName = () => {
        playerNameBlankMsg.current.className = 'errorMsg nonVisible'
        const tempName = playerName.current.value
        if (tempName === '') {
            setPlayer('')
            playerNameBlankMsg.current.className = 'errorMsg visible'
        } else {
            setPlayer(tempName)
        }
    }

    const handleClickPlaySelectedGame = () => {
        let ok = true
        if (player === '') {
            ok = false
            playerNameBlankMsg.current.className = 'errorMsg visible'
        }

        if (selectedGroup === '') {
            ok = false
            noGameSelectedMsg.current.className = 'errorMsg visible'
        } 
        
        if (ok) {
            setCurrentStimuli(gamesList.filter(game => game.gameName === selectedGroup)[0].stimuli)
            setCurrentSection('PlayGameStimulus');
        }
    }

    const toggleCheck = (option) => {
        if (option === 'showLabel') {
            setMatchData({...matchData, showLabel: !matchData[option]})
        } else if (option === 'allowWebcam') {
            setMatchData({...matchData, allowWebcam: !matchData[option]})
        }
    }

    return (
        <>
            <h2 className='titleHeader'>Giochi presenti nel database</h2>
            <div className='modal'>
                <input ref={playerName} onBlur={handleUpdateName} placeholder='Nome giocatore...' maxLength={20} />
                <p ref={playerNameBlankMsg} className='errorMsg nonVisible'>Il nome non può essere vuoto</p>
                <div className='stimulusList'>
                {
                    gamesList.length === 0 ?
                    <p>Nessun gioco presente nel database,<br /> crearne uno nella sezione 'Aggiungi gioco'</p>
                    :
                    gamesList.map((obj) => {
                        const {gameName, stimuli} = obj
                        return (
                            <StimulusGroup 
                                key={gameName} 
                                groupName={gameName}
                                list={stimuli}
                                setSelectedGroup={setSelectedGroup}
                                selectedGroup={selectedGroup}
                                currentStimuli={[]}
                                setCurrentStimuli={(val) => {}}
                                currentAction={'modifyGame'}
                            />)
                    })
                }

                </div>
                <div className='checkboxDiv'>
                    <input type="checkbox" checked={matchData.showLabel} onChange={() => toggleCheck('showLabel')} />
                    <label onClick={() => toggleCheck('showLabel')} className='titleHeader'>Mostra nomi gioco e stimolo</label>
                </div>
                <div className='checkboxDiv'>
                    <input type="checkbox" checked={matchData.allowWebcam} onChange={() => toggleCheck('allowWebcam')} />
                    <label onClick={() => toggleCheck('allowWebcam')} className='titleHeader'>Abilita cattura volto</label>
                </div>
                <div className='buttonGroup'>
                    <button onClick={() => navigate('/')}>Indietro</button>
                    <button onClick={handleClickPlaySelectedGame}>Inizio gioco</button>
                </div>
                <p ref={noGameSelectedMsg} className='errorMsg nonVisible' style={{margin: 'auto', marginTop: '0.4em'}}>Nessun gioco selezionato, se non sono presenti giochi, crearne uno nella sezione "Aggiungi gioco"</p>
            </div>
        </>
    )
}

export default SelectGameVisualizationMenu