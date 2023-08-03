import React from "react";
import './Global.css';
import './PageNotFound.css';

const PageNotFound = () => {
    return (
        <div className={"screen"}>
            <div className={"PageGlobalBlue"}>
                <h1 className={"PNF"}>404 : Page not found</h1>
                <a href={'/'} className={"Link"}>Go back to menu</a>
            </div>
        </div>
    );
};

export default PageNotFound;
