import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import {setAudios, setStreamAudio} from "../redux/actions/smeniActions";
import ProgressBar from './ProgressBar';
import AudioComponent from './component/AudioComponent.js'
import {
    mdiContentSave,
    mdiDoctor,
    mdiFolderPlayOutline,
    mdiHomeVariantOutline,
    mdiReload,
    mdiFolderOutline,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiChevronDown,
} from "@mdi/js";
import Icon from "@mdi/react";

import './Global.css';
import './Audios.css';
import {Link} from "react-router-dom";
import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";
import Filter from "./component/Filter";

const Audios = () => {
    console.log("RENDER Audios");

    const [filterSelected, setFilterSelected] = useState({
        label: [],
        doctor: [],
        patient: [],
    });

    const [audios, setAudios] = useState([]);

    const [path, setPath] = useState(undefined);

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refAudios = useRef(null);

    const removeFilter = (type, filterName) => {
        console.log("removeFilter", filterName);

        switch (type) {
            case "label":
                setFilterSelected(prevState => ({
                    ...prevState,
                    label: prevState.label.filter(item => item !== filterName)
                }));
                break;
            case "doctor":
                setFilterSelected(prevState => ({
                    ...prevState,
                    doctor: prevState.doctor.filter(item => item !== filterName)
                }));
                break;
            case "patient":
                setFilterSelected(prevState => ({
                    ...prevState,
                    patient: prevState.patient.filter(item => item !== filterName)
                }));
                break;
            default:
                console.log("filterName doesn't exist: ", filterName);
        }
    }

    const addFilter = (type, filterName) => {
        console.log("addFilter", filterName);
        switch (type) {
            case "label":
                setFilterSelected(prevState => ({
                    ...prevState,
                    label: [...prevState.label, filterName]
                }));
                break;
            case "doctor":
                setFilterSelected(prevState => ({
                    ...prevState,
                    doctor: [...prevState.doctor, filterName]
                }));
                break;
            case "patient":
                setFilterSelected(prevState => ({
                    ...prevState,
                    patient: [...prevState.patient, filterName]
                }));
                break;
            default:
                console.log("filterName doesn't exist: ", filterName);
        }
    }

    useEffect(() => {
        refAudios.current.addEventListener('scroll', test);

        return () => {
            if (refAudios.current)
                refAudios.current.removeEventListener('scroll', test);
        };
    }, []);

    useEffect(() => {
        console.log("ON LOAD !! filterSelected:", filterSelected);
        refAudios.current.addEventListener('scroll', test);

        setFilterSelected(filterSelected);
        currentPage.current = 1;
        setAudios([]);
        setPath(undefined);

        getAudioFilesFilter('auto');

        return () => {
            if (refAudios.current)
                refAudios.current.removeEventListener('scroll', test);
        };
    }, [filterSelected]);

    const getAudioFilesFilter = (info) => {
        console.log("Req getAudioFilesFilter filterSelected", info, filterSelected);
        fetch('http://localhost:2834/api/audio/filter/' + currentPage.current, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({filter: filterSelected, pageNumber: currentPage.current})
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function test() {
        console.log("useEffect Scoll: ", currentPage.current, sendReq.current, filterSelected)
        if (refAudios.current) {

            const {scrollTop, scrollHeight, clientHeight} = refAudios.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop

            console.log("currentScrollPercentage:", currentScrollPercentage);
            console.log("currentScrollPercentage === 100", currentScrollPercentage === 100)
            console.log("currentScrollDistance", currentScrollDistance)
            console.log("currentScrollDistance < 40", currentScrollDistance < 40)
            console.log("isNaN(currentScrollPercentage)", isNaN(currentScrollPercentage))

            console.log("currentPage.current", currentPage.current)
            console.log("maxPage.current >= currentPage.current", maxPage.current >= currentPage.current)
            console.log(" !sendReq.current", !sendReq.current)

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage.current >= currentPage.current && !sendReq.current) {
                sendReq.current = true;
                console.log('getAudioFilesFilter')
                getAudioFilesFilter('scroll');
            }
        }
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
                                    <Filter
                                        name={"Label"}
                                        urlSearch={'http://localhost:2834/api/cnn/labels'}
                                        typeFilter={"label"}
                                        filterSelectedSpecific={filterSelected.label}
                                        removeFilterSelected={removeFilter}
                                        addFilterSelected={addFilter}
                                    />
                                    <Filter
                                        name={"Doctor"}
                                        urlSearch={'http://localhost:2834/api/user/labels'}
                                        typeFilter={"doctor"}
                                        filterSelectedSpecific={filterSelected.doctor}
                                        removeFilterSelected={removeFilter}
                                        addFilterSelected={addFilter}
                                    />
                                    <Filter
                                        name={"Patient"}
                                        urlSearch={'http://localhost:2834/api/patient/labels'}
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

                        <div className={path !== undefined ? "menuRightTop" : "menuRightTopFull"}>
                            <div className={"menuRightTopTitre"}>
                                <h1 className={"menuRightTopTitreDate menuRightTopTitreCentre menuRightTopTitreDateBorder"}>Date</h1>
                                <h1 className={"menuRightTopTitreName menuRightTopTitreCentre menuRightTopTitreBorder"}>Name</h1>
                                <h1 className={"menuRightTopTitreDoctor menuRightTopTitreCentre menuRightTopTitreBorder"}>Doctor</h1>
                                <h1 className={"menuRightTopTitreTime menuRightTopTitreCentre menuRightTopTitreBorder"}>Time</h1>
                                <h1 className={"menuRightTopTitreAction menuRightTopTitreCentre menuRightTopTitreActionBorder"}>Action</h1>
                            </div>
                            <div ref={refAudios} className={"menuRightTopListAudio"}>
                                {audios.map((item, index) => {
                                    return <AudioComponent key={index}
                                                           date={item.date}
                                                           audioName={item.audioName}
                                                           doctor={item.doctor}
                                                           time={item.time}
                                                           path={path}
                                                           setPath={setPath}
                                                           audioPath={item.path}/>;
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

                        {path !== undefined ?
                            <div className={"menuRightBot"}>
                                <ProgressBar
                                    path={path}
                                />
                            </div> :
                            <></>}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Audios;
