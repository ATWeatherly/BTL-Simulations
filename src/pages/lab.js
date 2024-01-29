import React from "react";
import { Link } from "gatsby";
import PrimaryTemplate from "../components/templates/PrimaryTemplate/PrimaryTemplate";
import { getLabData, getLabIdFromUrl, getUrlNameFromLab } from "../utils/LabLoader";

import "../styles/lab.scss";


export default function LabPage(props) {
    const id = getLabIdFromUrl(props.location);
    const name = getUrlNameFromLab(id);
    const labData = getLabData(id);

    let body;
    if (id !== null) {
        body = (
            <PrimaryTemplate id="lab-launch">
                <h1>{labData.name}</h1>
                <div id="link-container">
                    <Link className="link" to={"/sim/" + name}>Start Simulation</Link>
                    <Link className="link" to={"/tutorial/" + name}>Start Tutorial</Link>
                </div>
            </PrimaryTemplate>
        );
    } else {
        body = (
            <PrimaryTemplate>
                <h1>Invalid Lab</h1>
            </PrimaryTemplate>
        )
    }
    
    return body;
}