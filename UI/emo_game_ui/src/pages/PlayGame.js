import React, {useState} from 'react'

import SelectGameVisualizationMenu from '../components/play_games/SelectGameVisualizationMenu'
import PlayGameStimulus from '../components/play_games/PlayGameStimulus'
import SaveMatch from '../components/play_games/SaveMatch'

const PlayGame = () => {
  const [currentSection, setCurrentSection] = useState("SelectGameVisualizationMenu")
  const [currentGame, setCurrentGame] = useState('')
  const [currentStimuli, setCurrentStimuli] = useState([])
  const [player, setPlayer] = useState('')
  const [matchData, setMatchData] = useState({ 
      showLabel: false,
      allowWebcam: false,
      tsForCsv: [],
    })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recordedChunks, setRecordedChunks] = useState([]);

  const sections = {
    "SelectGameVisualizationMenu": <SelectGameVisualizationMenu 
      setCurrentSection={setCurrentSection}
      currentGame={currentGame}
      setCurrentGame={setCurrentGame}
      player={player}
      setPlayer={setPlayer}
      setCurrentStimuli={setCurrentStimuli}
      matchData={matchData}
      setMatchData={setMatchData}
      />,
    "PlayGameStimulus": <PlayGameStimulus 
      currentGame={currentGame} 
      setCurrentGame={setCurrentGame}
      currentStimuli={currentStimuli}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      setCurrentStimuli={setCurrentStimuli}
      setCurrentSection={setCurrentSection}
      player={player}
      matchData={matchData}
      setMatchData={setMatchData}
      recordedChunks={recordedChunks}
      setRecordedChunks={setRecordedChunks}
      />,
    "SaveMatch": <SaveMatch
      matchData={matchData}
      setMatchData={setMatchData}
      currentGame={currentGame} 
      player={player} 
      recordedChunks={recordedChunks}
      setRecordedChunks={setRecordedChunks}
    />
  }
  return <>{sections[currentSection]}</> 
}

export default PlayGame