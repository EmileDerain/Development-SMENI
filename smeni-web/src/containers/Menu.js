import React, {useEffect, useState} from "react";
import Icon from '@mdi/react';
import {
    mdiExitToApp,
    mdiCog,
    mdiReload,
    mdiContentSave,
    mdiFolderPlayOutline,
    mdiDoctor,
    mdiFolderAccountOutline,
    mdiChevronUp,
} from '@mdi/js';
import {Link} from "react-router-dom";

import Background from "./component/Background";

import './Global.css';
import './Menu.css';
import config from "../config/config";


const Menu = ({account}) => {
    const accountType = localStorage.getItem('accountType');

    const [setting, setSetting] = useState(false);
    const [settingOption, setSettingOption] = useState([]);

    const [feedBack, setFeedBack] = useState('');

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("accountType");
        window.location.href = '/login';
    }

    const settingSwitch = () => {
        setSetting((prev) => !prev);
    }

    const menuHeader = [
        {
            name: "Cog",
            mdi: mdiCog,
            function: settingSwitch,
        },
        {
            name: "Exit",
            mdi: mdiExitToApp,
            function: logout,
        },
    ]

    let menu;
    if (accountType === "admin") {
        menu = [
            {
                name: "Reload AI",
                mdi: mdiReload,
                link: '/model',
            },
            {
                name: "AIs",
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
            {
                name: "Patient folders",
                mdi: mdiFolderAccountOutline,
                link: '/patients',
            },
        ]
    } else {
        menu = [
            {
                name: "Health sounds",
                mdi: mdiFolderPlayOutline,
                link: '/audios',
            },
            {
                name: "Patient folders",
                mdi: mdiFolderAccountOutline,
                link: '/patients',
            },
        ]

    }

    useEffect(() => {
        if (accountType === "admin") {
            setSettingOption([
                {
                    default: "Mail",
                    type: "email",
                    old: account.mail,
                    url: '/api/admin/mail',
                    key: "mail",
                },
                {
                    default: "New password",
                    type: "password",
                    old: '',
                    url: '/api/admin/password',
                    key: "password",
                },
            ])
        } else {
            setSettingOption([
                {
                    default: "Mail",
                    type: "email",
                    old: account.mail,
                    url: '/api/user/mail',
                    key: "mail",
                },
                {
                    default: "New password",
                    type: "password",
                    old: '',
                    url: '/api/user/password',
                    key: "password",
                },
            ])
        }
    }, []);

    const update = (patchData) => {
        if (patchData.key === "password") {
            if (patchData.old.length === 0) {
                setFeedBack('Password is required');
                return;
            } else if (patchData.old.length < 8) {
                setFeedBack('Password must be at least 8 characters long');
                return;
            } else if (patchData.old.length > 20) {
                setFeedBack('Password must be at most 20 characters long');
                return;
            } else if (!patchData.old.match(/[a-z]/g)) {
                setFeedBack('Password must contain at least one lowercase letter');
                return;
            } else if (!patchData.old.match(/[A-Z]/g)) {
                setFeedBack('Password must contain at least one uppercase letter');
                return;
            } else if (!patchData.old.match(/[0-9]/g)) {
                setFeedBack('Password must contain at least one number');
                return;
            } else if (!patchData.old.match(/[^a-zA-Z\d]/g)) {
                setFeedBack('Password must contain at least one special character');
                return;
            }
        }else if(patchData.key === "mail"){
            const mailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (patchData.old.length === 0) {
                setFeedBack('Mail is required');
                return;
            } else if (!mailValidator.test(String(patchData.old).toLowerCase())) {
                setFeedBack('Mail is not valid, it should be like : example@xyz.com');
                return;
            }
        }


        fetch(`${config.serverUrl}${patchData.url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({[patchData.key]: patchData.old})
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


    function ButtonMenuHeader(info) {
        return (
            <div className={setting && info.button.name === "Cog" ? "iconMenuHeaderDivSelected" : "iconMenuHeaderDiv"}
                 onClick={() => info.button.function()}>
                <Icon path={info.button.mdi}
                      className={info.button.name === "Exit" ? "cursorHoverPointerRed" : "iconMenuHeader"} size={3}/>
            </div>
        );
    }


    return (
        <div className={"screen"}>
            <Background></Background>

            <div className={"header"}>
                <div className={"title"}>
                    SMENI
                </div>
                <div className={"headerMenu"}>
                    {menuHeader.map((mh, index) => (
                        <ButtonMenuHeader key={index} button={mh}></ButtonMenuHeader>
                    ))}
                </div>
            </div>
            {setting ?
                <div className={"menuGlobalSetting"}>
                    <div className={"menuSetting"}>

                        {settingOption.map((so, index) => (
                            <div className={"menuSettingEmail"}>
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
                                <button className={"menuSettingUpdate"}
                                        onClick={() => update(so)}>
                                    Update
                                </button>
                            </div>
                        ))}

                        <div>{feedBack}</div>
                    </div>

                </div>
                :
                <div className={"menuGlobal"}>
                    <div className={accountType === "doctor" ? "menuDoctor" : "menu"}>
                        {menu.map((m, index) => (
                            <ButtonMenu key={index} button={m}></ButtonMenu>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}


function ButtonMenu(info) {
    return (
        <Link className={"iconMenu"} to={info.button.link}>
            <Icon path={info.button.mdi} size={10}/>
            <h1 className={"iconMenuDesc"}>{info.button.name}</h1>
        </Link>
    );
}

export default Menu;
