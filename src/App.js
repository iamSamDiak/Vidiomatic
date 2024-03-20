import './App.css';

import Webcam from './components/Webcam';
import Record from './components/Record';
import Card from './components/Card';
import { useEffect, useRef, useState, createContext } from 'react';

export const Context = createContext()

function App() {

  const [messageCard, setMessageCard] = useState({message: null, type: null})

  return (
    <div className='root'>
      <Context.Provider value={{ messageCard, setMessageCard }}>
        <Card/>
        <div className="app">
          <div className="presentation">
              <div className="presentation-title">
                  <h1>Vidiomatic</h1>
              </div>
              <div className="presentation-headline">
                  <h3>Oubliez les montages vidéo fastidieux, Vidiomatic vous permet d'enregistrer votre écran et votre webcam simultanément pour des présentations, tutoriels, et bien plus encore, directement depuis votre navigateur.</h3>
              </div>
          </div>
          <div className='video-preview-menu'>
            <div className='video-preview hidden'>
              <h3 style={{margin: "30px"}}>Aperçu de la vidéo :</h3>
              <video autoPlay controls></video>
            </div>
            <div className="menu">
              <Webcam/>
              <Record/>
            </div>
          </div>
        </div>
      </Context.Provider>
    </div>
  );
}

export default App;
