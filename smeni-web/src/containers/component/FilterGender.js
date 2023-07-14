import React, { useState} from "react";
import {
    mdiGenderFemale,
    mdiGenderMale,
    mdiChevronDown,
    mdiChevronUp,
} from "@mdi/js";
import Icon from "@mdi/react";

import '../Global.css';
import '../Audios.css';
import './Filter.css';
import './FilterGender.css';

const FilterSearch = ({name, typeFilter, addFilterSelected}) => {
    console.log("RENDER DoctorFilter");

    const [showLabels, setShowLabels] = useState(false);
    const [valueSearch, setValueSearch] = useState("");

    const showLabel = () => {
        setShowLabels(prevState => !prevState)
    }

    const getLabelsInput = (value) => {
        if (valueSearch === value)
            value = "";
        addFilterSelected(typeFilter, value);
        setValueSearch(value);
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
                        <button className={valueSearch === 1 ? "iconGenderSelected" : "iconGender"}
                                onClick={() => getLabelsInput(1)}>
                            <Icon path={mdiGenderFemale} className={"iconMenuHeaderPage"} size={2}/>
                        </button>
                        <button className={valueSearch === 2 ? "iconGenderSelected" : "iconGender"}
                                onClick={() => getLabelsInput(2)}>
                            <Icon path={mdiGenderMale} className={"iconMenuHeaderPage"} size={2}/>
                        </button>
                    </div>
                    :
                    <></>
                }
            </div>
        </>
    );
};

export default FilterSearch;
