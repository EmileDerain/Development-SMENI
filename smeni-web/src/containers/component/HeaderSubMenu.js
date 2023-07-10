import React from "react";
import '../Global.css';
import {mdiContentSave, mdiDoctor, mdiFolderPlayOutline, mdiHomeVariantOutline, mdiReload} from "@mdi/js";
import {Link} from "react-router-dom";
import Icon from "@mdi/react";


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
        link: '/audios',
    },
    {
        name: "Doctor accounts",
        mdi: mdiDoctor,
        link: '/doctors',
    },
]


const HeaderSubMenu = ({title}) => {
    return (
        <>
            <div className={"headerPage"}>
                <div className={"titlePage"}>
                    {title}
                </div>
                <div className={"headerMenu"}>
                    <ButtonMenuHeader button={menuHeader[0]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[1]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[2]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[3]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[4]}></ButtonMenuHeader>
                </div>
            </div>

        </>
    );
};

function ButtonMenuHeader(info) {
    return (
        <Link className={"iconMenuHeaderDivPage"} to={info.button.link}>
            <Icon path={info.button.mdi} className={"iconMenuHeaderPage"} size={2}/>
        </Link>
    );
}


export default HeaderSubMenu;
