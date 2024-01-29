import React from "react";
import "./styles.scss";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "",
      active: false
    }
  }

  componentDidMount = () => {
    this.props.refFunc(this);
  }

  showModal = (msg) => {
    this.setState({ msg: msg, active: true });
  }

  closeModal = () => {
    this.setState({ active: false });
  }

  render() {
    return (
      <div className={"modal-container pad-sides" + (this.state.active ? " active" : "")}>
        <div className="modal-bgclose" onClick={this.closeModal}></div>
        <div className="modal">
          <span className="modal-close" onClick={this.closeModal}>×</span>
          {this.state.msg}
        </div>
      </div>
    );
  }
}