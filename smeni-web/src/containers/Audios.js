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

const orderByOptionList = [
    {
        name: "Label",
    },
    {
        name: "Doctor",
    },
    {
        name: "Patient",
    },
]


const Audios = () => {
    const [orderBy, setOrderBy] = useState(orderByOptionList[0].name);


    const [optionSelected, setOptionSelected] = useState(undefined);
    const [labels, setLabels] = useState([]);


    const [audios, setAudios] = useState([]);
    const [path, setPath] = useState(undefined);

    const getAudioFiles = () => {
        console.log("Req getAudioFiles")
        fetch('http://localhost:2834/api/audio/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(audioFiles => {
                console.log("audioFiles", audioFiles.audios)
                setAudios(audioFiles.audios);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getAudioLabels = () => {
        console.log("Req getAudioLabels")
        fetch('http://localhost:2834/api/cnn/labels')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(audioLabels => {
                console.log("audioLabels", audioLabels.audios)
                setLabels(audioLabels.labels);
                setOptionSelected(audioLabels.labels[0].labelName)
            })
            .catch(error => {
                console.error(error);
            });
    };

    const calculateTime = (time) => `${(`0${Math.floor(time / 60)}`).slice(-2)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

    window.onload = function () {
        const checkboxes = document.querySelectorAll('input[name="option"]');
        checkboxes[0].setAttribute('checked', 'checked');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                checkboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    } else {
                        console.log("orderBy", orderBy)
                        setOrderBy(cb.value);
                        console.log("orderBy", orderBy)
                    }
                });
            });
        });
    }


    const labelList = labels.map((item, index) => {
        return <FolderOrderBy key={index} button={[item.labelName, index]}></FolderOrderBy>;
    });

    function FolderOrderBy(info) {
        const myElementRef = useRef();

        const handleButtonClick = () => {
            console.log("optionSelected", optionSelected)

            const element = myElementRef.current;
            if (element) {
                setOptionSelected(info.button[0])
            }
        };

        return (
            <div ref={myElementRef}
                 className={optionSelected === info.button[0] ? "iconFolderOrderByDivPageSelected" : "iconFolderOrderByDivPage"}
                 onClick={handleButtonClick}>
                <div className={"iconMenuLeftBot"}>
                    <Icon path={mdiFolderOutline} className={"iconMenuHeaderPage"} size={2}/>
                </div>
                <h1>{info.button[0]}</h1>
            </div>
        );
    }


    const audioList = audios.map((item, index) => {
        return <Audio key={index} button={item}></Audio>;
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
                    <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage"} size={1}/>
                </div>
            </div>
        );
    }

    useEffect(() => {
        getAudioFiles();
        getAudioLabels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        <div className={"menuLeftTop"}>
                            <div className={"menuLeftTopTitre"}>
                                <h1>Order by</h1>
                            </div>
                            <ButtonOrderBy button={orderByOptionList[0]}></ButtonOrderBy>
                            <ButtonOrderBy button={orderByOptionList[1]}></ButtonOrderBy>
                            <ButtonOrderBy button={orderByOptionList[2]}></ButtonOrderBy>
                        </div>
                        <div className={"menuLeftBot"}>
                            <div className={"menuLeftTopTitre"}>
                                <h1>{orderBy}</h1>
                            </div>
                            {labelList}
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

                            <div className={"menuRightTopListAudio"}>
                                {audioList}
                            </div>


                        </div>
                        <div className={"menuRightBot"}>
                            <ProgressBar
                                path={path}
                            />
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

function ButtonOrderBy(info) {
    return (
        <div className={"buttonOrderBy"}>
            <input className={"chekboxOrder"} type="checkbox" name="option" value={info.button.name}/>
            <h1>{info.button.name}</h1>
        </div>
    );
}


export default Audios;
