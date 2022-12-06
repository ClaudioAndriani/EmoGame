import axios from 'axios'
import React, { useEffect, useRef } from 'react'

/*
name: str
thumbnail: logo
file: mp4/mp3/txt/png
*/ 
const Stimulus = ({ stimulus, currentAction, currentStimuli, setCurrentStimuli }) => {
  const stimulusRef = useRef(null)

  const selected = currentStimuli.reduce((prev, curr) => prev |= curr.name === stimulus.name, false)
  
  const headers = {
    'Content-Type': 'text/plain'
  };

  const selectable = 
    currentAction === 'visualizeStimulus' || 
    currentAction === 'deleteStimulus' || 
    currentAction === 'createGame' ||
    currentAction === 'modifyAddGame' ||
    currentAction === 'addMiddleGame' ||
    currentAction === 'modifyAddedTailGame' ||
    currentAction === 'modifyMiddleGame';

  const defaultDivClass = selectable ? 'stimulusIconDiv' : 'stimulusIconNoHover'

  useEffect(() => {
    if (!selected) {
      stimulusRef.current.className = defaultDivClass
    } else {
      stimulusRef.current.className = defaultDivClass + ' stimulusSelected'
    }
  }, [])

  useEffect(() => {
    if (!selected) {
      stimulusRef.current.className = defaultDivClass
    }
  }, [currentStimuli])

  const handleStimulusClick = async () => {
    if (!selected) {
      stimulusRef.current.className = 'stimulusIconDiv stimulusSelected'
      if (currentAction === 'visualizeStimulus') {
        setCurrentStimuli([stimulus])
      } else {
        let duration = 0
        try {
          const thumbnail2Type = {
            'assets/imageLogo.png': 0,
            'assets/videoLogo.png': 1,
            'assets/textLogo.png': 2,
            'assets/audioLogo.png': 3,
          }
          const resp = await axios.post('http://localhost:8080/get_stimulus_duration', {file_name: stimulus.file, type: thumbnail2Type[stimulus.thumbnail]}, {headers})
          if (resp.data.valid) {
            duration = resp.data.duration
          }
        } catch (error) {
          console.error(error)
        }
        setCurrentStimuli([...currentStimuli, {...stimulus, duration }])
      }
    } else {
      if (currentAction === 'visualizeStimulus') {
        setCurrentStimuli([])
      } else {
        setCurrentStimuli(currentStimuli.filter(sti => sti.name !== stimulus.name))
      }
    }
  }

  return (
    <div ref={stimulusRef} onClick={() => selectable ? handleStimulusClick() : ''} title={stimulus.name}>
        <div className='stimuliImgDiv'>
            <img className="stimuliImg" alt={stimulus.thumbnail} src={stimulus.thumbnail}/>
        </div>
        <p style={{overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px'}}>{stimulus.name}</p>
    </div>
  )
}

export default Stimulus