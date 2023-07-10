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

const menuHeader = [
    {
        name: "Home",
        mdi: mdiHomeVariantOutline,
        link: '/',
    },
    {
        name: "Reload AI",
        mdi: mdiReload,
        link: '/model',
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

const Audios = () => {
    console.log("RENDER Audios");

    const [filterSelected, setFilterSelected] = useState([]);

    const [labels, setLabels] = useState([]);
    const [showLabels, setShowLabels] = useState(false);

    const [audios, setAudios] = useState([]);

    const [path, setPath] = useState(undefined);

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refAudios = useRef(null);

    useEffect(() => {
        refAudios.current.addEventListener('scroll', test);
        return () => {
            if (refAudios.current)
                refAudios.current.removeEventListener('scroll', test);
        };
    }, []);

    useEffect(() => {
        console.log("ON LOAD !! filterSelected");
        currentPage.current = 1;
        setAudios([]);
        getAudioFilesFilter();
    }, [filterSelected]);

    const getAudioLabels = () => {
        console.log("Req getAudioLabels");
        fetch('http://localhost:2834/api/cnn/labels')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(audioLabels => {
                setLabels(audioLabels.labels);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getAudioFilesFilter = () => {
        console.log("Req getAudioFilesFilter");
        fetch('http://localhost:2834/api/audio/filter/' + currentPage.current, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterSelected)
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


    const test = () => {
        console.log("useEffect Scoll: ", currentPage.current, sendReq.current)
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
                getAudioFilesFilter();
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
                                        filterSelected={filterSelected}
                                        setFilterSelected={setFilterSelected}
                                    />
                                    <Filter
                                        name={"Doctor"}
                                        urlSearch={'http://localhost:2834/api/user/labels'}
                                        filterSelected={filterSelected}
                                        setFilterSelected={setFilterSelected}
                                    />
                                    <Filter
                                        name={"Patient"}
                                        urlSearch={'http://localhost:2834/api/patient/labels'}
                                        filterSelected={filterSelected}
                                        setFilterSelected={setFilterSelected}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className={"menuRight"}>

                        <div className={"menuRightTop"}>
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

function ButtonMenuHeader(info) {
    return (
        <Link className={"iconMenuHeaderDivPage"} to={info.button.link}>
            <Icon path={info.button.mdi} className={"iconMenuHeaderPage"} size={2}/>
        </Link>
    );
}


export default Audios;
