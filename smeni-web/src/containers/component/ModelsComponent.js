import React, {useRef} from "react";
import Icon from "@mdi/react";
import {mdiTrashCanOutline} from "@mdi/js";
import '../Models.css';

const ModelsComponent = ({date, _id, modelName, loss, accuracy, modelSelected, setDialogBox, model}) => {

    const handleButtonClick = (action) => {

        switch (action) {
            case "select": {
                if (_id !== modelSelected._id) {
                    setDialogBox(() => ({
                        ask: true,
                        type: "select",
                        modelAsked: model,
                        message: "Are you sure you want to change the Model ?",
                    }));
                }
                break;
            }
            case "delete": {
                if (_id !== modelSelected._id) {
                    setDialogBox(() => ({
                        ask: true,
                        type: "delete",
                        modelAsked: model,
                        message: "Are you sure you want to delete the Model ?",
                    }));
                }
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <div id={_id} className={modelSelected._id === _id ? "audioDivPageSelected" : "audioDivPage"}>
            {accuracy === undefined ?
                <>
                    <h1 className={"menuRightTopTitre100 menuRightTopTitreCentre"}>{modelName} : Model
                        building</h1>
                </>
                :
                <>
                    <h1 className={"menuRightTopTitreDateModels menuRightTopTitreCentre"}
                        onClick={() => handleButtonClick("select")}>{date}</h1>
                    <h1 className={"menuRightTopTitreNameModels menuRightTopTitreCentre"}
                        onClick={() => handleButtonClick("select")}>{modelName}</h1>
                    <h1 className={"menuRightTopTitreLossModels menuRightTopTitreCentre"}
                        onClick={() => handleButtonClick("select")}>{loss.toFixed(2)} </h1>
                    <h1 className={"menuRightTopTitreAccuracyModels menuRightTopTitreCentre"}
                        onClick={() => handleButtonClick("select")}>{Math.round(accuracy * 10000) / 100} %</h1>
                    <div className={"menuRightTopTitreActionModels menuRightTopTitreCentre noCursor"}>
                        {modelSelected._id !== _id ?
                            <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"}
                                  onClick={() => handleButtonClick("delete")} size={1}/>
                            :
                            <></>
                        }
                    </div>
                </>
            }

        </div>
    );
}


export default ModelsComponent;
