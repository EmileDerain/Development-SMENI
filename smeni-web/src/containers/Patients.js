import React, {useEffect, useRef, useState} from "react";
import {
    mdiMagnify,
    mdiOpenInNew,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useNavigate } from 'react-router-dom';

import './Global.css';
import './Doctors.css';
import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";

const Patient = () => {
    const [patient, setPatient] = useState([]);

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refInfiniteScroll = useRef(null);
    let filterSave = useRef("");


    const getPatients = () => {
        fetch(`http://localhost:2834/api/patient?page=${currentPage.current}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({filter: filterSave.current})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(usersList => {
                console.log("getPatients", usersList.patients);
                setPatient(prevItems => prevItems.concat(usersList.patients));
                currentPage.current++;
                maxPage.current = usersList.count;
                sendReq.current = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    const patientList = patient.map((item, index) => {
        return <Patient key={index}
                        medicalID={item.medicalID}
                        firstName={item.firstName}
                        lastName={item.lastName}
                        id={item._id}
        />;
    });

    function Patient({medicalID, firstName, lastName, id}) {
        const navigate = useNavigate();

        return (
            <div className={"audioDivPage"}>
                <h1 className={"menuRightTopTitreNameDoctors menuRightTopTitreCentre"}>{firstName} {lastName}</h1>
                <h1 className={"menuRightTopTitreEmailDoctors menuRightTopTitreCentre"}>{medicalID}</h1>
                <div className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre"}>
                    <div onClick={() => {
                        navigate(`/patient/${id}`)
                    }}>
                        <Icon path={mdiOpenInNew} className={"iconMenuHeaderPage cursorHoverPointerBlue"}
                              size={1}/>
                    </div>
                </div>
            </div>
        );
    }


    useEffect(() => {
        if (!sendReq.current) {
            sendReq.current = true;
            getPatients();
        }
        if (refInfiniteScroll.current)
            refInfiniteScroll.current.addEventListener('scroll', scroll);
        return () => {
            if (refInfiniteScroll.current)
                refInfiniteScroll.current.removeEventListener('scroll', scroll);
        };
    }, []);

    function scroll() {
        if (refInfiniteScroll.current) {

            const {scrollTop, scrollHeight, clientHeight} = refInfiniteScroll.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage.current >= currentPage.current && !sendReq.current) {
                sendReq.current = true;
                getPatients();
            }
        }
    }

    const getLabelsInput = (filter) => {
        setPatient([]);
        currentPage.current = 1;
        filterSave.current = filter;
        getPatients();
    }

    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"Patient folders"}/>

            <div className={"PageGlobal"}>
                <div className={"PageActionGlobal"}>
                    <div className={"menuRightGlobal"}>

                        <div className={"subMenuGlobalSearch"}>
                            <input type="text" placeholder="Search" className={"custom-input-doctor"} id={"modelName"}
                                   onChange={(event) => getLabelsInput(event.target.value)}
                            >
                            </input>
                            <div className={"subMenuGlobalSearchIcon"}>
                                <Icon path={mdiMagnify} className={"iconMenuHeaderPage"} size={2}/>
                            </div>
                        </div>

                        <div className={"subMenuGlobal"}>
                            <div className={"subMenuGlobalTitre"}>
                                <h1 className={"menuRightTopTitreNameDoctors menuRightTopTitreCentre menuLeftTopTitreBorder"}>Name</h1>
                                <h1 className={"menuRightTopTitreEmailDoctors menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Medical
                                    ID</h1>
                                <h1 className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre menuLeftTopTitreBorder"}>Action</h1>
                            </div>

                            <div ref={refInfiniteScroll} className={"menuRightTopListAudio"}>
                                {patientList}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Patient;
