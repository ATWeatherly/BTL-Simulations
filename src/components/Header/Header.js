import * as React from "react";
import { Link } from "gatsby"

import Lambda from "../../images/lambda.png";
import HomeIcon from "../../images/home.svg";
import AboutIcon from "../../images/about.svg";
import ContactIcon from "../../images/contact.svg";

import "./styles.scss";

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
      solid: false
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({
      solid: window.scrollY > 100
    });
  }

  expandSidebar = () => {
    if (this.props.side) {
      this.setState({ expand: !this.state.expand });
    }
  }

  render() {
    return (
      <div 
        id="header" 
        className={
          (this.props.side ? "side" : "") + 
          (this.state.expand ? " expand" : "") + 
          (this.state.solid ? " solid" : "")
        }
      >
        <div id="logo">
          <img src={Lambda} />
          <h1>BTL<br />Simulations</h1>
        </div>
        <img src={Lambda} id="logo-small" />

        <ul id="nav">
          <li><Link to="/">{this.props.side && <img src={HomeIcon} />}<span>Home</span></Link></li>
          <li><Link to="/about">{this.props.side && <img src={AboutIcon} />}<span>About</span></Link></li>
          <li><Link to="/contact">{this.props.side && <img src={ContactIcon} />}<span>Contact</span></Link></li>
        </ul>

        {this.props.side &&
          <HamburgerButton cb={this.expandSidebar} />
        }
      </div>
    )
  }
}


function HamburgerButton(props) {
  return (
    <div id="hamburger" onClick={props.cb}>
      <span id="h1" />
      <span id="h2" />
      <span id="h3" />
    </div>
  );
}