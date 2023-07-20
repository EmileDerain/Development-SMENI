import React, {useEffect, useRef, useState} from "react";
import {
    mdiMagnify,
    mdiTrashCanOutline,
    mdiPencil,
} from "@mdi/js";
import Icon from "@mdi/react";

import Background from "./component/Background";
import HeaderSubMenu from "./component/HeaderSubMenu";
import config from "../config/config";

import './Global.css';
import './Doctors.css';

import DialogBoxDoctor from "./component/DialogBoxDoctor";


const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refInfiniteScroll = useRef(null);
    let filterSave = useRef("");

    const [dialogBoxDoctor, setDialogBoxDoctor] = useState({
        ask: false,
        account: undefined,
    });

    const getDoctors = () => {
        fetch(`${config.serverUrl}/api/user?page=${currentPage.current}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({filter: filterSave.current})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('An error occurred while retrieving data.');
                }
                return response.json();
            })
            .then(usersList => {
                console.log("usersList", usersList.labels);
                setDoctors(prevItems => prevItems.concat(usersList.labels));
                currentPage.current++;
                maxPage.current = usersList.count;
                sendReq.current = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    const doctorList = doctors.map((item, index) => {
        return <Doctor key={index} doctor={item}></Doctor>;
    });

    function Doctor(info) {

        const openDialogBox = (action, account) => {
            console.log("tion, accoun", action, account)
            switch (action) {
                case "patch": {
                    setDialogBoxDoctor(() => ({
                        ask: true,
                        account: account,
                    }));
                    break;
                }
                default: {
                    break;
                }
            }
        };


        return (
            <div id={info.doctor._id} className={"doctorDivPage"}>
                <h1 className={"menuRightTopTitreNameDoctors menuRightTopTitreCentre"}>{info.doctor.firstName} {info.doctor.lastName}</h1>
                <h1 className={"menuRightTopTitreEmailDoctors menuRightTopTitreCentre"}>{info.doctor.mail}</h1>
                <div className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre"}>
                    {/*<Icon path={mdiListBoxOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"} size={1}/>*/}
                    <div>
                        <Icon path={mdiPencil} className={"iconMenuHeaderPage cursorHoverPointerBlue"}
                              onClick={() => openDialogBox("patch", info.doctor)} size={1}/>
                    </div>
                    <div>
                        <Icon path={mdiTrashCanOutline} className={"iconMenuHeaderPage cursorHoverPointerRed"}
                              size={1}/>
                    </div>
                </div>
            </div>
        );
    }


    useEffect(() => {
        if (!sendReq.current) {
            sendReq.current = true;
            getDoctors();
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
                getDoctors();
            }
        }
    }

    const getLabelsInput = (filter) => {
        setDoctors([]);
        currentPage.current = 1;
        filterSave.current = filter;
        getDoctors();
    }

    const resetDialogBox = () => {
        setDialogBoxDoctor(() => ({
            ask: false,
            account: undefined,
        }));
    }

    const updateAfterPatch = (mail) => {
        console.log("mail", mail)
        setDoctors(prevItems =>
            prevItems.map(doctor => {
                if (doctor._id === dialogBoxDoctor.account._id) {
                    return { ...doctor, mail: mail };
                } else {
                    return doctor;
                }
            })
        );
    }


    return (
        <div className={"screen"}>
            <Background></Background>
            <HeaderSubMenu
                title={"Doctor accounts"}/>

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
                                <h1 className={"menuRightTopTitreEmailDoctors menuRightTopTitreCentre menuCenterTopTitreDateBorder"}>Email</h1>
                                <h1 className={"menuRightTopTitreActionDoctors menuRightTopTitreCentre menuLeftTopTitreBorder"}>Action</h1>
                            </div>

                            <div ref={refInfiniteScroll} className={"menuRightTopListAudio"}>
                                {doctorList}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <DialogBoxDoctor
                ask={dialogBoxDoctor.ask}
                account={dialogBoxDoctor.account}
                functionUpdate={updateAfterPatch}
                functionClose={resetDialogBox}
            />

        </div>
    )
}

export default Doctors;
