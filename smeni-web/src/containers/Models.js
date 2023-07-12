import React, {useEffect, useRef, useState} from "react";
import './Global.css';
import './Models.css';
import config from "../config/config"

import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";
import ModelsComponent from "./component/ModelsComponent";
import DialogBox from "./component/DialogBox";


const Models = () => {
    const [models, setModels] = useState([]);

    const [modelSelected, setModelSelected] = useState(undefined);

    const [dialogBox, setDialogBox] = useState({
        ask: false,
        modelAsked: undefined,
        type: undefined,
        message: "",
    });

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refScroll = useRef(null);

    const getModels = () => {
        fetch(config.serverUrl + `api/cnn/model?page=${currentPage.current}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('An error occurred while retrieving data.');
                }
                return response.json();
            })
            .then(modelList => {
                setModels(prevItems => prevItems.concat(modelList.models));
                setModelSelected(modelList.selectedModel)

                currentPage.current++;
                maxPage.current = modelList.count;
                sendReq.current = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    const askModelYes = () => {
        switch (dialogBox.type) {
            case "select": {
                fetch(config.serverUrl + 'api/cnn/select', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({_id: dialogBox.modelAsked._id})
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('An error occurred while retrieving data.');
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
                fetch(config.serverUrl + `api/cnn?id=${dialogBox.modelAsked._id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('An error occurred while deleting data.');
                        }
                        setModels(prevState => prevState.filter(model => model._id !== dialogBox.modelAsked._id))
                        getModels();
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
        refScroll.current.addEventListener('scroll', loadData);

        return () => {
            if (refScroll.current)
                refScroll.current.removeEventListener('scroll', loadData);
        };
    }, []);

    function loadData() {
        if (refScroll.current) {
            const {scrollTop, scrollHeight, clientHeight} = refScroll.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage.current >= currentPage.current && !sendReq.current) {
                sendReq.current = true;
                getModels();
            }
        }
    }

    useEffect(() => {
        if (!sendReq.current) {
            sendReq.current = true;
            getModels();
        }
    }, []);

    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"AIs"}/>

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

                        <div ref={refScroll} className={"menuRightTopListAudio"}>
                            {models.map((item, index) => {
                                return <ModelsComponent key={index}
                                                        date={item.date}
                                                        _id={item._id}
                                                        modelName={item.modelName}
                                                        loss={item.loss}
                                                        accuracy={item.accuracy}
                                                        modelSelected={modelSelected}
                                                        setDialogBox={setDialogBox}
                                                        model={item}
                                />;
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <DialogBox
                ask={dialogBox.ask}
                message={dialogBox.message}
                functionYes={askModelYes}
                functionNo={askModelNo}
            />
        </div>
    )
}

export default Models;
