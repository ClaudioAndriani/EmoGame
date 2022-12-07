import React, {useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv";

const SaveMatch = (matchData) => {

  const normalizeString = string => string.replaceAll(' ', '_').replaceAll('\t', '_')

  const {recordedChunks, player, currentGame} = matchData
  const navigate = useNavigate()
  const csvLinkRef = useRef(null)
  const dateString = new Date().toLocaleString().replace(',','').replaceAll(' ', '_').replaceAll('/', '-').replaceAll('\\', '-').replaceAll(':', '.')
  const [fileName, setFileName] = useState(normalizeString(player) + '_' + currentGame + '_' + dateString)

  const handleDownload = () => {
    if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = normalizeString(fileName) + '.webm';
        a.click();
        window.URL.revokeObjectURL(url);
    }
  };


  const headers = Object.keys(matchData.matchData.tsForCsv[0]).map((key) => {return {'label': key, 'key': key}});
  
  const csvData = matchData.matchData.tsForCsv;

  return (
    <div className='modal'>
      <h1 className='titleHeader'>Partita terminata</h1>
      <label className='downloadLabel'>Nome file video e csv:</label>
      <input value={fileName} style={{padding: '0.3em'}} onChange={(event) => {setFileName(event.target.value)}}/>
      { matchData.matchData.allowWebcam ?
        <button className="saveMatchBtn" onClick={handleDownload}>Scarica Video</button>
        :
        <></>
      }
      <CSVLink data={csvData} headers={headers} filename={fileName + '.csv'} ref={csvLinkRef} className='csvLinkToButton' target="_blank">Scarica CSV</CSVLink>
      <button className="saveMatchBtn" onClick={() => navigate('/')}>Annulla gioco</button>
    </div>
  )
}

export default SaveMatch