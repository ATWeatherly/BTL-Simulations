import React from "react";
import "./styles.scss";

var instance = undefined;

export default function Notifications(props) {
  if (instance === undefined) {
    instance = <NotificationsContainer />
  }
  return instance;
}

export var NotifError = () => {
  console.error("No Notification Instance!");
};

export var NotifInfo = NotifError;

export var NotifPopup = NotifError;

class NotificationsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifs: [],
      popupTitle: "",
      popup: "",
      popupPos: undefined
    }

    this.notifs = [];
    this.key = 0;

    NotifError = this.error;
    NotifInfo = this.info;
    NotifPopup = this.popup;
  }

  removeNotif = (obj) => {
    this.setState({notifs: this.state.notifs.filter(i => {
      return i !== obj.elem;
    })});
    this.notifs.splice(this.notifs.indexOf(obj), 1);
  }

  popup = (message="", title="", position=undefined) => {
    this.setState({
      popup: message,
      popupTitle: title,
      popupPos: position
    });
  } 

  error = (message, dur) => {
    return this.addNotif("error", message, dur);
  }

  info = (message, dur) => {
    return this.addNotif("info", message, dur);
  }

  addNotif = (type, message, dur = 5000) => {
    const obj = {
      type: type,
      msg: message,
      dur: dur
    };
    const elem = <Notif type={type} dur={dur} remove={() => this.removeNotif(obj)} key={this.key++}>{message}</Notif>
    obj.elem = elem;
    
    this.notifs.push(obj);
    this.setState({notifs: [elem, ...this.state.notifs]});
    
    return () => this.removeNotif(obj);
  }

  asyncSetState = async (obj) => {
    return new Promise(resolve => this.setState(obj, resolve));
  }

  render() {
    const style = {};
    const pos = this.state.popupPos;
    if (pos !== undefined) {
      if (pos[0] !== undefined) {
        style[pos[0] < 0 ? "right" : "left"] = pos[0] + "px";
      }
      if (pos[1] !== undefined) {
        style[pos[1] < 0 ? "bottom" : "top"] = pos[1] + "px";
      }
    }
    return (
      <div id="notifications">
        {this.state.notifs}
        {this.state.popup !== "" && 
        <div id="notif-overlay">
          <div id="notif-popup" style={style}>
            {this.state.popupTitle !== "" &&
            <h2>{this.state.popupTitle}</h2>
            }
            {this.state.popup}
          </div>
        </div>
        }
      </div>
    );
  }
}

class Notif extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      state: ""
    }
  }

  componentDidMount = () => {
    if (this.props.dur > 0) {
      setTimeout(() => {
        this.setState({state: " hide"});
        setTimeout(() => {
          this.props.remove();
        }, 1000);
      }, this.props.dur);
    }
  }

  render() {
    return (
      <div className={"notif " + this.props.type + this.state.state}>{this.props.children}</div>
    );
  }
}