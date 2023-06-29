import React from "react";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiContentSave,
    mdiDoctor,
    mdiFolderPlayOutline,
    mdiHomeVariantOutline,
    mdiReload,
    mdiTrashCanOutline
} from "@mdi/js";
import {useEffect, useRef, useState} from "react";
import './Global.css';
import './Models.css';


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
        link: '',
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


const Models = () => {

    const [models, setModels] = useState([]);

    const [modelSelected, setModelSelected] = useState(undefined);
    const [dialogBox, setDialogBox] = useState({
        ask: false,
        modelAsked: undefined,
        type: undefined,
        message: "",
    });

    const [modelAsked, setModelAsked] = useState(undefined);


    const getModels = () => {
        console.log("Req getAudioLabels")
        fetch('http://localhost:2834/api/cnn/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(modelList => {
                console.log("usersList", modelList.models)
                setModels(modelList.models);
                setModelSelected(modelList.selectedModel)
            })
            .catch(error => {
                console.error(error);
            });
    };

    const modelList = models.map((item, index) => {
        return <ModelInfo key={index} model={item}></ModelInfo>;
    });

    function ModelInfo(info) {
        const myElementRef = useRef(null);

        const handleButtonClick = (action) => {
            const element = myElementRef.current;
            console.log("handleButtonClick: ", element, action)
            switch (action) {
                case "select": {
                    console.log("selectselect")
                    if (element && info.model._id !== modelSelected._id) {
                        setDialogBox(() => ({
                            ask: true,
                            type: "select",
                            modelAsked: info.model,
                            message: "Are you sure you want to change the Model ?",
                        }));
                    }
                    break;
                }
                case "delete": {
                    console.log("deletedelete")
                    if (element && info.model._id !== modelSelected._id) {
                        setDialogBox(() => ({
                            ask: true,
                            type: "delete",
                            modelAsked: info.model,
                            message: "Are you sure you want to delete the Model ?",
                        }));
                    }
                    break;
                }
                default: {
                    console.log("BREAk");
                    break;
                }
            }


        };


        return (
            <div id={info.model._id} ref={myElementRef}
                 className={modelSelected._id === info.model._id ? "audioDivPageSelected" : "audioDivPage"}>
                {info.model.accuracy === undefined ?
                    <>
                        <h1 className={"menuRightTopTitre100 menuRightTopTitreCentre"}>{info.model.modelName} : Model
                            building</h1>
                    </>
                    :
                    <>
                        <h1 className={"menuRightTopTitreDateModels menuRightTopTitreCentre"}
                            onClick={() => handleButtonClick("select")}>{info.model.date}</h1>
                        <h1 className={"menuRightTopTitreNameModels menuRightTopTitreCentre"}
                            onClick={() => handleButtonClick("select")}>{info.model.modelName}</h1>
                        <h1 className={"menuRightTopTitreLossModels menuRightTopTitreCentre"}
                            onClick={() => handleButtonClick("select")}>{info.model.loss.toFixed(2)} </h1>
                        <h1 className={"menuRightTopTitreAccuracyModels menuRightTopTitreCentre"}
                            onClick={() => handleButtonClick("select")}>{Math.round(info.model.accuracy * 10000) / 100} %</h1>
                        <div className={"menuRightTopTitreActionModels menuRightTopTitreCentre noCursor"}>
                            <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"}
                                  onClick={() => handleButtonClick("delete")} size={1}/>
                        </div>
                    </>
                }

            </div>
        );
    }

    const askModelYes = () => {
        console.log("Req askModelYes", dialogBox.type);

        switch (dialogBox.type) {
            case "select": {
                const postData = {_id: dialogBox.modelAsked};

                fetch('http://localhost:2834/api/cnn/select', {
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
                    .then(() => {
                        setModelSelected(dialogBox.modelAsked);
                        setDialogBox(() => ({
                            ask: false,
                            type: undefined,
                            modelAsked: undefined,
                            message: "",
                        }));
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break;
            }
            case "delete": {
                console.log("DELETE !");
                fetch('http://localhost:2834/api/cnn/' + dialogBox.modelAsked._id, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Une erreur s\'est produite lors de la suppression des données.');
                        }
                        console.log("response.ok")
                        getModels();
                        console.log("response.ok getModels")

                        setDialogBox(() => ({
                            ask: false,
                            type: undefined,
                            modelAsked: undefined,
                            message: "",
                        }));
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break;
            }
            default: {
                console.log("BREAk 2");
                break;
            }
        }


    }

    const askModelNo = () => {
        setDialogBox(() => ({
            ask: false,
            type: undefined,
            modelAsked: undefined,
            message: "",
        }));
    }


    useEffect(() => {
        getModels();
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
                    AIs
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
                    <div className={"subMenuGlobal"}>
                        <div className={"subMenuGlobalTitre"}>
                            <h1 className={"menuRightTopTitreDateModels menuRightTopTitreCentre menuLeftTopTitreBorder"}>Date</h1>
                            <h1 className={"menuRightTopTitreNameModels menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Name</h1>
                            <h1 className={"menuRightTopTitreLossModels menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Loss</h1>
                            <h1 className={"menuRightTopTitreAccuracyModels menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Accuracy</h1>
                            <h1 className={"menuRightTopTitreActionModels menuRightTopTitreCentre menuLeftTopTitreBorder"}>Action</h1>
                        </div>

                        <div className={"menuRightTopListAudio"}>
                            {modelList}
                        </div>


                    </div>
                </div>
            </div>

            <div className={dialogBox.ask ? "askScreenBack" : "displayNone"}>
            </div>

            <div className={dialogBox.ask ? "askScreen" : "displayNone"}>
                <div className={"askScreenDiv"}>
                    <div className={"askScreenTopDiv"}>
                        <p className={"menuRightTopTitreCentre"}>{dialogBox.message}</p>
                    </div>

                    <div className={"askScreenBotDiv"}>
                        <button className={"askScreenButton"} onClick={askModelYes}>yes</button>
                        <button className={"askScreenButton"} onClick={askModelNo}>no</button>
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

export default Models;
