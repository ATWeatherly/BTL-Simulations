import * as React from "react"
import * as t from 'three';

import PrimaryTemplate from "../components/templates/PrimaryTemplate/PrimaryTemplate"
import Computer from "../components/Computer/Computer";
import { SimResultsButton, SimResults } from "../components/SimResults/SimResults"
import { getLabData, getLabIdFromUrl, getSimData } from "../utils/LabLoader";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { addOptionChangeListener, getOptionValue, setOptionValue } from "../components/SimOptions/SimOptions";
import Notifications from "../components/Notifications/Notifications";

import buildInteractionHandler from "../models/interactions/factory";
import SimOptions from "../components/SimOptions/SimOptions";
import InteractionHandler from "../models/interactions/handlers/InteractionHandler";

import "../styles/sim.scss";


export default class SimPage extends React.Component {
  constructor(props) {
    super(props);

    this.labId = getLabIdFromUrl(props.location);
    this.labData = getLabData(this.labId);

    this.state = {
      loading: "",
      app: "",
    }
  }

  componentDidMount() {
    window.onbeforeunload = function(){
      return 'Are you sure you want to leave?';
    };
    if (this.labId !== null) {
      setTimeout(() => {
        this.setState({app: <LabScene id={this.labId} key="scene" onLoad={this.load} />});
      }, 20);
    }
    
    // loadSavedOptions();
  }

  load = () => {
    this.setState({loading: "hide"});
    setTimeout(() => {
      this.setState({loading: "done"});
    }, 500);
  }

  render() {
    if (this.labId !== null && !this.labData?.tutorial) {
      return (
        <div id="sim">
          <div id="loading" className={this.state.loading} key="load">
            <h1>Loading Lab...</h1>
            <div className="spinner"></div>
          </div>
          {this.state.app}
        </div>
      );
    } else {
      return (
        <PrimaryTemplate>
          <div>
            Invalid Lab {this.labId}
          </div>
        </PrimaryTemplate>
      );
    }
  }
}

export function Head() {
  return <title>Simulation</title>;
}

/**
 * Component for the entire simulation
 */
class LabScene extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.id;
    this.canvas = React.createRef();
    this.data = getSimData(this.id);

    // TODO: clean up state, should only have variables that modify the render.
    this.state = {
      loading: true,
      paused: false,
      lastPause: 0,
      overlay: false,
      pauseMenu: false,
      showOpts: false,
      computerOpen: false,
      showResults: false,
      resultsData: [],
    }
    this.quiet = false;

    if ("computer" in this.data.interactions) {
      this.computerHandler = new InteractionHandler();
      for (const event in this.data.interactions.computer) {
        this.computerHandler.addEventListener(event, this.data.interactions.computer[event]);
      }
    }
  }

  togglePauseMenu = (status) => {
    if (this.quiet) {
      this.quiet = false;
      this.setState({
        paused: status,
        lastPause: performance.now()
      });
      return;
    }
    this.setState({
      paused: status,
      overlay: status,
      pauseMenu: status && !this.state.pauseMenu,
      lastPause: performance.now()
    });
  }

  pause = (quiet=false) => {
    if (this.state.paused) {
      if (performance.now() - this.state.lastPause > 1250) {
        this.controls.lock();
        this.setState({
          showOpts: false,
          showResults: false,
        })
        this.quiet = quiet === true ? true : false;
        return true;
      }
    } else {
      this.quiet = quiet === true ? true : false;
      this.controls.unlock();
      return true;
    }
    return false;
  }

  toggleOpts = (status) => {
    this.setState({
      pauseMenu: !status,
      showOpts: status
    });

  }

  toggleComputer = (status) => {
    if (status && !this.state.paused) {
      this.pause();
    }
    this.setState({
      computerOpen: status
    });
  }

  toggleResults = (status) => {
    if (this.data.results?.() === false) {
      return;
    }
    this.setState({
      pauseMenu: this.data.computer.parameters.state.response
    });
    if (status && this.state.showOpts) {
      this.setState({
        showOpts: false,
      });
    }
    if (status && !this.state.paused) {
      this.pause();
      this.setState({
        pauseMenu: true,
        showResults: true
      });
    } else {
      this.setState({
        pauseMenu: !status,
        showResults: status
      });
    }
  }

  addResultsData = (data) => {
    if(data !== undefined){
      this.setState({
        resultsData: [...this.state.resultsData, data]
      });
    }
  }

  /**
   * Initialize 3D environment & simulation
   */
  componentDidMount = async () => {
    /**
     * Set up scene components
     */
    const scope = this;
    const canvas = this.canvas.current;
    const scene = new t.Scene();
    const cam = new t.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new t.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    // turn off legacy lights
    renderer.useLegacyLights = false;
    // update output encoding
    renderer.outputEncoding = t.sRGBEncoding;
    // enable shadows
    renderer.shadowMap.enabled = getOptionValue("shadows");
    renderer.shadowMap.type = t.PCFSoftShadowMap;

    cam.position.y = 6;
    cam.position.z = 5;

    

    /**
     * Read Template & load objects and data
     */
    const data = this.data;
    const loader = new t.ObjectLoader();
    const intHandlers = [];
    
    for (let i = 0; i < data.objects.length; i++) {
      const objId = data.objects[i];
      const objName = objId.split("/")[0];
      const objData = require("../models/" + objName.split("/")[0] + ".json");
      const obj = await loader.parse(objData);
      obj.position.set(...data.pos[i]);

      if (objId in data.interactions) {
        const intHandler = buildInteractionHandler(objName, obj, scene, cam, data.interactions[objId].options);
      
        for (let event in data.interactions[objId]) {
          let handlers = data.interactions[objId][event];
          if (Array.isArray(handlers)) {
            intHandler.addEventListeners(event, handlers);
          } else {
            intHandler.addEventListener(event, handlers);
          }
        }
  
        intHandlers.push(intHandler);
      }

      scene.add(obj);
    }

    /**
     * Set up interactions
     */
    const animations = [];
    function intClick() {
      if (scope.state.paused) {
        return;
      }

      let origin = new t.Vector3();
      let dir = new t.Vector3();

      cam.getWorldPosition(origin);
      cam.getWorldDirection(dir);

      let raycaster = new t.Raycaster(origin, dir);
      for (let int of intHandlers) {
        const anims = int.handle(raycaster);
        if (anims?.length > 0) {
          animations.push(...anims);
        }
      }
    }
    document.addEventListener("click", intClick);

    /**
     * Set up camera controls
     */
    const controls = new PointerLockControls(cam, document.body);
    this.controls = controls;
    scene.add(controls.getObject());
    canvas.addEventListener('click', function () {
      controls.lock();
      scope.data.start?.();
    });
    controls.addEventListener("lock", () => scope.togglePauseMenu(false));
    controls.addEventListener("unlock", () => scope.togglePauseMenu(true));

    controls.pointerSpeed = getOptionValue("sens");
    if (getOptionValue("fullscreen") && !document.fullscreenElement) {
      setOptionValue("fullscreen", false);
    }
    renderer.setPixelRatio(getOptionValue("quality"));
    addOptionChangeListener((n, v) => {
      switch (n) {
        case "sens":
          controls.pointerSpeed = v;
          break;
        case "quality":
          renderer.setPixelRatio(v);
          break;
        case "shadows":
          renderer.shadowMap.enabled = v;
          break;
        case "fullscreen":
          if (v) {
            if (document.fullscreenElement) {
              break;
            }
            document.documentElement.requestFullscreen();
          } else if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
        default:
          break;
      }
    });
    
    // track movement inputs
    const velocity = new t.Vector3();
    const direction = new t.Vector3();
    let moveSlow = false;
    let movePos = new t.Vector3();
    let moveNeg = new t.Vector3();

    function keyHandler(down, event) {
      const dir = down ? 1 : 0;

      switch (event.code) {
        case getOptionValue("forward"):
          movePos.z = dir;
          break;
        case getOptionValue("left"):
          moveNeg.x = dir;
          break;
        case getOptionValue("backward"):
          moveNeg.z = dir;
          break;
        case getOptionValue("right"):
          movePos.x = dir;
          break;
        case getOptionValue("up"):
          movePos.y = dir / 2;
          break;
        case getOptionValue("down"):
          moveNeg.y = dir / 2;
          break;
        case getOptionValue("slow"):
          moveSlow = down;
          break;        
        case getOptionValue("pause"):
          if (down) {
            if (scope.data.pause?.() === false) {
              return;
            }
            scope.pause();
          }
          break;
        default:
          return;
      }
      event.preventDefault();
    }

    window.addEventListener('keydown', (e) => keyHandler(true, e));
    window.addEventListener('keyup', (e) => keyHandler(false, e));
    // "unbind" movement when env is unfocused so user doesn't keep moving upon return
    controls.addEventListener("unlock", () => {
      movePos.set(0, 0, 0);
      moveNeg.set(0, 0, 0);
    });

    /**
     * Checks for window resize each frame and resizes env if necessary
     */
    function resizeCanvas() {
      const width = Math.floor(window.innerWidth);
      const height = Math.floor(window.innerHeight);
    
      if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, true);
        cam.aspect = width / height;
        cam.updateProjectionMatrix();
      }
    }


    const bounds = data.bounds;


    // performance stats
    let prevTime = performance.now();
    let time = 0;
    let runTime = 0;
    let frames = 0;

    /**
     * Primary frame handler
     */
    function animate() {
      // track time delta between frames for movement and stats
      const start = performance.now();
      const delta = (start - prevTime) / 1000;
      prevTime = start;
      
      requestAnimationFrame(animate);
      
      resizeCanvas();

      if (scope.state.paused) {
        return;
      }

      if (controls.isLocked) {
        // deccelerate to stop if done moving
        velocity.addScaledVector(velocity, -10 * delta);

        // calculate direction of movement
        direction.subVectors(movePos, moveNeg);
        direction.normalize();

        // velocity using moveSlow control
        const vel = 40 * (1 - 0.75 * moveSlow);

        // calculate individual velocities if inputting movement
        velocity.addScaledVector(direction, -vel * delta);
      
        // move player
        controls.moveRight(-velocity.x * delta);
        cam.position.y += -velocity.y * delta;
        controls.moveForward(-velocity.z * delta);

        // check for overall bounds
        for (let d of ["x", "y", "z"]) {
          if (cam.position[d] < bounds[d][0]) {
            cam.position[d] = bounds[d][0];
          } else if (cam.position[d] > bounds[d][1]) {
            cam.position[d] = bounds[d][1];
          }
        }
      }

      // step animations
      for (let i = animations.length - 1; i >= 0; i--) {
        if (animations[i].step(delta)) {
          animations.splice(i, 1);
        }
      }



      renderer.render(scene, cam);
      
      // performance metrics (FPS)
      runTime += (performance.now() - start) / 1000;
      time += delta;
      frames++;
      if (time >= 1) {
        console.log("FPS:", Math.round(frames / time * 100) / 100, "Max FPS:", Math.round(frames / runTime * 100) / 100);
        time = 0;
        frames = 0;
        runTime = 0;
      }
    }

    this.data.load?.({
      pause: this.pause,
      isPaused: () => this.state.overlay,
      addResultsData: this.addResultsData
    });

    animate();

    this.props.onLoad();
    // this.setState({loading: false});
  }

  render() {
    return [
      <canvas ref={this.canvas} id="env" key="0" />,
      <div id="crosshair" key="1"></div>,
      <div id="overlay" className={this.state.overlay ? "show" : ""} key="2">
        <div id="pause" className={this.state.pauseMenu ? "show" : ""}>
          <h1>PAUSED</h1>
          <div id="pause-btns">
            <button onClick={this.pause} id="btn-resume">Resume</button>
            <button id="btn-options" onClick={() => this.toggleOpts(true)}>Options</button>
            <button id="btn-restart" onClick={() => window.location.reload()}>Restart</button>
            <button id="btn-quit" onClick={() => window.location.href="/"}>Quit</button>
          </div>
        </div>
        <SimOptions show={this.state.showOpts} close={() => this.toggleOpts(false)} />
        <SimResults data={this.state.resultsData} show={this.state.showResults} close={() => this.toggleResults(false)} />
      </div>,
      <Computer toggle={this.toggleComputer} open={this.state.computerOpen}  data={this.data.computer} key="3" handler={this.computerHandler} />,
      <SimResultsButton hide={this.state.computerOpen} toggle={() => this.toggleResults(!this.state.showResults)} key="4" />,
      <Notifications key="5" />
    ];
  }
}