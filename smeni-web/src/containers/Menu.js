import React from "react";

import {Link} from "react-router-dom";

const menu = [
    {
        name: "Reload model",
        url: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/reload-512.png",
        link: 'model',
    },
    {
        name: "Show models",
        url: "https://cdn-icons-png.flaticon.com/512/1191/1191252.png",
        link: '/models',
    },
    {
        name: "Heath sound",
        url: "https://cdn-icons-png.flaticon.com/512/1792/1792737.png",
        link: '/audios',
    }
]

const Menu = () => {
    return (
        <section className="rtl-section">
            <ButtonMenu button={menu[0]}/>
            <ButtonMenu button={menu[1]}/>
            <ButtonMenu button={menu[2]}/>
        </section>
    )
}

function ButtonMenu(info) {
    return (

        <div className={"buttonMenu"}>
            <Link to={info.button.link}>
                <div>
                    <img src={info.button.url} alt="" className={"iconeMenu"}/>
                    <h1 className={"textMenu"}>{info.button.name}</h1>
                </div>
            </Link>
        </div>

    );
}


export default Menu;
