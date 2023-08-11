import React from "react";
import {
    mdiContentSave,
    mdiDoctor,
    mdiFolderPlayOutline,
    mdiHomeVariantOutline,
    mdiReload,
    mdiFolderAccountOutline
} from "@mdi/js";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";

import '../Global.css';
import './HeaderSubMenu.css';

const HeaderSubMenu = ({title}) => {
    const accountType = localStorage.getItem('accountType');
    let menuHeader;

    if (accountType === "admin")
        menuHeader = [
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
                name: "AIs",
                mdi: mdiContentSave,
                link: '/models',
            },
            {
                name: "List Health Sounds",
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
    else
        menuHeader = [
            {
                name: "Home",
                mdi: mdiHomeVariantOutline,
                link: '/',
            },
            {
                name: "List Health Sounds",
                mdi: mdiFolderPlayOutline,
                link: '/audios',
            },
            {
                name: "Patient folders",
                mdi: mdiFolderAccountOutline,
                link: '/patients',
            },
        ]

    function ButtonMenuHeader({link, mdi, selected}) {
        return (
            <>
                {accountType === "doctor" ?
                    <Link className={selected ? "iconMenuHeaderPageDivSelectedDoctor" : "iconMenuHeaderPageDivDoctor"} to={link}>
                        <Icon path={mdi} className={"iconMenuHeaderPage"} size={2}/>
                    </Link>
                    :
                    <Link className={selected ? "iconMenuHeaderPageDivSelected" : "iconMenuHeaderPageDiv"} to={link}>
                        <Icon path={mdi} className={"iconMenuHeaderPage"} size={2}/>
                    </Link>
                }
            </>
        );
    }

    return (
        <div className={"headerPage"}>
            <div className={"titlePage"}>
                {title}
            </div>

            <div className={accountType === "doctor" ? "headerSubMenuDoctor" : "headerSubMenu"}>
                {/*{menuHeader.filter((m) => (m.name !== title)).map((m) => (*/}
                {/*    <ButtonMenuHeader button={m}></ButtonMenuHeader>*/}
                {/*))}*/}
                {menuHeader.map((m, index) => (
                    <ButtonMenuHeader key={index}
                                      link={m.link}
                                      mdi={m.mdi}
                                      selected={m.name === title}
                    />
                ))}
            </div>
        </div>
    );
};


export default HeaderSubMenu;
