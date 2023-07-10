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

const Filter = ({name, urlSearch, filterSelected, setFilterSelected}) => {
    console.log("RENDER DoctorFilter");

    const [labels, setLabels] = useState([]);
    const [showLabels, setShowLabels] = useState(false);


    const getLabels = (filter) => {
        console.log("Req getDoctorLabels: ", filter);
        fetch(urlSearch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({filter: filter})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur s\'est produite lors de la récupération des données.');
                }
                return response.json();
            })
            .then(labelList => {
                console.log("usersList", labelList.labels);
                setLabels(labelList.labels);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const doctorList = labels.map((item, index) => {
        return <FolderOrderBy key={index} button={[item.labelName, index]}></FolderOrderBy>;
    });

    function FolderOrderBy(info) {
        const myElementRef = useRef();

        const handleButtonClick = () => {
            const element = myElementRef.current;
            if (element) {
                if (filterSelected.includes(info.button[0]))
                    setFilterSelected(prevItems => prevItems.filter(item => item !== info.button[0]));
                else
                    setFilterSelected(prevItems => [...prevItems, info.button[0]]);
            }
        };

        return (
            <div ref={myElementRef}
                 className={filterSelected.includes(info.button[0]) ? "iconFolderOrderByDivPageSelected" : "iconFolderOrderByDivPage"}
                 onClick={handleButtonClick}>
                <div className={"iconMenuLeftBot"}>
                    {filterSelected.includes(info.button[0]) ?
                        <Icon path={mdiCheckboxMarked} className={"iconMenuHeaderPage"} size={1}/>
                        :
                        <Icon path={mdiCheckboxBlankOutline} className={"iconMenuHeaderPage"} size={1}/>
                    }
                </div>
                <h1>{info.button[0]}</h1>
            </div>
        );
    }

    const action = () => {
        getLabels('')
        setShowLabels(prevState => !prevState)
    }

    return (
        <>
            <div className={"iconFolderOrderByDivPage1"}>
                <div className={showLabels ? "iconFolderOrderByDivPageInfoOpen" : "iconFolderOrderByDivPageInfo"}
                     onClick={action}>
                    <div className={"iconMenuLeftBot"}>
                        <Icon path={mdiChevronDown} className={"iconMenuHeaderPage"} size={2}/>
                    </div>
                    <h1>{name}</h1>
                </div>
                {showLabels ?
                    <div className={"iconFolderOrderByDivSearch"}>
                        <input type="text" placeholder="Search" className={"custom-input-filter"} id={"modelName"}
                            // value={textSearched}
                               onChange={(event) => getLabels(event.target.value)}>
                        </input>
                    </div> : <></>
                }
            </div>
            {showLabels ?
                <div className={labels.length > 5 ? "listOptionFilter" : "listOptionFilterSmall"}>
                    {/*<div className={"optionFilter"}>*/}
                    {doctorList}
                    {/*</div>*/}
                </div>
                : <></>
            }
        </>
    );
};

export default Filter;
