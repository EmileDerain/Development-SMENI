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
                            age,
                            note,
                            progressbar
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
                    whatAsked: audio,
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
                 className={selectedAudio?._id === audio._id ?
                     progressbar === 1 ? "optionDivPageSelected" : "optionDivPageSelectedFullWave"
                     :
                     selectedAudio !== undefined ?
                         progressbar === 1 ? "optionDivPagFull" : "optionDivPagFullWave"
                         : "audioDivPage"
                 }>
                <h1 className={"menuRightTopTitreDate menuRightTopTitreCentre"}
                    onClick={() => handleButtonClick()}>{(() => {
                    const dateConv = new Date(date);
                    const day = String(dateConv.getDate()).padStart(2, '0');
                    const month = String(dateConv.getMonth() + 1).padStart(2, '0');
                    const year = dateConv.getFullYear();

                    return `${day}/${month}/${year}`;
                })()}</h1>
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
                <>
                    <div className={progressbar !== 1 ? "audioDivPageSelectedInfoFull" : "audioDivPageSelectedInfo"}>
                        <div className={"audioDivPageSelectedInfoSpace"}>
                            <h1 className={"genderInfo"}>Gender: {gender === 1 ?
                                <div className={"subMenuGlobalSearchIcon"}>
                                    <Icon path={mdiGenderFemale} className={"iconMenuHeaderPage"} size={1}/>
                                </div>
                                :
                                <Icon path={mdiGenderMale} className={"iconMenuHeaderPage"} size={1}/>
                            }</h1>
                            <h1>Height: {height} cm</h1>
                            <h1>Weight: {weight} kg</h1>
                            <h1>Age: {age} years old</h1>
                        </div>
                    </div>
                    {note ?
                        <div className={"audioDivPageSelectedNote"}>
                            Note : {note}
                        </div>
                        :
                        <></>
                    }

                </>
                :
                <></>
            }

        </>
    );
};

export default AudioComponent;
