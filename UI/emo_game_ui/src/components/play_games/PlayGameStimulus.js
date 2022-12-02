import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import Webcam from 'react-webcam'

let intervalN = null;
const fps = 1000 / 30
let timeoutN = null;
let startedTimeout = false;
let elapsedTime = 0;

const PlayGameStimulus = ({
    currentGame,
    setCurrentGame,
    setCurrentSection,
    currentStimuli,
    setCurrentStimuli,
    currentIndex,
    setCurrentIndex,
    player,
    matchData, 
    setMatchData,
    recordedChunks,
    setRecordedChunks,
}) => {

    
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);

    const [src, setSrc] = useState(null)
    const progressBar = useRef(null)
    const [loading, setLoading] = useState(true)

    const handleStartCapture = React.useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCapture = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);
    
    let currentStimulus = currentStimuli[currentIndex]

    const ext = currentStimuli[currentIndex].file.split('.').pop()
    
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

    elapsedTime = 0;

    useEffect(() => {
        if (!loading) {
            const fetchData = async () => {
                if (file_type_enum[ext] !== 2) {
                    const res = await axios.post("http://localhost:8080/get_stimulus_file", {fileName: currentStimulus.file}, {
                        headers: {'Content-Type': 'text/plain'},
                        responseType: 'blob',
                    });
                    setSrc(URL.createObjectURL(res.data))
                } else {
                    const res = await axios.post("http://localhost:8080/get_stimulus_text", {fileName: currentStimulus.file}, {
                        headers: {'Content-Type': 'text/plain'},
                    });
                    setSrc(res.data.text)
                }
                elapsedTime = 0;
                if (intervalN === null) {
                    intervalN = setInterval(() => {
                        elapsedTime = elapsedTime + fps / 1000
                        progressBar.current.style.width = `${elapsedTime / currentStimulus.duration * 100}%`
                    }, fps)
                }
                
                if (startedTimeout === false) {
                    startedTimeout = true;
                    let tsForCsv = matchData.tsForCsv
                    tsForCsv.push({
                        "ts": currentStimuli.reduce((pred, curr, i) => { return pred + (i < currentIndex ? curr.duration : 0) }, 0),
                        "gameName": currentGame,
                        "stimulusName": currentStimulus.name,
                        "stimulusFile": currentStimulus.file,
                        "stimulusDuration": currentStimulus.duration,
                    })
                    setMatchData({...matchData, tsForCsv})
                    timeoutN = setTimeout(() => {
                        if (currentIndex + 1 < currentStimuli.length) {
                            setCurrentIndex(currentIndex + 1)
                        } else {
                            if (matchData.allowWebcam && capturing) {
                                handleStopCapture()
                            }
                            setCurrentIndex(0)
                            setCurrentSection('SaveMatch')
                        }
                        clearInterval(intervalN)
                        intervalN = null;
                        timeoutN = null;
                        startedTimeout = false;
                        elapsedTime = 0;
                    }, currentStimulus.duration * 1000)
                }
                
                if (matchData.allowWebcam && !capturing && currentIndex === 0) {
                    setRecordedChunks([])
                    handleStartCapture()
                }
            }
            fetchData()
        }
    }, [currentIndex, loading])

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                clearInterval(intervalN)
                clearTimeout(timeoutN)
                intervalN = null;
                timeoutN = null;
                startedTimeout = false;
                elapsedTime = 0;
                setLoading(false)
            }, 2000)
        }
        return clearTimeout(timeoutN)
    }, [loading])

    const displayer = [
        <img src={src} alt="Immagine stimolo" className="stimulusPlayImage" />,
        <video className="stimulusPlayImage" key={src} autoPlay>
            <source src={src} type={"video/" + ext} />
            Your browser does not support the video tag.
        </video>,
        <p className="stimulusPlayText" style={{whiteSpace: "pre-wrap"}}>
            {src}
        </p>,
        <>
        <img src='assets/audioLogo.png' style={{width: "150px", margin: 'auto'}}/>
        <audio className="audioPlayer" key={src} id="audioPlayer"  autoPlay>
            <source src={src} type={"audio/" + (ext === 'mp3' ? 'mpeg' : ext)} />
            Your browser does not support the audio tag.
        </audio>
        </>,
    ]

    return <>
    <Webcam audio={false} ref={webcamRef} className="hideVideo" />
    {
            !loading ?
            <>
                <div className='modal'>
                    <div className='PlayGameStimulusTitle'>
                        {matchData.showLabel ?
                            <>
                                <h2 className='titleHeader' style={{textAlign: 'left'}}>{currentGame} - <span style={{fontSize: '20px'}}>{currentStimulus.name}</span></h2>
                                <h2 className='titleHeader' style={{textAlign: 'right'}}>{currentIndex + 1}/{currentStimuli.length}</h2>
                            </>
                            :
                            <></>
                        }
                    </div>
                    <div className={file_type_enum[ext] === 3 ? 'audioPlayerContainer': 'playStimulusDiv'}>
                        {displayer[file_type_enum[ext]]}
                    </div>
                    <div>
                        <div className='progressBar wrapperProgressBar'>
                            <div ref={progressBar} className='progressBar barCompletedProgressBar' style={{width: 0}}></div>
                        </div>
                        <br />
                        <button className='backButton' onClick={() => {
                            if (matchData.allowWebcam && capturing) {
                                handleStopCapture()
                            }
                            clearInterval(intervalN)
                            clearTimeout(timeoutN)
                            intervalN = null;
                            timeoutN = null;
                            startedTimeout = false;
                            elapsedTime = 0;
                            setCurrentGame('');
                            setCurrentStimuli([]);
                            setCurrentIndex(0);
                            setCurrentSection('SelectGameVisualizationMenu')
                            setMatchData({...matchData, tsForCsv: []})
                        }}>Annulla gioco</button>
                    </div>
                </div>
            </>
            :
            <>
                <div className='modal' style={{width: '50vh'}}>
                    <img src='assets/loading.gif' style={{mixBlendMode: 'color-burn', height: '40vh'}}></img>
                </div>
            </>
        }
    </>
}

export default PlayGameStimulus