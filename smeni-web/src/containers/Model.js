import React from "react";
// ES6 import or TypeScript
import io from "socket.io-client";
import {showReload} from "../redux/actions/smeniActions";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";

import './Global.css';
import './Model.css';

import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiContentSave, mdiDoctor, mdiFolderPlayOutline, mdiHomeVariantOutline, mdiReload} from "@mdi/js";

const menuHeader = [
    {
        name: "Home",
        mdi: mdiHomeVariantOutline,
        link: '/',
    },
    {
        name: "Reload AI",
        mdi: mdiReload,
        link: '',
    }, {
        name: "AI",
        mdi: mdiContentSave,
        link: '/models',
    },
    {
        name: "Health sounds",
        mdi: mdiFolderPlayOutline,
        link: '/audios',
    },
    {
        name: "Doctor accounts",
        mdi: mdiDoctor,
        link: '/doctors',
    },
]

const startTraining = () => {

}


const Model = () => {
    const [logs, setLogs] = useState([]);

    const startTraining = (modelName) => {
        if(modelName !== undefined && modelName !== "") {
            const postData = {name: modelName};

            fetch('http://localhost:2834/api/cnn/train', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Une erreur s\'est produite lors de l\'envoi des données.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });

            console.log('io.connect("http://localhost:2834");')
            const socket = io.connect("http://localhost:2834");

            socket.on("receive_cnn_logs", (data) => {
                setLogs((prevLogs) => [...prevLogs, data]);
            });
        }
    };

    return (
        <div className={"screen"}>
            <div className={"circleArt1"}>
                <div className="circle"></div>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
                <div className="circle5"></div>
                <div className="circle6 "></div>
            </div>

            <div className={"circleArt2"}>
                <div className="circle"></div>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
                <div className="circle5"></div>
                <div className="circle6 "></div>
            </div>

            <div className={"circleArt3"}>
                <div className="circle"></div>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
                <div className="circle5"></div>
                <div className="circle6 "></div>
            </div>

            <div className={"headerPage"}>
                <div className={"titlePage"}>
                    Reload AI
                </div>
                <div className={"headerMenu"}>
                    <ButtonMenuHeader button={menuHeader[0]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[1]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[2]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[3]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[4]}></ButtonMenuHeader>
                </div>
            </div>

            <div className={"PageGlobal"}>
                <div className={"PageActionGlobal"}>
                    <div className={"menuLeft"}>
                        <div className={"menuLeftTopBigger"}>
                            <div className={"menuLeftTopTitre"}>
                                <h1>Options</h1>
                            </div>
                            <div className={"optionDiv"}>
                                <input type="text" placeholder="Model Name" className={"custom-input"} id={"modelName"}>
                                </input>
                            </div>

                        </div>
                        <div className={"menuLeftBotButton"} onClick={() => startTraining(document.getElementById("modelName").value)}>
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
                            <div  className={"menuRightCenterLogs"}>
                                {logs}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ButtonMenuHeader(info) {
    return (
        <Link className={"iconMenuHeaderDivPage"} to={info.button.link}>
            <Icon path={info.button.mdi} className={"iconMenuHeaderPage"} size={2}/>
        </Link>
    );
}

export default Model;
