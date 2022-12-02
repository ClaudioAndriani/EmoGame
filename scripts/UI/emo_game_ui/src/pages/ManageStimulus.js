import React from 'react'
import { useState } from 'react'
import StimulusMenu from '../components/manage_stimulus/StimulusMenu'
import AddNewStimulus from '../components/manage_stimulus/AddNewStimulus'
import VisualizeStimulus from '../components/manage_stimulus/VisualizeStimulus'
import PlayStimulus from '../components/manage_stimulus/PlayStimulus'
import DeleteStimulus from '../components/manage_stimulus/DeleteStimulus'

const ManageStimulus = () => {
  const [currentSection, setCurrentSection] = useState("StimulusMenu")
  const [currentStimuli, setCurrentStimuli] = useState([])
  const [currentAction, setCurrentAction] = useState('') // visualizeStimulus, deleteStimulus

  const sections = {
    "StimulusMenu": <StimulusMenu setCurrentAction={setCurrentAction} setCurrentSection={setCurrentSection}/>,
    "AddNewStimulus": <AddNewStimulus setCurrentSection={setCurrentSection}/>,
    "VisualizeStimulus": <VisualizeStimulus currentAction={currentAction} setCurrentSection={setCurrentSection} currentStimuli={currentStimuli} setCurrentStimuli={setCurrentStimuli} />,
    "PlayStimulus": <PlayStimulus setCurrentSection={setCurrentSection} currentStimuli={currentStimuli} setCurrentStimuli={setCurrentStimuli} />,
    "DeleteStimulus": <DeleteStimulus setCurrentSection={setCurrentSection} currentStimuli={currentStimuli} setCurrentStimuli={setCurrentStimuli} />,
  }
  return <>{sections[currentSection]}</> 
    

}

export default ManageStimulus