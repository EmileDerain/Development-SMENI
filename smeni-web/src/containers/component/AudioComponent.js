import React, {useEffect, useRef, useState} from "react";
import './AudioComponent.css';
import Icon from "@mdi/react";
import {mdiGenderFemale, mdiGenderMale, mdiTrashCanOutline} from "@mdi/js";


const AudioComponent = ({
                            date,
                            audio,
                            audioName,
                            label,
                            duration,
                            selectedAudio,
                            setSelectedAudio,
                            setDialogBox,
                            gender,
                            height,
                            weight,
                            age
                        }) => {
    const myElementRef = useRef(null);

    const handleButtonClick = () => {
        const element = myElementRef.current;
        if (element) {
            setSelectedAudio(audio);
        }
    };

    const openDialogBox = (action) => {
        switch (action) {
            case "delete": {
                setDialogBox(() => ({
                    ask: true,
                    type: "delete",
                    audioAsked: audio,
                    message: "Are you sure you want to delete this audio file ?",
                }));
                break;
            }
            default: {
                break;
            }
        }
    };

    const calculateTime = (time) => `${(`0${Math.floor(time / 60)}`).slice(-2)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

    return (
        <>
            <div id={audioName} ref={myElementRef}
                 className={selectedAudio?._id === audio._id ? "optionDivPageSelected" : selectedAudio !== undefined ? "optionDivPagFull" : "audioDivPage"}>
                <h1 className={"menuRightTopTitreDate menuRightTopTitreCentre"}
                    onClick={() => handleButtonClick()}>{date}</h1>
                <h1 className={"menuRightTopTitreName menuRightTopTitreCentre"}
                    onClick={() => handleButtonClick()}>{audioName}</h1>
                <h1 className={"menuRightTopTitreDoctor menuRightTopTitreCentre"}
                    onClick={() => handleButtonClick()}>{label}</h1>
                <h1 className={"menuRightTopTitreTime menuRightTopTitreCentre"}
                    onClick={() => handleButtonClick()}>{calculateTime(duration)}</h1>
                <div className={"menuRightTopTitreAction menuRightTopTitreCentre noCursor"}>
                    <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"}
                          onClick={() => openDialogBox("delete")} size={1}/>
                </div>
            </div>

            {selectedAudio?._id === audio._id ?
                <div className={"audioDivPageSelectedInfo"}>
                    <div className={"audioDivPageSelectedInfoSpace"}>
                        <h1>Gender: {gender === 1 ?
                            <div className={"subMenuGlobalSearchIcon"}>
                                <Icon path={mdiGenderFemale} className={"iconMenuHeaderPage"} size={1}/>
                            </div>
                            :
                            <Icon path={mdiGenderMale} className={"iconMenuHeaderPage"} size={1}/>
                        }</h1>
                        <h1>Height:{height} cm</h1>
                        <h1>Weight:{weight} kg</h1>
                        <h1>Age:{age} years old</h1>
                    </div>
                </div>
                :
                <></>
            }

        </>
    );
};

export default AudioComponent;
