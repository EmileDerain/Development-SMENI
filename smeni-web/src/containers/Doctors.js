import React, {useEffect, useRef, useState} from "react";
import {
    mdiCog,
    mdiContentSave,
    mdiDoctor,
    mdiExitToApp,
    mdiFolderPlayOutline,
    mdiHomeVariantOutline,
    mdiReload,
    mdiFolderOutline,
    mdiTrashCanOutline,
} from "@mdi/js";
import Icon from "@mdi/react";

import './Global.css';
import './Doctors.css';
import {Link} from "react-router-dom";
import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";


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
        link: '',
    },
    {
        name: "Health sounds",
        mdi: mdiFolderPlayOutline,
        link: '/audios',
    },
    {
        name: "Doctor accounts",
        mdi: mdiDoctor,
        link: '',
    },
]

const orderByOptionList = [
    {
        name: "Label",
    },
    {
        name: "Doctor",
    },
    {
        name: "Patient",
    },
]


const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    const getDoctors = () => {
        console.log("Req getAudioLabels")
        fetch('http://localhost:2834/api/user/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(usersList => {
                console.log("usersList", usersList.users)
                setDoctors(usersList.users);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const doctorList = doctors.map((item, index) => {
        return <Doctor key={index} doctor={item}></Doctor>;
    });

    function Doctor(info) {
        return (
            <div id={info.doctor._id} className={ "audioDivPage"}>
                <h1 className={"menuRightTopTitreNameDoctors menuRightTopTitreCentre"}>{info.doctor.firstName} {info.doctor.lastName}</h1>
                <h1 className={"menuRightTopTitreEmailDoctors menuRightTopTitreCentre"}>{info.doctor.mail}</h1>
                <h1 className={"menuRightTopTitrePasswordDoctors menuRightTopTitreCentre"}>****</h1>
                <div className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre"}>
                    <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"} size={1}/>
                </div>
            </div>
        );
    }


    useEffect(() => {
        getDoctors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"Doctors accounts"}/>

            <div className={"PageGlobal"}>
                <div className={"PageActionGlobal"}>
                    <div className={"subMenuGlobal"}>
                        <div className={"subMenuGlobalTitre"}>
                            <h1 className={"menuRightTopTitreNameDoctors menuRightTopTitreCentre menuLeftTopTitreBorder"}>Name</h1>
                            <h1 className={"menuRightTopTitreEmailDoctors menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Email</h1>
                            <h1 className={"menuRightTopTitrePasswordDoctors menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Password</h1>
                            <h1 className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre menuLeftTopTitreBorder"}>Action</h1>
                        </div>

                        <div className={"menuRightTopListAudio"}>
                            {doctorList}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

function ButtonMenuHeader(info) {
    return (
        <Link className={"iconMenuHeaderDivPage"} to={info.button.link}>
            <Icon path={info.button.mdi} className={"iconMenuHeaderPage"} size={2}/>
        </Link>
    );
}

export default Doctors;
