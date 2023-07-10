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
import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";

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

        if (modelName !== undefined && modelName !== "") {
            setLogs([])
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

            socket.on("end_cnn_logs", () => {
                document.getElementById("modelName").value = "";
            });
        }
    };

    const logList = logs.map((item, index) => {
        return <p key={index} className={"logItem"}>{item}</p>;
    });

    const refLogs = useRef(null);
    const [scrollPercentage, setScrollPercentage] = useState(0);


    useEffect(() => {
        if (refLogs.current) {

            const {scrollTop, scrollHeight, clientHeight} = refLogs.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop
            setScrollPercentage(currentScrollPercentage);

            console.log("scrollPercentage:", scrollPercentage);
            console.log("scrollPercentage === 100", scrollPercentage === 100)
            console.log("currentScrollDistance", currentScrollDistance)
            console.log("isNaN(scrollPercentage)", isNaN(scrollPercentage))

            if (isNaN(scrollPercentage) || scrollPercentage === 100 || currentScrollDistance < 40) {
                console.log("scroll");
                refLogs.current.scrollTop = refLogs.current.scrollHeight;
            }

        }
    }, [logList]);

    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"Reload AI"}/>


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
                                {logList}
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
