import React, {useEffect, useRef, useState} from "react";
import {
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiChevronDown,
    mdiChevronUp,
} from "@mdi/js";
import Icon from "@mdi/react";

import '../Global.css';
import '../Audios.css';
import './Filter.css';

const Filter = ({name, urlSearch, typeFilter, filterSelectedSpecific, removeFilterSelected, addFilterSelected}) => {
    const [labels, setLabels] = useState([]);
    const [showLabels, setShowLabels] = useState(false);

    let currentPage = useRef(1);
    let maxPage = useRef(1);
    let sendReq = useRef(false);

    const refInfiniteScroll = useRef(null);
    let filterSave = useRef("");


    const getLabels = () => {
        fetch(`${urlSearch}?page=${currentPage.current}`, {
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
            .then(labelList => {
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
        return <ListLabel key={index}
                          labelName={item.labelName}
                          _id={item._id}
        />;
    });

    function ListLabel({labelName, _id}) {
        const myElementRef = useRef();

        const selectFilter = () => {
            const element = myElementRef.current;
            if (element) {
                if (filterSelectedSpecific.includes(_id)) {
                    removeFilterSelected(typeFilter, _id);
                } else {
                    addFilterSelected(typeFilter, _id);
                }
            }
        };

        return (
            <div ref={myElementRef}
                 className={filterSelectedSpecific.includes(_id) ? "iconFolderOrderByDivPageSelected" : "iconFolderOrderByDivPage"}
                 onClick={selectFilter}>
                <div className={"iconMenuLeftBot"}>
                    {filterSelectedSpecific.includes(_id) ?
                        <Icon path={mdiCheckboxMarked} className={"iconMenuHeaderPage"} size={1}/>
                        :
                        <Icon path={mdiCheckboxBlankOutline} className={"iconMenuHeaderPage"} size={1}/>
                    }
                </div>
                <h1>{labelName}</h1>
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
        if (refInfiniteScroll.current) {

            const {scrollTop, scrollHeight, clientHeight} = refInfiniteScroll.current;
            const totalScrollableDistance = scrollHeight - clientHeight;
            const currentScrollPercentage = (scrollTop / totalScrollableDistance) * 100;
            const currentScrollDistance = totalScrollableDistance - scrollTop

            if ((isNaN(currentScrollPercentage) || currentScrollPercentage === 100 || currentScrollDistance < 40) && maxPage.current >= currentPage.current && !sendReq.current) {
                sendReq.current = true;
                getLabels();
            }
        }
    }

    const showLabel = () => {
        setLabels([]);
        currentPage.current = 1;
        getLabels()
        setShowLabels(prevState => !prevState)
    }

    const getLabelsInput = (filter) => {
        setLabels([]);
        currentPage.current = 1;
        filterSave.current = filter;
        getLabels();
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
