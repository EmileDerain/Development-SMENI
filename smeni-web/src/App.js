import React from 'react';
import './App.css';
import "@fontsource/nunito-sans";
import jwtDecode from 'jwt-decode';

import {Routes, Route, useNavigate} from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import Models from "./containers/Models";
import Menu from "./containers/Menu";
import Audios from "./containers/Audios";
import Model from "./containers/Model";
import Doctors from "./containers/Doctors";
import Patients from "./containers/Patients";
import PatientDetails from "./containers/PatientDetails";
import Login from "./containers/Login";
import PageNotFound from "./containers/PageNotFound";

const checkAuthentication = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    console.log('decodedToken', decodedToken)

    return decodedToken.exp > currentTime;
}

const getAccount = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    const decodedToken = jwtDecode(token);
    return decodedToken;
}

const getTypeAccount = () => {
    return localStorage.getItem('accountType');
}

function App() {
    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
        return <Login/>
    }

    if (getTypeAccount() === "admin")
        return (
            <div>
                <Router>
                    <Routes>
                        <Route path="/login" exact element={<Login/>}/>
                        <Route path="/" exact element={<Menu account={getAccount()}/>}/>
                        <Route path="/audios" element={<Audios/>}/>
                        <Route path="/models" element={<Models/>}/>
                        <Route path="/doctors" element={<Doctors/>}/>
                        <Route path="/model" element={<Model/>}/>
                        <Route path="/patients" element={<Patients/>}/>
                        <Route path="/patient/:id" element={<PatientDetails/>}/>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Routes>
                </Router>
            </div>
        );
    else
        return (
            <div>
                <Router>
                    <Routes>
                        <Route path="/login" exact element={<Login/>}/>
                        <Route path="/" exact element={<Menu account={getAccount()}/>}/>
                        <Route path="/audios" element={<Audios/>}/>
                        <Route path="/patients" element={<Patients/>}/>
                        <Route path="/patient/:id" element={<PatientDetails/>}/>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Routes>
                </Router>
            </div>
        );
}


export default App;
