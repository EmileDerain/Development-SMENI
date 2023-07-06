import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import {setAudios, setStreamAudio} from "../redux/actions/smeniActions";
import ProgressBar from './ProgressBar';
import AudioComponent from "./AudioComponent";
import {
    mdiCog,
    mdiContentSave,
    mdiDoctor,
    mdiExitToApp,
    mdiFolderPlayOutline,
    mdiHomeVariantOutline,
    mdiReload,
    mdiFolderOutline,
    mdiTrashCanOutline,
    mdiChevronDown,
} from "@mdi/js";
import Icon from "@mdi/react";

import './Global.css';
import './Audios.css';
import {Link} from "react-router-dom";


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
        link: '',
    },
    {
        name: "Doctor accounts",
        mdi: mdiDoctor,
        link: '/doctors',
    },
]


const Audios = () => {

    const [orderBy, setOrderBy] = useState(undefined);

    const [filterSelected, setFilterSelected] = useState([]);
    const [requestFilter, setRequestFilter] = useState(false);


    const [labels, setLabels] = useState([]);
    const [showLabels, setShowLabels] = useState(false);

    const [doctors, setDoctors] = useState([]);
    const [showDoctors, setShowDoctors] = useState(false);


    const [audios, setAudios] = useState([]);

    const [path, setPath] = useState(undefined);

    let currentPage = 1;
    let maxPage = 1;
    let sendReq = false;

    let labelsSelected = [];
    let doctorsSelected = [];


    const getAudioFiles = () => {
        const req = 'http://localhost:2834/api/audio/' + currentPage;
        console.log("Req getAudioFiles: ", req)
        fetch(req)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(audioFiles => {
                console.log("audioFiles.audios;", audioFiles.audios);
                // setAudios(audioFiles.audios);
                console.log("ADD -> ", audioFiles.audios.length)
                setAudios(prevItems => prevItems.concat(audioFiles.audios));
                maxPage = audioFiles.audioCount;
                sendReq = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getAudioFiles2 = () => {
        const req = 'http://localhost:2834/api/audio/' + currentPage;
        console.log("Req getAudioFiles: ", req)
        fetch(req)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(audioFiles => {
                setAudios(audioFiles.audios);
                maxPage = audioFiles.audioCount;
                sendReq = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        getAudioFiles2();
    }, []);


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
                console.log("audioLabels", audioLabels.labels)
                setLabels(audioLabels.labels);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const resetCurrentPage = () => {
        maxPage = 1;
    }

    const audioLabelsFilter = () => {
        setRequestFilter(true);
        console.log("requestFilter2", requestFilter)
        setAudios([]);
        getAudioFilesFilter();
    }

    useEffect(() => {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', audios.length)
        if (audios.length === 11) {
            currentPage = 1;
        }
    }, [audios]);

    const getAudioFilesFilter = () => {
        console.log("Req getAudioFilesFilter");
        fetch('http://localhost:2834/api/audio/filter/' + currentPage, {
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
                maxPage = audioFiles.audioCount;
                sendReq = false;
                console.log("requestFilter3", requestFilter)
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getDoctorLabels = () => {
        console.log("Req getDoctorLabels")
        fetch('http://localhost:2834/api/user/labels')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(usersList => {
                console.log("usersList", usersList.users);
                setDoctors(usersList.users);
            })
            .catch(error => {
                console.error(error);
            });
    };


    const calculateTime = (time) => `${(`0${Math.floor(time / 60)}`).slice(-2)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

    const labelList = labels.map((item, index) => {
        return <FolderOrderBy key={index} button={[item.labelName, index]}></FolderOrderBy>;
    });

    const doctorList = doctors.map((item, index) => {
        return <FolderOrderBy key={index} button={[item.labelName, index]}></FolderOrderBy>;
    });

    const filterByOptionList = [
        {
            name: "Label",
            getFunction: getAudioLabels,
            display: showLabels,
            setDisplay: setShowLabels,
            listDisplay: labelList,
        },
        {
            name: "Doctor",
            getFunction: getDoctorLabels,
            display: showDoctors,
            setDisplay: setShowDoctors,
            listDisplay: doctorList,
        },
        // {
        //     name: "Patient",
        // },
    ]

    const folderFilterByList = filterByOptionList.map((item, index) => {
        return <FolderFilterBy key={index} button={item}></FolderFilterBy>;
    });

    function FolderFilterBy(info) {
        console.log("FolderFilterBy");

        const action = () => {
            console.log("action");
            info.button.getFunction();
            info.button.setDisplay(prevState => !prevState)
        }

        return (
            <div
                className={filterSelected === info.button.name ? "iconFolderOrderByDivPageSelected1" : "iconFolderOrderByDivPage1"}>
                <div className={"iconFolderOrderByDivPageInfo"} onClick={action}>
                    <div className={"iconMenuLeftBot"}>
                        <Icon path={mdiChevronDown} className={"iconMenuHeaderPage"} size={2}/>
                    </div>
                    <h1>{info.button.name}</h1>
                </div>
                {info.button.display ? <> {info.button.listDisplay}</>
                    : <></>}
            </div>
        );
    }


    function FolderOrderBy(info) {
        const myElementRef = useRef();

        const handleButtonClick = () => {
            const element = myElementRef.current;
            if (element) {
                if (filterSelected.includes(info.button[0]))
                    setFilterSelected(prevItems => prevItems.filter(item => item !== info.button[0]));
                else
                    setFilterSelected(prevItems => [...prevItems, info.button[0]]);
                setPath(undefined);
            }
        };

        return (
            <div ref={myElementRef}
                 className={filterSelected.includes(info.button[0]) ? "iconFolderOrderByDivPageSelected" : "iconFolderOrderByDivPage"}
                 onClick={handleButtonClick}>
                <div className={"iconMenuLeftBot"}>
                    <Icon path={mdiFolderOutline} className={"iconMenuHeaderPage"} size={2}/>
                </div>
                <h1>{info.button[0]}</h1>
                <div>
                    {/*{labelList}*/}
                </div>
            </div>
        );
    }


    const audioList = audios.map((item, index) => {
        return <Audio key={index} button={item}></Audio>;
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const refAudios = useRef(null);

    window.onload = function () {
        console.log("ON LOAD !! ");
        getAudioFiles2();
        currentPage++;
        refAudios.current.addEventListener('scroll', test);
    }

    // useEffect(() => {
    //     getAudioFiles();
    // }, []);


    const test = () => {
        console.log("useEffect Scoll: ", currentPage, sendReq)
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

            console.log("currentPage", currentPage)
            console.log("maxPage >= currentPage", maxPage >= currentPage)
            console.log(" !sendReq", !sendReq)

            console.log('requestFilter', requestFilter)

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage >= currentPage && !sendReq) {
                sendReq = true;
                console.log('requestFilter', requestFilter)
                if (!requestFilter) {
                    console.log('getAudioFiles')
                    getAudioFiles();
                } else {
                    console.log('getAudioFilesFilter')
                    getAudioFilesFilter();
                }
                currentPage++;
            }
        }
    }


    function Audio(info) {
        const myElementRef = useRef(null);

        const handleButtonClick = () => {
            const element = myElementRef.current;
            console.log("handleButtonClick: ", element)
            if (element) {
                setPath(info.button.path);
            }
        };

        return (
            <div id={info.button.audioName} ref={myElementRef}
                 className={path === info.button.path ? "audioDivPageSelected" : "audioDivPage"}
                 onClick={() => handleButtonClick()}>
                <h1 className={"menuRightTopTitreDate menuRightTopTitreCentre"}>{info.button.date}</h1>
                <h1 className={"menuRightTopTitreName menuRightTopTitreCentre"}>{info.button.audioName}</h1>
                <h1 className={"menuRightTopTitreDoctor menuRightTopTitreCentre"}>{info.button.doctor}</h1>
                <h1 className={"menuRightTopTitreTime menuRightTopTitreCentre"}>{calculateTime(info.button.time)}</h1>
                <div className={"menuRightTopTitreAction menuRightTopTitreCentre"}>
                    <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"} size={1}/>
                </div>
            </div>
        );
    }

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
                    List Health Sounds
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
                        {/*<div className={"menuLeftTop"}>*/}
                        {/*    <div className={"menuLeftTopTitre"}>*/}
                        {/*        <h1>Filter by</h1>*/}
                        {/*    </div>*/}
                        {/*    <ButtonOrderBy button={orderByOptionList[0]}></ButtonOrderBy>*/}
                        {/*    <ButtonOrderBy button={orderByOptionList[1]}></ButtonOrderBy>*/}
                        {/*    /!*<ButtonOrderBy button={orderByOptionList[2]}></ButtonOrderBy>*!/*/}
                        {/*</div>*/}

                        <div className={"menuLeft100"}>
                            <div className={"menuLeftTopTitre"}>
                                <h1>Filter</h1>
                            </div>
                            <div className={"menuLeftTopMenus"}>
                                <div className={"menuLeftTopMenusFilter"}>
                                    {folderFilterByList}
                                </div>
                                <div className={"menuLeftTopMenusResearch"}>
                                    <button className={"menuLeftTopMenusResearchButton"}
                                            onClick={() => {
                                                audioLabelsFilter();
                                                resetCurrentPage();
                                            }}>
                                        Research
                                    </button>
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
                                {audioList}
                                {currentPage < maxPage ?
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
