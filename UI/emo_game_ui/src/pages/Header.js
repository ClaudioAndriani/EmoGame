import React from 'react'
import { NavLink } from "react-router-dom"
import '../App.css'

const Header = ({ user }) => {

  let activeClassName = "navActive";

  return (
    <div className='appHeader'>
      <div className='appHeaderLeft'>
          <NavLink
            to="/">
            <img src='/assets/EmoGameLogo.png' className="logoImage"/>
          </NavLink>
        { user.type === 'therapist' ? (
          <nav className='headerNav'>
            <NavLink
              to="/manage_stimulus"
              className={({ isActive }) =>
                isActive ? activeClassName : undefined
              }
            >
              Gestione stimoli
            </NavLink>
            <NavLink
              to="/manage-games"
              className={({ isActive }) =>
                isActive ? activeClassName : undefined
              }
            >
              Gestione giochi
            </NavLink>
            <NavLink
              to="/game"
              className={({ isActive }) =>
                isActive ? activeClassName : undefined
              }
            >
              Gioca
            </NavLink>
            <NavLink 
              to="/analyze-game"
              className={({ isActive }) =>
                isActive ? activeClassName : undefined
              }
            >
              Analizza risultati giochi
            </NavLink>
            <NavLink
              to="/create-therapist"
              className={({ isActive }) =>
                isActive ? activeClassName : undefined
              }
            >
              Crea account terapista
            </NavLink>
          </nav>
        ) : (
          <></>
        )
      }
      </div> 

      { user.type === 'therapist' ?
        (<h2 style={{marginLeft: 'auto', fontWeight: 'normal'}}>Benvenuto, {user.username}</h2>)
        :
        (<></>)
      }
    </div>
  )
}

export default Header