import React from 'react';
import './App.css';
import "@fontsource/nunito-sans";


import {Routes, Route} from 'react-router-dom';
import {BrowserRouter as Router} from "react-router-dom";

import Models from "./containers/Models";
import Menu from "./containers/Menu";
import Audios from "./containers/Audios";
import Model from "./containers/Model";
import Doctors from "./containers/Doctors";
import Patients from "./containers/Patients";
import PatientDetails from "./containers/PatientDetails";


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" exact element={<Menu/>}/>
                    <Route path="/audios" element={<Audios/>}/>
                    <Route path="/models" element={<Models/>}/>
                    <Route path="/doctors" element={<Doctors/>}/>
                    <Route path="/model" element={<Model/>}/>
                    <Route path="/patients" element={<Patients/>}/>
                    <Route path="/patient/:id" element={<PatientDetails/>}/>
                    <Route path="/404">404 Not Found!</Route>
                </Routes>
            </Router>
        </div>
    );
}


export default App;
