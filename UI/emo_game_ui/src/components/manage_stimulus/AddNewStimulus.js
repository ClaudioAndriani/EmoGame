import React, { useRef, useState, useEffect } from 'react'
import '../../App.css'
import axios from 'axios';

const supported_file_types = [
  '.png',
  '.jpeg',
  '.jpg',
  '.mp4',
  '.txt',
  '.mp3',
  '.ogg'
]

const AddNewStimulus = ({setCurrentSection}) => {
  const [file, setFile] = useState()
  const [categoriesList, setCategoriesList] = useState([])
  const [ok2Add, setOk2Add] = useState(false)

  const stimulusName = useRef()
  const catRef = useRef(null)
  const stiName = useRef(null)
  const stiFile = useRef(null)
  const successMessage = useRef(null)
  const nonSupportedMsg = useRef(null)
  const emptyFieldsMsg = useRef(null)
  const catNonValidMsg = useRef(null)
  const serverErrorMsg = useRef(null)

  const handleAddStimoulus = async () => {

    let ok = ok2Add
    emptyFieldsMsg.current.className = 'errorMsg nonVisible'
    catNonValidMsg.current.className = 'errorMsg nonVisible'

    if (!stiName.current.value || !stiFile.current.value || !catRef.current.value) {
      setOk2Add(false)
      ok = false
      emptyFieldsMsg.current.className = 'errorMsg visible'
    }

    if (!categoriesList.includes(catRef.current.value)) {
      await handleAddCat()
    }

    if (ok) {
      const formData = new FormData();
      formData.append("name", stiName.current.value);
      formData.append("category", catRef.current.value);
      formData.append("file", file);
      
      try {
        const resp = await axios.post("http://localhost:8080/add_stimulus", formData, { "Content-Type": "multipart/form-data" })
        if (resp.data.valid) {
          successMessage.current.className = 'visible'
          stimulusName.current.className = 'errorMsg nonVisible'
        } else {
          stimulusName.current.className = 'errorMsg visible'
        }
      } catch(error) {
        serverErrorMsg.current.className = 'errorMsg visible'
      }
    }
  };

  const headers = {
    'Content-Type': 'text/plain'
  };

  const handleChangeFile = (event) => {
    const upFile = event.target.files[0]
    const fileExt = '.' + upFile.name.split('.').pop()
    if (supported_file_types.includes(fileExt)) {
      nonSupportedMsg.current.className = 'errorMsg nonVisible'
      setFile(upFile)
      setOk2Add(true)
    } else {
      nonSupportedMsg.current.className = 'errorMsg visible'
      setOk2Add(false)
    }
  }

  const handleAddCat = async () => {
    const newCat = catRef.current.value
    try{
      const resp = await axios.post("http://localhost:8080/add_stimulus_category", {newCat}, {headers})
      if (resp.data.valid) {
        setCategoriesList([...categoriesList, newCat])
      } else {
        serverErrorMsg.current.className = 'errorMsg visible'
      }
    } catch(error){
      serverErrorMsg.current.className = 'errorMsg visible'
    }  
  }

  const handleOnNameChange = async () => {
    successMessage.current.className = 'nonVisible';
    if (stiName.current.value !== '') {
      try {
        const resp = await axios.post("http://localhost:8080/is_stimulus_name_in_db", {name: stiName.current.value}, {headers})
        if (resp.data.valid) { // valid = true => questo nome non è nel database
          setOk2Add(true)
          stimulusName.current.className = 'errorMsg nonVisible';
        } else {
          setOk2Add(false)
          stimulusName.current.className = 'errorMsg visible'
        }
      } catch(error){
        serverErrorMsg.current.className = 'errorMsg visible'
      }  
    } else {
      setOk2Add(false)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try{
        const resp = await axios.get("http://localhost:8080/get_stimulus_categories", {}, {headers})
        setCategoriesList(resp.data.categories)
      } catch(error){
        serverErrorMsg.current.className = 'errorMsg visible'
      }  
    }
    fetchData()
  }, [])

  return (
      <>
        <h2 className='titleHeader'>Inserisci un nuovo stimolo</h2>
        <div className='modal'>
          <p ref={serverErrorMsg} className="errorMsg nonVisible">Errore con il server, riprovare più tardi</p>
          <p ref={successMessage} className='nonVisible' style={{color: 'green'}}>Aggiunta avvenuta con successo</p>
          <input ref={stiName} onBlur={handleOnNameChange} className='textField' placeholder='Nome stimolo' maxLength={30} />
          <p ref={stimulusName} className='errorMsg nonVisible'>Nome per stimolo già in uso</p>
          <div className='inputFileDiv'>
            <input ref={stiFile} type='file' onChange={handleChangeFile} accept={supported_file_types.join(',')} />
            <p ref={nonSupportedMsg} className='errorMsg nonVisible' >Tipo di file non supportato, i file supportati sono {supported_file_types.join(',')}</p>
          </div>
          <div className='datalistCategoryClass'>
            <input ref={catRef} className='catList' list="categories" placeholder='Categoria stimolo...' maxLength={15}/>
            <datalist id="categories">
              {
                categoriesList.map((element) => <option value={element} key={element} />) 
              }
            </datalist>
          </div>
          <p ref={catNonValidMsg} className='errorMsg nonVisible'>La categoria non è presente, aggiungerla al database, prima di aggiungere lo stimolo</p>
          <div className='buttonGroup'>
            <p ref={emptyFieldsMsg} className='errorMsg nonVisible'>Tutti i campi devono essere compilati correttamente</p>
            <button onClick={() => handleAddStimoulus()}>Aggiungi</button>
            <button onClick={() => setCurrentSection('StimulusMenu')}>Indietro</button>
          </div>
        </div>
        <p className='modalHint'>
        Per aggiungere una nuova categoria è necessario inserirne il nome<br /> 
        nella casella delle categorie ed effettuare l'aggiunta dello stimolo, <br />
        la categoria verrà aggiunta automaticamente insieme allo stimolo</p>
      </>
    )
}

export default AddNewStimulus