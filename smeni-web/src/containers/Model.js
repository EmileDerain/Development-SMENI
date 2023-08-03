import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import Icon from "@mdi/react";
import {mdiReload} from "@mdi/js";

import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";
import Config from "../config/config"

import './Global.css';
import './Model.css';


const Model = () => {
    const [logs, setLogs] = useState([]);

    const refLogs = useRef(null);
    const [scrollPercentage, setScrollPercentage] = useState(0);

    const startTraining = (modelName) => {

        if (modelName !== undefined && modelName !== "") {
            setLogs([])
            const postData = {name: modelName};

            fetch(`${Config.serverUrl}/api/cnn/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify(postData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('An error occurred while retrieving data.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });

            const socket = io.connect(Config.serverUrl);

            socket.on("receive_cnn_logs", (data) => {
                setLogs((prevLogs) => [...prevLogs, data]);
            });

            socket.on("end_cnn_logs", () => {
                const modelNameInput = document.getElementById("modelName")
                if (modelNameInput !== undefined)
                    modelNameInput.value = "";
            });
        }
    };

    useEffect(() => {
        if (refLogs.current) {

            const {scrollTop, scrollHeight, clientHeight} = refLogs.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop
            setScrollPercentage(currentScrollPercentage);

            if (isNaN(scrollPercentage) || scrollPercentage === 100 || currentScrollDistance < 40) {
                refLogs.current.scrollTop = refLogs.current.scrollHeight;
            }

        }
    }, [logs]);

    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"Reload AI"}/>

            <div className={"PageGlobal"}>
                <div className={"PageActionGlobal"}>
                    <div className={"menuLeft"}>
                        <div className={"menuLeftTopBigger"}>
                            <div className={"menuLeftTopTitreModel"}>
                                <h1>Options</h1>
                            </div>
                            <div className={"optionDiv"}>
                                <input type="text" placeholder="Model Name" className={"custom-input"} id={"modelName"}>
                                </input>
                            </div>
                        </div>

                        <div className={"menuLeftBotButton"}
                             onClick={() => startTraining(document.getElementById("modelName").value)}>
                            <div className={"menuLeftBotButtonDiv"}>
                                <Icon path={mdiReload} className={"iconMenuHeaderPage"} size={2}/>
                            </div>
                        </div>
                    </div>

                    <div className={"menuRight"}>
                        <div className={"menuRightCenter"}>
                            <div className={"menuRightCenterTitre"}>
                                <h1 className={"menuRightTopTitreCentre "}>Logs</h1>
                            </div>

                            <div ref={refLogs} className={"menuRightCenterLogs"}>
                                {logs.map((item, index) => {
                                    return <p key={index} className={"logItem"}>{item}</p>;
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Model;
