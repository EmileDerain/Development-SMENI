import React, {useEffect, useRef, useState} from "react";
import {useParams} from 'react-router-dom';
import {
    mdiGenderFemale,
    mdiGenderMale,
    mdiTrashCanOutline,
} from "@mdi/js";
import Icon from "@mdi/react";

import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";
import DialogBox from "./component/DialogBox";
import ProgressBar from './ProgressBar';
import AudioComponent from './component/AudioComponent.js'
import config from "../config/config";

import './Global.css';
import './Audios.css';
import './PatientDetails.css';


const PatientDetails = () => {
    const {id} = useParams();

    const [audios, setAudios] = useState([]);
    const [patient, setPatient] = useState([]);


    const [selectedAudio, setSelectedAudio] = useState(undefined);

    const [dialogBox, setDialogBox] = useState({
        ask: false,
        whatAsked: undefined,
        type: undefined,
        message: "",
    });

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refAudios = useRef(null);

    useEffect(() => {
        refAudios.current.addEventListener('scroll', scroll);

        return () => {
            if (refAudios.current)
                refAudios.current.removeEventListener('scroll', scroll);
        };
    }, []);

    useEffect(() => {
        refAudios.current.addEventListener('scroll', scroll);

        if (!sendReq.current) {
            sendReq.current = true;
            currentPage.current = 1;
            setAudios([]);
            setSelectedAudio(undefined);
            getAudioFilesFilter();
            getPatientDetails();
        }

        return () => {
            if (refAudios.current)
                refAudios.current.removeEventListener('scroll', scroll);
        };
    }, []);

    const getPatientDetails = () => {
        fetch(`http://localhost:2834/api/patient?id=${id}`, {
            headers: {
                'authorization': localStorage.getItem('token'),
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.log("response.status", response.status)
                    if (response.status === 404) {
                        window.location.href = '/404';
                    } else {
                        throw new Error('Une erreur s\'est produite lors de l\'envoi des données.');
                    }
                }
                return response.json();
            })
            .then(patientData => {
                console.log(patientData);
                setPatient((patientData.patient));
            })
            .catch(error => {
                console.error("errorerrorerror", error);
            });
    };

    const getAudioFilesFilter = () => {
        console.log("Request patient", `http://localhost:2834/api/audio/patient?id=${id}&page=${currentPage.current}`);
        fetch(`http://localhost:2834/api/audio/patient?id=${id}&page=${currentPage.current}`, {
            headers: {
                'authorization': localStorage.getItem('token'),
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de l\'envoi des données.');
                }
                return response.json();
            })
            .then(audioFiles => {
                console.log(audioFiles);
                setAudios(prevItems => prevItems.concat(audioFiles.audios));
                currentPage.current++;
                maxPage.current = audioFiles.audioCount;
                sendReq.current = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    function scroll() {
        if (refAudios.current) {

            const {scrollTop, scrollHeight, clientHeight} = refAudios.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage.current >= currentPage.current && !sendReq.current) {
                sendReq.current = true;
                getAudioFilesFilter();
            }
        }
    }

    const dialogBoxYes = () => {
        switch (dialogBox.type) {
            case "delete": {
                fetch(config.serverUrl + `/api/audio?id=${dialogBox.whatAsked._id}`, {
                    method: 'DELETE',
                    headers: {
                        'authorization': localStorage.getItem('token'),
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('An error occurred while deleting data.');
                        }
                        setAudios(prevState => prevState.filter(audio => audio._id !== dialogBox.whatAsked._id))
                        if (selectedAudio._id === dialogBox.whatAsked._id)
                            setSelectedAudio(undefined);
                        getAudioFilesFilter();
                        resetDialogBox();
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break;
            }
            case "deletePatient": {
                fetch(config.serverUrl + `/api/patient?id=${dialogBox.whatAsked._id}`, {
                    method: 'DELETE',
                    headers: {
                        'authorization': localStorage.getItem('token'),
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('An error occurred while deleting data.');
                        } else {
                            window.location.href = '/patients';

                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break;
            }
            default: {
                break;
            }
        }
    }

    const resetDialogBox = () => {
        setDialogBox(() => ({
            ask: false,
            type: undefined,
            whatAsked: undefined,
            message: "",
        }));
    }

    const dialogBoxNo = () => {
        resetDialogBox();
    }

    const openDialogBox = (action) => {
        switch (action) {
            case "deletePatient": {
                setDialogBox(() => ({
                    ask: true,
                    type: "deletePatient",
                    whatAsked: patient,
                    message: "Are you sure you want to delete this patient folder ?",
                }));
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={`${patient.lastName} ${patient.firstName}`}/>

            <div className={"PageGlobal"}>
                <div className={"PageActionGlobal"}>
                    <div className={"menuLeftSmaller"}>
                        <div className={"menuLeft100"}>
                            <div className={"menuLeftTopTitreRight"}>
                                <div className={"menuLeftTopTitreH1"}>
                                    <h1>Patient information</h1>
                                </div>
                                <div className={"menuLeftTopTitreOption"}>
                                    {/*<div className={"menuLeftTopTitreOption2"}>*/}
                                    {/*    <Icon path={mdiPencil} className={"iconMenuHeaderPage cursorHoverPointerBlue"}*/}
                                    {/*          size={1}/>*/}
                                    {/*</div>*/}
                                    <div className={"menuLeftTopTitreOption2"}>
                                        <Icon path={mdiTrashCanOutline}
                                              className={"iconMenuHeaderPage cursorHoverPointerRed"}
                                              onClick={() => openDialogBox("deletePatient")} size={1}/>
                                    </div>
                                </div>


                            </div>
                            <div className={"menuLeftTopMenus"}>
                                <div className={"menuLeftTopMenusFilter"}>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>Lastname : {patient.lastName}</h1>
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>FirstName : {patient.firstName}</h1>
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>Gender : </h1>
                                        {patient.gender === 1 ?
                                            <Icon path={mdiGenderFemale} className={"iconMenuHeaderPage"} size={1}/>
                                            :
                                            <Icon path={mdiGenderMale} className={"iconMenuHeaderPage"} size={1}/>
                                        }
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>Height : {patient.height} cm</h1>
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>Weight : {patient.weight} kg</h1>
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>BirthDate : {(() => {
                                            const date = new Date(patient.birthDate);
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
                                            const year = date.getFullYear();

                                            return `${day}/${month}/${year}`;
                                        })()}</h1>
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>MedicalID : {patient.medicalID}</h1>
                                    </div>
                                    <div className={"menuLeftTopMenusFilterInformation"}>
                                        <h1>Comorbidities : ***</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={"menuRightSmaller"}>

                        <div className={selectedAudio !== undefined ? "menuRightTop" : "menuRightTopFull"}>
                            <div
                                className={selectedAudio !== undefined ? "menuRightTopTitreFull" : "menuRightTopTitre"}>
                                <h1 className={"menuRightTopTitreDate menuRightTopTitreCentre menuRightTopTitreDateBorder"}>Date</h1>
                                <h1 className={"menuRightTopTitreName menuRightTopTitreCentre menuRightTopTitreBorder"}>Name</h1>
                                <h1 className={"menuRightTopTitreDoctor menuRightTopTitreCentre menuRightTopTitreBorder"}>Label</h1>
                                <h1 className={"menuRightTopTitreTime menuRightTopTitreCentre menuRightTopTitreBorder"}>Time</h1>
                                <h1 className={"menuRightTopTitreAction menuRightTopTitreCentre menuRightTopTitreActionBorder"}>Action</h1>
                            </div>
                            <div ref={refAudios} className={"menuRightTopListAudio"}>
                                {audios.map((item, index) => {
                                    return <AudioComponent key={index}
                                                           audio={item}
                                                           date={item.date}
                                                           audioName={item.audioName}
                                                           label={item.label}
                                                           duration={item.duration}
                                                           selectedAudio={selectedAudio}
                                                           setSelectedAudio={setSelectedAudio}
                                                           setDialogBox={setDialogBox}
                                                           gender={item.gender}
                                                           height={item.height}
                                                           weight={item.weight}
                                                           age={item.age}
                                    />;
                                })}
                                {currentPage.current < maxPage.current ?
                                    <div className={"audioDivPage"}>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                    </div> :
                                    <></>
                                }
                            </div>
                        </div>

                        {selectedAudio !== undefined ?
                            <div className={"menuRightBot"}>
                                <ProgressBar
                                    audio={selectedAudio}
                                />
                            </div> :
                            <></>}

                    </div>
                </div>
            </div>

            <DialogBox
                ask={dialogBox.ask}
                message={dialogBox.message}
                functionYes={dialogBoxYes}
                functionNo={dialogBoxNo}
            />

        </div>
    )
}

export default PatientDetails;
