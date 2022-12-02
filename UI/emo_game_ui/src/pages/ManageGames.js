import React, {useState} from 'react'
import GamesMenu from '../components/manage_games/GamesMenu'
import VisualizeGames from '../components/manage_games/VisualizeGames'
import EditGame from '../components/manage_games/EditGame'
import VisualizeStimulus from '../components/manage_stimulus/VisualizeStimulus'
import DeleteGameModal from '../components/manage_games/DeleteGameModal'

const ManageGames = () => {
  const [currentSection, setCurrentSection] = useState("GamesMenu")
  const [currentGame, setCurrentGame] = useState('')
  const [currentAction, setCurrentAction] = useState('') // createGame, modifyGame, deleteGame, addMiddleGame, modifyAddedTailGame, modifyMiddleGame
  const [currentStimuli, setCurrentStimuli] = useState([])
  const [stimuliRows, setStimuliRows] = useState([])

  const sections = {
    "GamesMenu": <GamesMenu setCurrentAction={setCurrentAction} setCurrentSection={setCurrentSection} />,
    "VisualizeGames": <VisualizeGames currentAction={currentAction} setCurrentSection={setCurrentSection} currentGame={currentGame} setCurrentGame={setCurrentGame} setCurrentAction={setCurrentAction} />,
    "EditGame": <EditGame 
      currentAction={currentAction}
      setCurrentSection={setCurrentSection} 
      currentGame={currentGame}
      setCurrentGame={setCurrentGame} 
      currentStimuli={currentStimuli} 
      setCurrentStimuli={setCurrentStimuli} 
      setCurrentAction={setCurrentAction} 
      stimuliRows={stimuliRows}
      setStimuliRows={setStimuliRows}
      />,
    "VisualizeStimulus": <VisualizeStimulus currentAction={currentAction} setCurrentSection={setCurrentSection} currentStimuli={currentStimuli} setCurrentStimuli={setCurrentStimuli} />,
    "DeleteGameModal": <DeleteGameModal setCurrentGame={setCurrentGame} currentGame={currentGame} setCurrentSection={setCurrentSection} setCurrentAction={setCurrentAction}></DeleteGameModal>,
  }
  return <>{sections[currentSection]}</> 
}

export default ManageGames