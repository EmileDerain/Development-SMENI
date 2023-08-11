import React from "react";
import '../Global.css';
import './DialogBox.css';

import {mdiWindowClose, mdiCheck, mdiClose} from "@mdi/js";
import Icon from "@mdi/react";


const DialogBox = ({ask, message, functionYes, functionNo}) => {
    return (
        <>
            <div className={ask ? "askScreenBack" : "displayNone"}>
            </div>

            <div className={ask ? "askScreen" : "displayNone"}>
                <div className={"askScreenDiv"}>

                    <div className={"askScreenTopDiv"}>
                        <p className={"menuRightTopTitreCentre"}>{message}</p>
                    </div>

                    <div className={"askScreenBotDiv"}>
                        <button className={"askScreenButton askScreenButtonYes"} onClick={functionYes}>
                            <Icon path={mdiCheck} size={2}/>
                        </button>
                        <button className={"askScreenButton askScreenButtonNo"} onClick={functionNo}>
                            <Icon path={mdiClose} size={2}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DialogBox;
