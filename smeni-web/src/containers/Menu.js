import React from "react";
import Icon from '@mdi/react';

import './Global.css';
import './Menu.css';


import {mdiExitToApp, mdiCog, mdiReload, mdiContentSave, mdiFolderPlayOutline, mdiDoctor} from '@mdi/js';
import ReactLogo from './../ressource/Vector.svg';
import {Link} from "react-router-dom";

// import {Link} from "react-router-dom";

const menuHeader = [
    {
        name: "Cog",
        mdi: mdiCog,
        link: '',
    },
    {
        name: "Exit",
        mdi: mdiExitToApp,
        link: '',
    },
]

const menu = [
    {
        name: "Reload AI",
        mdi: mdiReload,
        link: '/model',
    },
    {
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

const Menu = () => {
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

            <div className={"header"}>
                <div className={"title"}>
                    SMENI
                </div>
                <div className={"headerMenu"}>
                    <ButtonMenuHeader button={menuHeader[0]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[1]}></ButtonMenuHeader>
                </div>
            </div>
            <div className={"menuGlobal"}>
                <div className={"menu"}>
                    <ButtonMenu button={menu[0]}></ButtonMenu>
                    <ButtonMenu button={menu[1]}></ButtonMenu>
                    <ButtonMenu button={menu[2]}></ButtonMenu>
                    <ButtonMenu button={menu[3]}></ButtonMenu>
                </div>
            </div>
        </div>
    )
}

function ButtonMenuHeader(info) {
    return (
        <div className={"iconMenuHeaderDiv"}>
            <Icon path={info.button.mdi} className={"iconMenuHeader"} size={3}/>
            {/*<div className={"iconMenuHeaderInv"}></div>*/}
        </div>
    );
}

function ButtonMenu(info) {
    return (
        <Link className={"iconMenu"} to={info.button.link}>
            {/*<div className={"iconMenu"}>*/}
                <Icon path={info.button.mdi} size={10}/>
                <h1 className={"iconMenuDesc"}>{info.button.name}</h1>
            {/*</div>*/}
        </Link>
    );
}

export default Menu;

//
// import React from "react";
//
// import {Link} from "react-router-dom";
//
// const menu = [
//     {
//         name: "Reload model",
//         url: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/reload-512.png",
//         link: 'model',
//     },
//     {
//         name: "Show models",
//         url: "https://cdn-icons-png.flaticon.com/512/1191/1191252.png",
//         link: '/models',
//     },
//     {
//         name: "Heath sound",
//         url: "https://cdn-icons-png.flaticon.com/512/1792/1792737.png",
//         link: '/audios',
//     }
// ]
//
// const Menu = () => {
//     return (
//         <>
//
//             <section className="rtl-section">
//                 <ButtonMenu button={menu[0]}/>
//                 <ButtonMenu button={menu[1]}/>
//                 <ButtonMenu button={menu[2]}/>
//             </section>
//         </>
//     )
// }
//
// function ButtonMenu(info) {
//     return (
//
//         <div className={"buttonMenu"}>
//             <Link to={info.button.link}>
//                 <div>
//                     <img src={info.button.url} alt="" className={"iconeMenu"}/>
//                     <h1 className={"textMenu"}>{info.button.name}</h1>
//                 </div>
//             </Link>
//         </div>
//
//     );
// }
//
//
// export default Menu;
