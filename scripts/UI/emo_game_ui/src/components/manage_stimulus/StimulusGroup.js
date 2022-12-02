import React from 'react'
import Stimulus from './Stimulus'

const StimulusGroup = ({ groupName, list, currentAction, currentStimuli, setCurrentStimuli, setSelectedGroup, selectedGroup }) => {

  const handleOnClick = () => {
    if ((currentAction === 'modifyGame' || currentAction === 'deleteGame') && selectedGroup !== groupName) {
      setSelectedGroup(groupName)
    }
  }

  return (
    <div className={selectedGroup !== groupName ? "categoryVisualizer" : 'categoryVisualizer stimulusVisualizerSelected'} onClick={handleOnClick}>
        <h3 className='categoryVisualizerName'>{groupName}</h3>
        <div className={
          (currentAction === 'modifyGame' || currentAction === 'deleteGame'
           ? 
            'stimulusVisualizerHover'
           :
            'stimulusVisualizer'
            )}>
            {list.map((stimulus, index) => {
                return (<Stimulus key={`${groupName} ${stimulus.name} ${index}`} stimulus={stimulus} currentAction={currentAction} currentStimuli={currentStimuli} setCurrentStimuli={setCurrentStimuli} />)
            })}
        </div>
    </div>
  )
}

export default StimulusGroup