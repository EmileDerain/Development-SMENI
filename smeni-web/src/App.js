import React from 'react';
import './App.css';
import "@fontsource/nunito-sans";


import {Routes, Route} from 'react-router-dom';
import {BrowserRouter as Router} from "react-router-dom";

import Models from "./containers/Models";
import Menu from "./containers/Menu";
import Audios from "./containers/Audios";
import Model from "./containers/Model";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" exact element={<Menu/>}/>
                    <Route path="/audios" element={<Audios/>}/>
                    <Route path="/models" element={<Models/>}/>
                    <Route path="/model" element={<Model/>}/>
                    <Route>404 Not Found!</Route>
                </Routes>
            </Router>
        </div>
    );
}


export default App;
