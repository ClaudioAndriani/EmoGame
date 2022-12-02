import React from 'react'
import { useNavigate } from 'react-router-dom'

const AccessDenied = ({setUser}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    setUser({
        username: '',
        password: '',
        type: 'null',
    })
    navigate('/login')
  }

  return (
      <>
        <h2 className='titleHeader'>Non disponi dei requisiti per accedere a questa pagina</h2>
        <div className='modal'>
          <button onClick={handleClick}>Torna al login</button>
        </div>
      </>
    )
}

export default AccessDenied