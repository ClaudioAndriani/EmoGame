import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginModal from './pages/LoginModal.js';
import Header from './pages/Header';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import AddTherapist from './pages/AddTherapist'
import ManageGames from './pages/ManageGames'
import AnalyzeGames from './pages/AnalyzeGames'
import PlayGame from './pages/PlayGame'
import ManageStimulus from './pages/ManageStimulus';
import AccessDenied from './pages/AccessDenied';

function App() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    type: 'null',
  })

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} setUser={setUser} />
        <header className="App-header">
          <Routes>
            {
              (() => {
                if (user.type === 'null') {
                  return (
                    <>
                      <Route
                        path='/login'
                        element={<LoginModal user={user} setUser={setUser} />}
                      />
                      <Route path="*" element={<Navigate replace to="/login" />} />
                    </>
                  )
                } else if (user.type === "patient") {
                  return (
                    <>
                      <Route
                        path='/game'
                        element={<PlayGame />}
                      />
                      <Route
                        path='/accessDenied'
                        element={<AccessDenied setUser={setUser} />}
                      />
                      <Route path="*" element={<Navigate replace to="/accessDenied" />} />
                    </>
                  )
                } else if (user.type === "therapist") {
                  return (<>
                    <Route
                      path="/"
                      element={<Home user={user} setUser={setUser} />}
                    />

                    <Route
                        path='/login'
                        element={<LoginModal user={user} setUser={setUser} />}
                      />
                    <Route
                      path="/manage_stimulus"
                      element={<ManageStimulus />}
                    />
                    <Route
                      path="/manage-games"
                      element={<ManageGames />}
                    />
                    <Route
                      path="/game"
                      element={<PlayGame />}
                    />
                    <Route
                      path="/analyze-game"
                      element={<AnalyzeGames />}
                    />
                    <Route
                      path="/create-therapist"
                      element={<AddTherapist />}
                    />

                    <Route
                      path="*"
                      element={<ErrorPage />}
                    />
                  </>
                  )
                }
              })()
            }
          </Routes>
        </header>
      </BrowserRouter>
    </div>
  );
}

export default App;
