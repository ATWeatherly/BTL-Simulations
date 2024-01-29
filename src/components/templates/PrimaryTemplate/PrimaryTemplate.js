import * as React from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";


import Blob1 from "../../../images/blob1.svg";
import Blob2 from "../../../images/blob2.svg";

import "../../../styles/main.scss";
import "./styles.scss";

export default class PrimaryTemplate extends React.Component {
  render() {
    return (
      <div id="wrapper" className={(this.props.noFooter ? "no-footer" : "") + (this.props.side ? " side" : "")}>
        <Header side={this.props.side} />
        <main id={this.props.id ?? ""} className={this.props.className ?? ""}>
          {!this.props.nobg && [
            <img src={Blob1} id="blob1" />,
            <img src={Blob2} id="blob2" />
          ]}
          {this.props.children} 
        </main>
        <Footer />
      </div>
    )
  }
}