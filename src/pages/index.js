import * as React from "react"
import PrimaryTemplate from "../components/templates/PrimaryTemplate/PrimaryTemplate"
import { getLabData, getLabIcon, getUrlNameFromLab, getLabCategories } from "../utils/LabLoader"
import DefaultLabIcon from "../images/defaultLabIcon.png"
import "../styles/index.scss"
import { Link } from "gatsby"

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDesc: false,
      selLabId: "",
      img: null,
      data: {},
      selApp: null,
      top: 75
    }
  }
  
  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let y = window.scrollY;
    if (window.innerHeight > 600) {
      this.setState({
        top: (y > 140 ? y - 140 : 0) + 75
      });
    } 
  }

  selectApp = (id, data, icon, app) => {
    this.state.selApp?.setState({selected: false});

    let closeApp = app === this.state.selApp;
    this.setState({
      showDesc: !closeApp,
      selLabId: id,
      img: icon,
      data: data,
      selApp: (closeApp ? null : app),
    });
  }

  render() {
    const labApps = [];
    const categories = getLabCategories();
    for (let category in categories) {
      let apps = [];
      for (let id of categories[category]) {
        apps.push(<LabApp key={id} labId={id} selectFunc={this.selectApp} />)
      }
      labApps.push([
        <h2 className="category-title" key="title">{category}</h2>,
        <div className="apps-category" key="cont">
          {apps}
        </div>
      ]);
    }
  
    let url = (this.state.data.tutorial ? "/tutorial/" : "/sim/") + getUrlNameFromLab(this.state.selLabId);
    let startButton = <Link id="start-lab" to={url}>Start</Link>;

    if (this.state.data.external) {
      startButton = <a id="start-lab" href={this.state.data.url} target="_blank" rel="noopener noreferrer">Start</a>;
    }

    return (
      <PrimaryTemplate id="labs">
        <h1 id="lab-title">Browse Simulations</h1>
        <div id="apps-wrapper">
          <div id="apps-container">
            {labApps}
          </div>
          <div id="app-details" className={"fill-width pad-sides" + (this.state.showDesc ? " show" : "")} style={{marginTop: this.state.top + "px"}}>
            <div id="app-title" style={{backgroundImage: `url(${this.state.img})`}}>
              <h2>{this.state.data.name}</h2>
            </div>
            <p id="app-desc">{this.state.data.desc}</p>
            {startButton}
          </div>
        </div>
      </PrimaryTemplate>
    );
  }
}

class LabApp extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.labId;
    this.data = getLabData(this.id);

    try {
      this.icon = getLabIcon(props.labId, this.data.icon);
    } catch(e) {
      this.icon = DefaultLabIcon;
    }

    this.state = {
      selected: false
    }

  }

  select = () => {
    if (this.data.wip) {
      return;
    }
    this.setState({selected: true});
    this.props.selectFunc(this.id, this.data, this.icon, this);
  }

  render() {
    return (
      <div className={"lab-app" + (this.state.selected ? " selected" : "") + (this.data.wip ? " wip" : "")} onClick={this.select}>
        <div className="lab-icon" style={{backgroundImage: "url(" + this.icon + ")"}}></div>
        <h2 className="lab-title">{this.data.name}</h2>
        {this.data.wip &&
          <span className="wiptag">Coming Soon!</span>
        }
      </div>
    );
  }
}

export function Head() {
  return <title>Home Page</title>;
}