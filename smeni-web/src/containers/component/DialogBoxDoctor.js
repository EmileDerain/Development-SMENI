import React, {useEffect, useState} from "react";
import '../Global.css';
import './DialogBoxDoctor.css';

import {mdiWindowClose,} from "@mdi/js";
import Icon from "@mdi/react";
import config from "../../config/config";


const DialogBoxDoctor = ({ask, account, functionUpdate, functionClose}) => {

    console.log("RENRENDER: ", account)

    const [settingOption, setSettingOption] = useState([]);

    const [feedBack, setFeedBack] = useState('');

    useEffect(() => {
        setSettingOption([
            {
                default: "Mail",
                type: "email",
                old: account?.mail,
                url: '/api/user/administration/mail',
                key: "mail",
            },
            {
                default: "New password",
                type: "password",
                old: '',
                url: '/api/user/administration/password',
                key: "password",
            },
        ])
    }, [account]);


    const update = (patchData) => {

        fetch(`${config.serverUrl}${patchData.url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({[patchData.key]: patchData.old, _id: account?._id})
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error('An error occurred while retrieving data.');
                    const error = await response.json();
                    setFeedBack(error);
                }
                return response.json();
            })
            .then(message => {
                console.log(message);
                setFeedBack(message.message);

                if (patchData.key === "mail")
                    functionUpdate(patchData.old);

                return new Promise((resolve) => {
                    setTimeout(() => {
                        setFeedBack("");
                        resolve();
                    }, 5000);
                });

            })
            .catch(error => {
                console.error(error);
            });
    }

    console.log('settingOption', settingOption);


    return (
        <>
            <div className={ask ? "askScreenBack" : "displayNone"}>
            </div>

            <div className={ask ? "askScreen" : "displayNone"}>
                <div className={"askScreenDivBigger"}>

                    <div className={"askScreenDiv100"}>
                        <div className={"askScreenDivClose"}>
                            <div className={"askScreenSubDivClose"}>
                                <Icon path={mdiWindowClose} className={"iconMenuHeaderPage cursorHoverPointerRed"}
                                      onClick={() => functionClose()} size={1}/>
                            </div>
                        </div>

                        {settingOption.map((so, index) => (
                            <div className={"menuSettinEmailDoctor"}>
                                <input type={so.type} placeholder={so.default} id={"email"} value={so.old}
                                       className={"custom-input-setting"}
                                       onChange={(event) => {
                                           const newSettingOption = [...settingOption];
                                           newSettingOption[index] = {
                                               ...newSettingOption[index],
                                               old: event.target.value,
                                           };
                                           setSettingOption(newSettingOption);
                                       }}
                                />
                                <button className={"menuDoctorUpdate"}
                                        onClick={() => update(so)}>
                                    Update
                                </button>
                            </div>
                        ))}

                        <div className={"askScreenFeedback"}>
                            {feedBack}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DialogBoxDoctor;
