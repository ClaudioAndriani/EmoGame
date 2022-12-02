import React, {useState, useRef, useEffect} from 'react'

const GStimulusRow = ({stimulus, position, deleteStimulus, index, moveUp, moveDown, setCurrentStimuli, setCurrentSection, setCurrentAction, currentAction}) => {
    const [srcArrows, setSrcArrows] = useState({up: 'assets/arrow_up_icon.png', down: 'assets/arrow_down_icon.png'})

    const refDuration = useRef(null);

    let tempStimulus = {}

    const handleDurationChange = () => {
        stimulus.duration = parseInt(refDuration.current.value)
    }

    useEffect(() => {
        tempStimulus = stimulus
        refDuration.current.value = stimulus.duration
    }, [])

    return (
        <div className='GStimulusRowDiv'>
            <div className='orderArrows'>
                {/* Ordinatore */}
                { position !== 'first' ? 
                    <button
                        onMouseEnter={() => {setSrcArrows({up: 'assets/arrow_up_icon_selected.png', down: 'assets/arrow_down_icon.png'})}} 
                        onMouseLeave={() => {setSrcArrows({up: 'assets/arrow_up_icon.png', down: 'assets/arrow_down_icon.png'})}} 
                        className='upOrderArrow'
                        onClick={() => moveUp(index)}>
                        <img src={srcArrows.up} />
                    </button>
                    :
                    <button className='upOrderArrow' disabled>
                        <img src='assets/black_icon.png' />
                    </button>
                }
                { position !== 'last' ?
                    <button 
                        onMouseEnter={() => {setSrcArrows({up: 'assets/arrow_up_icon.png', down: 'assets/arrow_down_icon_selected.png'})}} 
                        onMouseLeave={() => {setSrcArrows({up: 'assets/arrow_up_icon.png', down: 'assets/arrow_down_icon.png'})}} 
                        className='downOrderArrow'
                        onClick={() => moveDown(index)}>
                        <img src={srcArrows.down} />
                    </button>
                    :
                    <button className='downOrderArrow' disabled>
                        <img src='assets/black_icon.png' />
                    </button>
                }
            </div>
            {/* Descrittore */}
            <img className="stimulusDescriptorImage" src={stimulus.thumbnail}></img> {/* TODO: fixare */}
            <p className='GStimulusRowName'>{stimulus.name}</p>
            <p style={{width: 'fit-content', fontSize: '25px'}}>durata:</p>
            { stimulus.thumbnail === 'assets/audioLogo.png' || stimulus.thumbnail === 'assets/videoLogo.png' ?
                <input onChange={handleDurationChange} type="number" ref={refDuration} readOnly/>
                :
                <input onChange={handleDurationChange} type="number" ref={refDuration} min="1" />
            }
            {/* Aggiunta Sottostante */}
            <button onClick={() => {
                setCurrentStimuli([index])
                if (currentAction === 'createGame') setCurrentAction('addMiddleGame')
                else if (currentAction === 'modifyAddGame') setCurrentAction('modifyMiddleGame')
                setCurrentSection('VisualizeStimulus')
            }}>+</button>
            {/* Cancellazione */}
            <button onClick={() => deleteStimulus(index)}>×</button>
        </div>
    )
}

export default GStimulusRow