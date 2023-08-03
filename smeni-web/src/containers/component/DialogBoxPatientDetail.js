import React, {useEffect, useState} from "react";
import {mdiGenderFemale, mdiGenderMale, mdiWindowClose,} from "@mdi/js";
import Icon from "@mdi/react";
import config from "../../config/config";

import '../Global.css';
import './DialogBoxDoctor.css';
import './DialogBoxPatientDetail.css';

const DialogBoxPatientDetail = ({ask, patient, functionUpdate, functionClose}) => {


    const [settingOption, setSettingOption] = useState([]);


    const [feedBack, setFeedBack] = useState('');

    useEffect(() => {
        setSettingOption([
            {
                default: "LastName",
                type: "text",
                old: patient?.lastName,
                key: "lastName",
            },
            {
                default: "FirstName",
                type: "text",
                old: patient?.firstName,
                key: "firstName",
            },
            {
                default: "Gender",
                type: "text",
                old: patient?.gender,
                key: "gender",
            },
            {
                default: "Birth date 'dd/mm/yyyy'",
                type: "text",
                old: (() => {
                    const date = new Date(patient?.birthDate);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                })(),
                key: "birthDate",
            },
            {
                default: "Medical ID",
                type: "text",
                old: patient?.medicalID,
                key: "medicalID",
            },
        ])
    }, [patient]);

    const changeGender = (gender) => {
        setSettingOption(prevItems =>
            prevItems.map(so => {
                if (so.default === "Gender") {
                    return {...so, old: gender};
                } else {
                    return so;
                }
            })
        );
    }


    const update = (patchData) => {
        
        for (let i = 0; i < settingOption.length; i++) {
            if (settingOption[i].old.length === 0) {
                setFeedBack(`${settingOption[i].key} can't be empty`);
                return;
            }
        }

        const regexDate = new RegExp("^(0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/(19|20)\\d{2}$");
        if (!regexDate.test(settingOption[3].old)) {
            console.log("BAD")
            setFeedBack("Invalid date, must be 'dd/mm/yyyy'");
            return;
        }


        const [day, month, year] = settingOption[3].old.split("/");
        const dateObject = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const patientUpdate = Object.assign({}, ...settingOption.map(so => ({[so.key]: so.old})));
        patientUpdate.birthDate = dateObject;


        fetch(`${config.serverUrl}/api/patient`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({patientUpdate, _id: patient?._id})
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
                <div className={"askScreenDivBiggerEdit"}>

                    <div className={"askScreenDiv100"}>
                        <div className={"askScreenDivClose"}>
                            <div className={"askScreenSubDivClose"}>
                                <Icon path={mdiWindowClose} className={"iconMenuHeaderPage cursorHoverPointerRed"}
                                      onClick={() => functionClose()} size={1}/>
                            </div>
                        </div>

                        {settingOption.map((so, index) => (
                            <div className={"menuSettingPatient"}>
                                {so.default !== "Gender" ?
                                    <input type={so.type} placeholder={so.default} id={"email"} value={so.old}
                                           className={"custom-input-setting-doctor"}
                                           onChange={(event) => {
                                               const newSettingOption = [...settingOption];
                                               newSettingOption[index] = {
                                                   ...newSettingOption[index],
                                                   old: event.target.value,
                                               };
                                               setSettingOption(newSettingOption);
                                           }}
                                    />
                                    :
                                    <>
                                        <button className={so.old === 1 ? "iconGenderSelected" : "iconGender"}>
                                            <Icon path={mdiGenderFemale} className={"iconMenuHeaderPage"}
                                                  onClick={() => changeGender(1)} size={2}/>
                                        </button>
                                        <button className={so.old === 2 ? "iconGenderSelected" : "iconGender"}>
                                            <Icon path={mdiGenderMale} className={"iconMenuHeaderPage"}
                                                  onClick={() => changeGender(2)} size={2}/>
                                        </button>
                                    </>
                                }
                            </div>
                        ))}


                        <div className={"askScreenFeedbackPatient"}>
                            {feedBack}
                        </div>

                        <div className={"menuPatientUpdate"}>
                            <button className={"menuPatientUpdateButton"} onClick={update}>
                                Update
                            </button>
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
};

export default DialogBoxPatientDetail;
