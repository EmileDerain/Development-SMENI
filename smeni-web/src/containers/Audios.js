import React, {useEffect, useRef, useState} from "react";

import ProgressBar from './ProgressBar';
import AudioComponent from './component/AudioComponent.js'
import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";
import Filter from "./component/Filter";
import DialogBox from "./component/DialogBox";
import FilterSearch from "./component/FilterSearch";
import FilterGender from "./component/FilterGender";
import ProgressBarWaveForm from './ProgressBarWaveForm'
import config from "../config/config";

import './Global.css';
import './Audios.css';

const Audios = () => {
    const [filterSelected, setFilterSelected] = useState({
        age: "",
        weight: "",
        height: "",
        gender: "",
        label: [],
        doctor: [],
        patient: [],
    });

    const [audios, setAudios] = useState([]);
    const [progressbar, setProgressbar] = useState(1);

    const [selectedAudio, setSelectedAudio] = useState(undefined);

    const [dialogBox, setDialogBox] = useState({
        ask: false,
        audioAsked: undefined,
        type: undefined,
        message: "",
    });

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refAudios = useRef(null);

    const removeFilter = (type, filterName) => {
        setFilterSelected(prevState => ({
            ...prevState,
            [type]: prevState[type].filter(item => item !== filterName)
        }));
    }

    const addFilter = (type, filterName) => {
        if (type === "age" || type === "weight" || type === "height" || type === "gender")
            setFilterSelected(prevState => ({
                ...prevState,
                [type]: filterName
            }));
        else
            setFilterSelected(prevState => ({
                ...prevState,
                [type]: [...prevState[type], filterName]
            }));
    }

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
            setFilterSelected(filterSelected);
            currentPage.current = 1;
            setAudios([]);
            setSelectedAudio(undefined);

            getAudioFilesFilter();
        }

        return () => {
            if (refAudios.current)
                refAudios.current.removeEventListener('scroll', scroll);
        };
    }, [filterSelected]);

    const getAudioFilesFilter = () => {
        fetch(`${config.serverUrl}/api/audio/filter/${currentPage.current}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({filter: filterSelected, pageNumber: currentPage.current})
        })
            .then(async response => {
                if (!response.ok) {
                    const error = await response.json();
                    console.log('first:', error.message);
                    throw new Error('An error occurred while retrieving data.');
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
                fetch(`${config.serverUrl}/api/audio?id=${dialogBox.whatAsked._id}`, {
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
                        if (selectedAudio?._id === dialogBox.whatAsked._id)
                            setSelectedAudio(undefined);
                        getAudioFilesFilter();
                        resetDialogBox();
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

    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"List Health Sounds"}/>

            <div className={"PageGlobal"}>
                <div className={"PageActionGlobal"}>
                    <div className={"menuLeft"}>
                        <div className={"menuLeft100"}>
                            <div className={"menuLeftTopTitre"}>
                                <h1>Filter</h1>
                            </div>
                            <div className={"menuLeftTopMenus"}>
                                <div className={"menuLeftTopMenusFilter"}>
                                    <FilterSearch
                                        name={"Age"}
                                        typeFilter={"age"}
                                        addFilterSelected={addFilter}
                                    />
                                    <FilterSearch
                                        name={"Height"}
                                        typeFilter={"height"}
                                        addFilterSelected={addFilter}
                                    />
                                    <FilterSearch
                                        name={"Weight"}
                                        typeFilter={"weight"}
                                        addFilterSelected={addFilter}
                                    />
                                    <FilterGender
                                        name={"Gender"}
                                        typeFilter={"gender"}
                                        addFilterSelected={addFilter}
                                    />
                                    <Filter
                                        name={"Label"}
                                        urlSearch={`${config.serverUrl}/api/cnn/labels`}
                                        typeFilter={"label"}
                                        filterSelectedSpecific={filterSelected.label}
                                        removeFilterSelected={removeFilter}
                                        addFilterSelected={addFilter}
                                    />
                                    <Filter
                                        name={"Doctor"}
                                        urlSearch={`${config.serverUrl}/api/user/labels`}
                                        typeFilter={"doctor"}
                                        filterSelectedSpecific={filterSelected.doctor}
                                        removeFilterSelected={removeFilter}
                                        addFilterSelected={addFilter}
                                    />
                                    <Filter
                                        name={"Patient"}
                                        urlSearch={`${config.serverUrl}/api/patient/labels`}
                                        typeFilter={"patient"}
                                        filterSelectedSpecific={filterSelected.patient}
                                        removeFilterSelected={removeFilter}
                                        addFilterSelected={addFilter}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className={"menuRight"}>

                        <div
                            className={selectedAudio !== undefined ? progressbar === 1 ? "menuRightTopSmall" : "menuRightTop" : "menuRightTopFull"}>
                            <div
                                className={selectedAudio !== undefined ? progressbar === 1 ? "menuRightTopTitreFull" : "menuRightTopTitreFullBig" : "menuRightTopTitre"}>
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
                                                           note={item.note}
                                                           progressbar={progressbar}
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
                            progressbar === 1 ?
                                <div className={"menuRightBot"}>
                                    <ProgressBar
                                        audio={selectedAudio}
                                        setProgressbar={setProgressbar}
                                    />
                                </div>
                                :
                                <div className={"menuRightBotWave"}>
                                    <ProgressBarWaveForm
                                        audio={selectedAudio}
                                        setProgressbar={setProgressbar}
                                    />
                                </div>
                            :
                            <></>
                        }

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

export default Audios;
