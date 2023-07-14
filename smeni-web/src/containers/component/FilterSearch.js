import React, {useEffect, useRef, useState} from "react";
import {
    mdiChevronDown,
    mdiChevronUp,
} from "@mdi/js";
import Icon from "@mdi/react";

import '../Global.css';
import '../Audios.css';
import './Filter.css';

const FilterSearch = ({name, typeFilter, addFilterSelected}) => {
    console.log("RENDER DoctorFilter");

    const [showLabels, setShowLabels] = useState(false);
    const [valueSearch, setValueSearch] = useState('');

    const showLabel = () => {
        setShowLabels(prevState => !prevState)
    }

    const getLabelsInput = (value) => {
        addFilterSelected(typeFilter, value);
        setValueSearch(value);
        console.log(valueSearch);
    }

    return (
        <>
            <div className={"iconFolderOrderByDivPage1"}>
                <div className={showLabels ? "iconFolderOrderByDivPageInfoOpen" : "iconFolderOrderByDivPageInfo"}
                     onClick={showLabel}>
                    <div className={"iconMenuLeftBot"}>
                        {showLabels ?
                            <Icon path={mdiChevronUp} className={"iconMenuHeaderPage"} size={2}/>
                            :
                            <Icon path={mdiChevronDown} className={"iconMenuHeaderPage"} size={2}/>
                        }
                    </div>
                    <h1>{name}</h1>
                </div>
                {showLabels ?
                    <div className={"iconFolderOrderByDivSearch"}>
                        <input type="text" placeholder="Search" className={"custom-input-filter"} id={"modelName"}
                               value={valueSearch}
                               onChange={(event) => getLabelsInput(event.target.value)}>
                        </input>
                    </div> : <></>
                }
            </div>
        </>
    );
};

export default FilterSearch;
