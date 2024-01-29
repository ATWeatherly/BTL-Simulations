import * as React from "react";

import pcOn from "../../images/pcOn.svg";
import collapseR from "../../images/collapseRight.svg";
import { getOptionValue } from "../SimOptions/SimOptions";

import "./styles.scss";

export default class Computer extends React.Component {
  constructor(props) {
    super(props);

    this.tab1 = React.createRef();

    this.state = {
      on: false,
      image: pcOn,
      tab: -1,
      ulWidth: 0,
      ulLeft: 0,
    }

    for (const name in this.props.data.fields) {
      this.state[name] = undefined;
    }
  }

  componentDidMount = () => {
    window.addEventListener("keydown", (e) => {
      if (e.code === getOptionValue("computer")) {
        this.toggleComputer();
      }
    });
  }

  toggleComputer = () => {
    if (!this.state.on) { // if PC off
      if (this.props.handler.dispatch("on") === false) {
        return;
      }
      this.setState({
        on: true,
        image: pcOn
      });

      this.changeTab(0, this.tab1.current);
    } else {
      if (!this.props.open) { // PC on, hide box and display options menu
        if (this.props.handler.dispatch("open") === false) {
          return;
        }
        this.props.toggle(true);
        this.setState({
          image: collapseR
        });
      } else { // PC on and options menu is displayed, need to set up functionality for minimizing options menu
        if (this.props.handler.dispatch("close") === false) {
          return;
        }
        this.props.toggle(false);
        this.setState({
          image: pcOn
        });
      }
    }
  }

  changeTab = (id, elem) => {
    if (this.state.tab === id) {
      return;
    }
    
    this.setState({
      tab: id,
      ulWidth: elem.clientWidth,
      ulLeft: elem.offsetLeft
    });
  }

  changeState = (name, value) => {
    this.props.data.parameters.state[name] = value;
    this.setState({name: value});
    this.props.handler.dispatch("state", {name: name, value: value});
  }

  buildTabButtons = (tabs) => {
    const btns = [];
    for (let i = 0; i < tabs.length; i++) {
      const ref = i === 0 ? this.tab1 : undefined;
      btns.push(
        <button className={"header-buttons" + (this.state.tab === i ? " active" : "")} onClick={(e) => this.changeTab(i, e.target)} ref={ref} key={i}>{tabs[i]}</button>
      );
    }

    return btns;
  }

  render() {
    let elems = [];
    let key = 0;
    const tabs = [];

    if ("parameters" in this.props.data) {
      tabs.push("Parameters");
      const params = this.props.data.parameters;
      let fields = [];
      let fkey = 0;

      for (const name in params.fields) {
        const field = params.fields[name];

        let elem;
        switch (field.type) {
          case "select":
            let options = [];
            for (let i = 0; i < field.values.length; i++) {
              options.push(<option value={i} key={i}>{field.values[i]}</option>);
            }
            elem = (
              <select className="math" value={this.state[name]} onChange={(e) => this.changeState(name, e.target.value)}>
                {options}
              </select>
            );
            break;
          case "static":
            elem = <p className="static">{field.content}</p>;
            break;
          default:
            elem = "";
            break;
        }
        fields.push(
          <div className="field" key={fkey++}>
            <h2>{field.name}</h2>
            {elem}
          </div>
        );
      }

      elems.push(
        <div className={"tab-content" + (this.state.tab === key ? " show" : "")} key={key++}>
          <h1>Instrument Parameters</h1>
          <div className="fields custom-scroll">
            {fields}
          </div>
        </div>
      );
    }

    if ("controls" in this.props.data) {
      tabs.push("Controls");
      const controls = this.props.data.controls;
      let buttons = [];
      let bkey = 0;

      for (const btnData of controls) {
        buttons.push(
          <button onClick={btnData.cb} key={bkey++}>
            <img src={btnData.icon} />
            {btnData.content}
          </button>
        );
      }

      elems.push(
        <div className={"tab-content" + (this.state.tab === key ? " show" : "")} style={{overflowY: "hidden"}} key={key++}>
          <h1>Instrument Controls</h1>
          <div className="buttons custom-scroll">
            {buttons}
          </div>
        </div>
      );
    }

    if ("protocol" in this.props.data) {
      tabs.push("Protocol");
      const protocol = this.props.data.protocol;

      elems.push(
        <div className={"tab-content" + (this.state.tab === key ? " show" : "")} key={key++}>
          <h1>Protocol</h1>
          <div className="protocol custom-scroll">
            {protocol}
          </div>
        </div> 
      );
    }

    let openOn = (!this.props.open ? "" : "open") + (this.state.on ? " on" : "");

    const btns = this.buildTabButtons(tabs);

    return (
      <div>
        <button id="pc-button" className={"sidebtn" + (this.props.open ? " open" : "")} onClick={this.toggleComputer}>
          <img id="pc-img" className={openOn} src={this.state.image} alt="Open Computer" />
        </button>
        <div id="controls-panel" className={this.props.open ? "open" : ""}>
          <div id="panel-header">
            {btns}
            <span id="underline" style={{width: this.state.ulWidth, transform: `translateX(${this.state.ulLeft}px)`}}></span>
          </div>
          {elems}
        </div>
      </div>
    );
  }
}