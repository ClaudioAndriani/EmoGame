import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PlayStimulus = ({ currentStimuli, setCurrentSection, setCurrentStimuli }) => {
    const [src, setSrc] = useState(null)

    const ext = currentStimuli[0].file.split('.').pop()
    
    const file_type_enum = {
        'png': 0,
        'jpeg': 0,
        'jpg': 0,
        'mp4': 1,
        'avi': 1,
        'mkv': 1,
        'txt': 2,
        'mp3': 3,
        'ogg': 3,
    }

    useEffect(() => {
        const fetchData = async () => {
            if (file_type_enum[ext] !== 2) {
                const res = await axios.post("http://localhost:8080/get_stimulus_file", {fileName: currentStimuli[0].file}, {
                    headers: {'Content-Type': 'text/plain'},
                    responseType: 'blob',
                });
                setSrc(URL.createObjectURL(res.data))
            } else {
                const res = await axios.post("http://localhost:8080/get_stimulus_text", {fileName: currentStimuli[0].file}, {
                    headers: {'Content-Type': 'text/plain'},
                });
                setSrc(res.data.text)
            }
        }
        fetchData()
    }, [])

    const displayer = [
        <img src={src} alt="Immagine stimolo" className="stimulusPlayImage" />,
        <><video className="stimulusPlayImage" key={src} controls autoPlay>
            <source src={src} type={"video/" + ext} />
            Your browser does not support the video tag.
        </video></>,
        <p className="stimulusPlayText" style={{whiteSpace: "pre-wrap"}}>
            {src}
        </p>,
        <audio className="audioPlayer" controls autoPlay key={src} id="audioPlayer">
            <source src={src} type={"audio/" + (ext === 'mp3' ? 'mpeg' : ext)} />
            Your browser does not support the audio tag.
        </audio>,
    ]

    return (
        <>
            <div className='modal'>
                <h2 className='titleHeader'>{currentStimuli[0].name}</h2>
                <div className={file_type_enum[ext] === 3 ? 'audioPlayerContainer': 'playStimulusDiv'}>
                    {displayer[file_type_enum[ext]]}
                </div>
                <div>
                    <button className='backButton' onClick={() => {setCurrentStimuli([]); setCurrentSection('VisualizeStimulus')}}>Indietro</button>
                </div>
            </div>
        </>
    )
}

export default PlayStimulus