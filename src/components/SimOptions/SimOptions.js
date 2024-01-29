import * as React from "react"
import "./styles.scss"
import CloseIcon from "../../images/close.svg";

const controls = {
  "forward": ["KeyW", "Move Forward"],
  "backward": ["KeyS", "Move Backward"],
  "left": ["KeyA", "Move Left"],
  "right": ["KeyD", "Move Right"],
  "up": ["KeyE", "Move Up"],
  "down": ["KeyQ", "Move Down"],
  "slow": ["ShiftLeft", "Slow Move"],
  "pause": ["KeyP", "Pause"],
  "computer": ["KeyO", "Toggle Computer"],
  "results": ["KeyR", "Toggle Results"],
  "sens": [0.5, "Look Sensitivity", 0, 1, 0.01],
};

const videoOptions = {
  "quality": [1, "Quality Scale", 0.1, 2, 0.05],
  "shadows": [true, "Shadows"],
  "fullscreen": [false, "Fullscreen"]
};


const allOptions = [controls, videoOptions];
var setFunc = undefined;

export function getOptionValue(name) {
  for (const options of allOptions) {
    if (name in options) {
      return options[name][0];
    }
  }
}

export function setOptionValue(name, value) {
  for (const options of allOptions) {
    if (name in options) {
      options[name][0] = value;
      setFunc(name, value);
      dispatch(name, value);
    }
  }
}

/**
 * Load options from localStorage
 */
export function loadSavedOptions() {
  for (const options of allOptions) {
    for (const name in options) {
      let val = localStorage.getItem("opt-" + name);
      if (val !== null) {
        if (!isNaN(val)) {
          val = parseFloat(val);
        } else if (val === "true") {
          val = true;
        } else if (val === "false") {
          val = false;
        }
        if (getOptionValue(name) !== val) {
          dispatch(name, val);
        }
        options[name][0] = val;
      }
    }

  }
}

export default class SimOptions extends React.Component {
  constructor(props) {
    super(props);

    loadSavedOptions();

    let obj = {};
    for (let n in controls) {
      obj[n] = controls[n][0];
    }
    for (let n in videoOptions) {
      obj[n] = videoOptions[n][0];
    }
    this.state = obj;

    setFunc = (name, value) => {
      let obj = {};
      obj[name] = value;
      this.setState(obj);
    }
  }

  buildOptionRows(opts) {
    const options = [];
    let key = 0;
    for (const name in opts) {
      const option = opts[name];
      let control = "";
  
      if (typeof option[0] === "number") {
        control = (
          <div>
            <Slider 
              min={option[2]} 
              max={option[3]} 
              step={option[4]} 
              value={this.state[name]} 
              onChange={(v) => this.updateNum(opts, name, v)} 
            />
            <input 
              className="opt-num" 
              type="number" 
              min={option[2]} 
              max={option[3]} 
              value={this.state[name]} 
              onChange={(e) => this.updateNum(opts, name, e.target.value)}
            />
          </div>
        );
      } else if (typeof option[0] === "boolean") {
        control = <Switch value={this.state[name]} onChange={(v) => this.updateVal(opts, name, v)} />;
      } else {
        control = <button onClick={(e) => this.changeKey(name, e.target)}>{option[0]}</button>;
      }

      options.push(
        <div className="opt" key={key++}>
          <h3>{option[1]}</h3>
          {control}
        </div>
      );
    }
  
    return options;
  }

  close = (e) => {
    if (e.code === "Escape" && this.change === undefined && this.props.show) {
      this.props.close();
    }
  }

  componentDidUpdate = () => {
    if (this.props.show) {
      window.addEventListener("keydown", this.close);
    } else {
      window.removeEventListener("keydown", this.close);
    }
  }

  updateVal(group, name, v) {
    let obj = {};
    obj[name] = v;
    this.setState(obj);

    group[name][0] = v;
    dispatch(name, v);

    localStorage.setItem("opt-" + name, v);
  }

  handleKey = (e) => {
    if (this.change === undefined) {
      return;
    }
    if (e.code !== "Escape") {
      this.updateVal(controls, this.change[0], e.code);
    }
    this.cancelChange();
  }

  updateNum = (group, name, v) => {
    const opt = group[name];
    if (v < opt[2]) {
      v = opt[2];
    }
    if (v > opt[3]) {
      v = opt[3];
    }
    v = Number(Math.floor(v + "e2") + "e-2");
    this.updateVal(group, name, v);
  }

  changeKey = (name, t) => {
    this.change = [name, t];

    t.innerText = "";
    t.classList.add("change");

    window.addEventListener("mousedown", this.cancelChange);
    window.addEventListener("keydown", this.handleKey);
  }

  cancelChange = () => {
    if (this.change === undefined) {
      return;
    }

    this.change[1].classList.remove("change");
    this.change[1].innerText = controls[this.change[0]][0];

    window.removeEventListener("mousedown", this.cancelChange);
    window.removeEventListener("keydown", this.handleKey);

    this.change = undefined;
  }

  render() {
    return (
      <div id="options" className={"popup" + (this.props.show ? " show" : "")}>
        <h1>Options</h1>
        <div className="options-container custom-scroll">
          <OptionsGroup title="Video Settings">
            {this.buildOptionRows(videoOptions)}
          </OptionsGroup>
          <OptionsGroup title="Controls">
            {this.buildOptionRows(controls)}
          </OptionsGroup>
        </div>
        <button id="close" onClick={this.props.close}><img src={CloseIcon} alt="Close Options" /></button>
      </div>
    );
  }
}

function OptionsGroup(props) {
  return (
  <div className="opt-sec">
    <h2>{props.title}</h2>
    <div className="opts">
      {props.children}
    </div>
  </div>
  );
}

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.min = props.min ?? 0;
    this.max = props.max ?? 100;
    this.step = props.step ?? 1;
  }

  update = (v) => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(v);
    }
  }

  render() {
    return (
      <div className="slider-container">
        <div className="slider-bg">
          <span className="slider-bar" style={{width: (this.props.value - this.min) / (this.max - this.min) * 100 + "%"}}></span>
        </div>
        <input 
          className="slider"
          type="range" 
          min={this.min} 
          max={this.max} 
          step={this.step} 
          value={this.props.value} 
          onChange={(e) => this.update(e.target.value)} 
        />
      </div>
    );
  }
}

function Switch(props) {
  return (
  <label className="switch">
    <input 
      type="checkbox"
      checked={props.value}
      onChange={(e) => props.onChange(e.target.checked)}
    />
    <span className="slider"></span>
  </label>
  );
}

const listeners = [];

export function addOptionChangeListener(listener) {
  listeners.push(listener);
}

function dispatch(n, v) {
  for (let l of listeners) {
    l(n, v);
  }
}