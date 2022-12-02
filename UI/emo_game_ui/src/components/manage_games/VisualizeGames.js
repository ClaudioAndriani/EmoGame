import React, { useEffect, useState, useRef } from 'react'
import StimulusGroup from '../manage_stimulus/StimulusGroup'
import axios from 'axios'

/*
[
  {
    gameName: str,
    stimuli: [
      {
        name: str
        thumbnail: logo
        file: mp4/mp3/txt/png
      }
    ]
  }
]
*/

const VisualizeGames = ({ currentAction, setCurrentAction, setCurrentSection, currentStimuli, setCurrentGame }) => {
    const [gamesList, setGamesList] = useState([])
    const [selectedGroup, setSelectedGroup] = useState('')
    const noGameSelectedMsg = useRef()
    const serverErrorMsg = useRef(null)

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
                serverErrorMsg.current.className = 'errorMsg visible'
                console.error(error)
            }
        } 
        fetchData()
    }, [])



    const handleClickModify = () => {
      if (selectedGroup) {
        setCurrentSection('EditGame');
        setCurrentAction('modifyAddGame');
      } else {
        noGameSelectedMsg.current.className = 'errorMsg visible'
      }
    }

    const handleDeleteGame = () => {
      if (selectedGroup) {
        setCurrentSection('DeleteGameModal')
      }
      else {
        noGameSelectedMsg.current.className = 'errorMsg visible'
      }
    }

    return (
        <>
            <h2 className='titleHeader'>Giochi presenti nel database</h2>
            <p ref={serverErrorMsg} className="errorMsg nonVisible">Errore con il server, riprovare più tardi</p>
            <div className='modal'>
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
                            currentAction={currentAction}
                            currentStimuli={[]}
                            setCurrentStimuli={(val) => {}} />)
                    })
                }

                </div>
                <div className='buttonGroup'>
                    <button onClick={() => setCurrentSection('GamesMenu')}>Indietro</button>
                    {
                      currentAction === 'modifyGame' ?
                        <button onClick={handleClickModify}>Modifica gioco</button>
                      :
                        <button onClick={handleDeleteGame}>Elimina gioco</button>
                    }
                </div>
                <p ref={noGameSelectedMsg} className='errorMsg nonVisible' style={{margin: 'auto', marginTop: '0.4em'}}>Nessun gioco selezionato, se non sono presenti giochi, crearne uno nella sezione "Aggiungi gioco"</p>
            </div>
        </>
    )
}

export default VisualizeGames