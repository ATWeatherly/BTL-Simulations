import * as React from "react";

import resultsIcon from '../../images/graph_results.svg';
import { getOptionValue } from "../SimOptions/SimOptions";
import CloseIcon from "../../images/close.svg";
import Graph from "./Graph"

import "./styles.scss";

export class SimResultsButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    window.addEventListener("keydown", (e) => {
      if (e.code === getOptionValue("results")) {
        this.props.toggle();
      }
    });
  }

  render() {
    return (
      <button id="results-button" className={"sidebtn" + (this.props.hide ? " hide" : "")} onClick={this.props.toggle}>
        <img src={resultsIcon} alt="Open results" />
      </button>
    );
  }
}

export class SimResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="results" className={"popup" + (this.props.show ? " show" : "")}>
        <h1>Measurement Results</h1>
        <Graph data={this.props.data}/>
        <button id="close" onClick={this.props.close}><img src={CloseIcon} alt="Close Results" /></button>
      </div>
    );
  }
  
}