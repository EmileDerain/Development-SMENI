import React, {useEffect, useRef, useState} from "react";
import {
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiChevronDown,
} from "@mdi/js";
import Icon from "@mdi/react";

import '../Global.css';
import '../Audios.css';
import './Filter.css';

const Filter = ({name, urlSearch, typeFilter, filterSelectedSpecific, removeFilterSelected, addFilterSelected}) => {
    console.log("RENDER DoctorFilter");

    const [labels, setLabels] = useState([]);
    const [showLabels, setShowLabels] = useState(false);

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refInfiniteScroll = useRef(null);

    const getLabels = (filter) => {
        console.log("Req getDoctorLabels: ", filter);
        fetch(urlSearch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({filter: filter, pageNumber: currentPage.current})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(labelList => {
                console.log("usersList", labelList.labels);
                setLabels(prevItems => prevItems.concat(labelList.labels));
                currentPage.current++;
                maxPage.current = labelList.labelCount;
                sendReq.current = false;
            })
            .catch(error => {
                console.error(error);
            });
    };

    const doctorList = labels.map((item, index) => {
        return <ListLabel key={index} button={[item.labelName, index]}></ListLabel>;
    });

    function ListLabel(info) {
        const myElementRef = useRef();
        console.log("filrer filterSelected:", filterSelectedSpecific)

        const selectFilter = () => {
            console.log("filrer2 filterSelected:", filterSelectedSpecific)

            const element = myElementRef.current;
            if (element) {
                if (filterSelectedSpecific.includes(info.button[0])) {
                    removeFilterSelected(typeFilter, info.button[0]);
                    console.log("filterSelectedSpecific supp");
                } else {
                    addFilterSelected(typeFilter, info.button[0]);
                    console.log("filterSelectedSpecific add");
                }
            }
        };

        return (
            <div ref={myElementRef}
                 className={filterSelectedSpecific.includes(info.button[0]) ? "iconFolderOrderByDivPageSelected" : "iconFolderOrderByDivPage"}
                 onClick={selectFilter}>
                <div className={"iconMenuLeftBot"}>
                    {filterSelectedSpecific.includes(info.button[0]) ?
                        <Icon path={mdiCheckboxMarked} className={"iconMenuHeaderPage"} size={1}/>
                        :
                        <Icon path={mdiCheckboxBlankOutline} className={"iconMenuHeaderPage"} size={1}/>
                    }
                </div>
                <h1>{info.button[0]}</h1>
            </div>
        );
    }

    useEffect(() => {
        if (refInfiniteScroll.current)
            refInfiniteScroll.current.addEventListener('scroll', test);
        return () => {
            if (refInfiniteScroll.current)
                refInfiniteScroll.current.removeEventListener('scroll', test);
        };
    }, [showLabels]);

    const test = () => {
        console.log("useEffect Scoll: ", currentPage.current, sendReq.current)
        if (refInfiniteScroll.current) {

            const {scrollTop, scrollHeight, clientHeight} = refInfiniteScroll.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop

            console.log("currentScrollPercentage:", currentScrollPercentage);
            console.log("currentScrollPercentage === 100", currentScrollPercentage === 100)
            console.log("currentScrollDistance", currentScrollDistance)
            console.log("currentScrollDistance < 40", currentScrollDistance < 40)
            console.log("isNaN(currentScrollPercentage)", isNaN(currentScrollPercentage))

            console.log("currentPage.current", currentPage.current)
            console.log("maxPage.current >= currentPage.current", maxPage.current >= currentPage.current)
            console.log(" !sendReq.current", !sendReq.current)

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage.current >= currentPage.current && !sendReq.current) {
                sendReq.current = true;
                console.log('getAudioFilesFilter')
                getLabels();
            }
        }
    }

    const showLabel = () => {
        setLabels([]);
        currentPage.current = 1;
        getLabels('')
        setShowLabels(prevState => !prevState)
    }

    const getLabelsInput = (filter) => {
        setLabels([]);
        currentPage.current = 1;
        getLabels(filter);
    }

    return (
        <>
            <div className={"iconFolderOrderByDivPage1"}>
                <div className={showLabels ? "iconFolderOrderByDivPageInfoOpen" : "iconFolderOrderByDivPageInfo"}
                     onClick={showLabel}>
                    <div className={"iconMenuLeftBot"}>
                        <Icon path={mdiChevronDown} className={"iconMenuHeaderPage"} size={2}/>
                    </div>
                    <h1>{name}</h1>
                </div>
                {showLabels ?
                    <div className={"iconFolderOrderByDivSearch"}>
                        <input type="text" placeholder="Search" className={"custom-input-filter"} id={"modelName"}
                            // value={textSearched}
                               onChange={(event) => getLabelsInput(event.target.value)}>
                        </input>
                    </div> : <></>
                }
            </div>
            {showLabels ?
                <div ref={refInfiniteScroll}
                     className={labels.length > 5 ? "listOptionFilter" : "listOptionFilterSmall"}>
                    {doctorList}
                </div>
                : <></>
            }
        </>
    );
};

export default Filter;
