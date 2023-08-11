import React, {useEffect, useRef, useState} from "react";
import {
    mdiAccountCogOutline,
    mdiDoctor,
} from "@mdi/js";
import Icon from "@mdi/react";

import Background from "./component/Background";
import config from "../config/config";

import './Global.css';
import './Doctors.css';
import './Login.css';
// import {useNavigate} from "react-router-dom";

const Login = () => {
    // const navigate = useNavigate();

    const [type, setType] = useState("Doctor");
    const [feedBack, setFeedBack] = useState('');


    const login = () => {
        const mail = document.getElementById("email")?.value
        const password = document.getElementById("password")?.value

        console.log("mail", mail, "password", password)

        if (type === "Doctor") {
            fetch(`${config.serverUrl}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({mail: mail, password: password})
            }).then(async response => {
                if (!response.ok) {
                    const error = await response.json();
                    console.log('first:', error.message);
                    setFeedBack(error.message);
                    throw new Error('An error occurred while log in.');
                }
                const data = await response.json();
                console.log("token", data)
                localStorage.setItem('token', data.token);
                localStorage.setItem('accountType', data.type);
                window.location.href = '/';

            }).catch(error => {
                console.error(error);
            });
        } else if (type === "Admin") {
            fetch(`${config.serverUrl}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({mail: mail, password: password})
            }).then(async response => {
                if (!response.ok) {
                    const error = await response.json();
                    console.log('first:', error.message);
                    setFeedBack(error.message);
                    throw new Error('An error occurred while log in.');
                }
                const data = await response.json();
                console.log("token", data)
                localStorage.setItem('token', data.token);
                localStorage.setItem('accountType', data.type);
                window.location.href = '/';

            }).catch(error => {
                console.error(error);
            });
        }
    };

    const selectTypeAccount = (type) => {
        setType(type);
    }

    return (
        <div className={"screen"}>
            <Background></Background>

            <div className={"PageGlobal100"}>
                <div className={"menuCenterSmall"}>
                    <div className={"menuCenterSmallTitle"}>
                        <h1 className={"noMargin noPadding"}>Log in</h1>
                        <h5 className={"noMargin noPadding"}>({type})</h5>
                    </div>
                    <div className={"menuCenterSmallInfo"}>
                        <div className={"menuCenterSmallInfoEmail"}>
                            <input type="email" placeholder="Mail" className={"custom-input-login"} id={"email"}
                            />
                        </div>
                        <div className={"menuCenterSmallInfoEmail"}>
                            <input type="password" placeholder="Password" className={"custom-input-login"}
                                   id={"password"}
                            />
                        </div>
                        <div className={"menuCenterSmallFeedback"}>
                            <div>{feedBack}</div>
                        </div>
                        <div className={"menuCenterSmallInfoEmail"}>
                            <button className={"menuCenterSmallSubmitButton"}
                                    onClick={() => login()}>
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"changeLogin"}>
                <div className={"changeLoginIcons"}>
                    <div className={type === "Doctor" ? "changeLoginIconSelected" : "changeLoginIcon"}
                         onClick={() => selectTypeAccount("Doctor")}>
                        <Icon path={mdiDoctor}
                              className={type === "Doctor" ? "iconMenuHeaderPageNoCursor" : "iconMenuHeaderPage"}
                              size={2}/>
                    </div>
                </div>
                <div className={"changeLoginIcons"}>
                    <div className={type === "Admin" ? "changeLoginIconSelected" : "changeLoginIcon"}
                         onClick={() => selectTypeAccount("Admin")}>
                        <Icon path={mdiAccountCogOutline}
                              className={type === "Admin" ? "iconMenuHeaderPageNoCursor" : "iconMenuHeaderPage"}
                              size={2}/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login;
