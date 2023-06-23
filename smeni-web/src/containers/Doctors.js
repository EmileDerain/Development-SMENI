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
                <h1 className={"menuRightTopTitrePasswordDoctors menuRightTopTitreCentre"}>{info.doctor.password}</h1>
                <div className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre"}>
                    <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage"} size={1}/>
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

            <div className={"headerPage"}>
                <div className={"titlePage"}>
                    Doctors accounts
                </div>
                <div className={"headerMenu"}>
                    <ButtonMenuHeader button={menuHeader[0]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[1]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[2]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[3]}></ButtonMenuHeader>
                    <ButtonMenuHeader button={menuHeader[4]}></ButtonMenuHeader>
                </div>
            </div>

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
