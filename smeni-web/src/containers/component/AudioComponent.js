import React, {useEffect, useRef, useState} from "react";
import './AudioComponent.css';
import Icon from "@mdi/react";
import {mdiTrashCanOutline} from "@mdi/js";


const AudioComponent = ({date, audioName, doctor, time, path, setPath, audioPath}) => {
    const myElementRef = useRef(null);

    const handleButtonClick = () => {
        const element = myElementRef.current;
        if (element) {
            setPath(audioPath);
        }
    };

    const calculateTime = (time) => `${(`0${Math.floor(time / 60)}`).slice(-2)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

    return (
        <div id={audioName} ref={myElementRef}
            className={path === audioPath ? "audioDivPageSelected" : "audioDivPage"}
             // className={"audioDivPage"}
             onClick={() => handleButtonClick()}>
            <h1 className={"menuRightTopTitreDate menuRightTopTitreCentre"}>{date}</h1>
            <h1 className={"menuRightTopTitreName menuRightTopTitreCentre"}>{audioName}</h1>
            <h1 className={"menuRightTopTitreDoctor menuRightTopTitreCentre"}>{doctor}</h1>
            <h1 className={"menuRightTopTitreTime menuRightTopTitreCentre"}>{calculateTime(time)}</h1>
            <div className={"menuRightTopTitreAction menuRightTopTitreCentre"}>
                <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"} size={1}/>
            </div>
        </div>
    );
};

export default AudioComponent;
