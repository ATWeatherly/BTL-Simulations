import React from "react";

import { NotifInfo, NotifPopup } from "../../components/Notifications/Notifications";
import { getOptionValue } from "../../components/SimOptions/SimOptions";

// "checks" for the steps to complete the simulation
const CHECKS = {
  help: -2,
  helpEnd: -1,
  start: 0,
  intro: 1,
  enter: 2,
  movementInfo: 3,
  pauseInfo: 4,
  movement: 5,
  updownInfo: 6,
  slowInfo: 7,
  updown: 8,
  clickInfo: 9,
  click: 10,
  dragInfo: 11,
  dragInfo1: 12,
  drag: 13,
  dragDone: 14,
  freemove: 15,
  computerInfo: 16,
  computer: 17,
  paramsInfo: 18,
  controlsInfo: 19,
  computerOpen: 20,
  resultsInfo: 21,
  results: 22,
  done: 23,
  free: 24
}
const state = {
  cbs: [],
  history: [],
  halted: false,
};

const progressKey = "Enter";
const helpKey = "";
const continueTagline = (
  <button className="continue" key="cont" onClick={progress}>
    Click here or press [{progressKey}] to continue
  </button>
);

var stage = 0;

function progress() {
  if (state.funcs.isPaused()) {
    if (stage < CHECKS.computer) {
      return;
    }
  }
  switch(stage + 1) {
    case CHECKS.helpEnd:
      if (!popup()) {
        return;
      }
      stage = state.lastStage - 1;
      progress();
      break;
    case CHECKS.intro:
      popup("When you first enter an experiment simulation, you'll be greeted with a screen of the classroom. To enter the simulation, click anywhere on the screen.", true);
      break;
    case CHECKS.enter:
      if (!popup()) {
        return;
      }
      showNotif("Click anywhere on the screen to enter the simulation.", true);
      break;
    case CHECKS.movementInfo:
      popup(`Once you're in the simulation, you can look around using your mouse and move using 
      [${getOptionValue("forward")}] [${getOptionValue("left")}] [${getOptionValue("backward")}] [${getOptionValue("right")}].`);
      break;
    case CHECKS.pauseInfo:
      popup(`If at any time you want to pause the simulation, you can press [${getOptionValue("pause")}]. In the pause menu, you can adjust your key bind and other settings.`, true);
      break;
    case CHECKS.movement:
      if (!popup()) {
        return;
      }
      showNotif([
        "Try moving your mouse to look around.",
        <br />,
        `Move around the classroom by pressing [${getOptionValue("forward")}] [${getOptionValue("left")}] [${getOptionValue("backward")}] [${getOptionValue("right")}].`,
        <br />,
        <br />,
        `Press [${progressKey}] when you're ready to move on.`
      ]);
      break;
    case CHECKS.updownInfo:
      popup(`You can also move up and down by pressing [${getOptionValue("up")}] and [${getOptionValue("down")}], respectively.`);
      break;
    case CHECKS.slowInfo:
      popup(`If you want to get a closer look at something, you can hold [${getOptionValue("slow")}] to move slower.`, true);
      break;
    case CHECKS.updown:
      if (!popup()) {
        return;
      }
      showNotif([
        `To move up or down, press [${getOptionValue("up")}] or [${getOptionValue("down")}].`,
        <br />,
        <br />,
        `To move slowly, hold [${getOptionValue("slow")}] while moving.`,
        <br />,
        <br />,
        `Press [${progressKey}] when you're ready to move on.`
      ]);
      break;
    case CHECKS.clickInfo:
      popup("You can click on parts of the equipment to interact with it.");
      break;
    case CHECKS.click:
      if (!popup()) {
        return;
      }
      showNotif("Try clicking on the lid of the fluorometer to open it.", true);
      break;
    case CHECKS.dragInfo:
      popup([
        "Some objects, like cuvettes, can be moved. Click on a movable object to pick it up, and click once more to place it down. You don't need to hold your mouse down once it is picked up.",
        <br />,
        <br />,
        "Objects will automatically lock to certain spots if it is close enough to the spot. Note: you might not be able to pick up an object unless you are close enough to it."
      ]);
      break;
    case CHECKS.dragInfo1:
      popup(`Objects stay the same distance away when they are picked up. Be careful when moving an object as it might "disappear" behind or inside another object.`, true);
      break;
    case CHECKS.drag:
      if (!popup()) {
        return;
      }
      showNotif([
        "Try inserting the cuvette into the fluorometer. Remember to get close to it to pick it up. Once it is inside the fluorometer area, click again to let go. If it doesn't lock in place, try placing it closer to the fluorometer cuvette holder.",
        <br />,
        <br />,
        "Be careful not to lose the cuvette behind the fluorometer. If you can't see it anymore after picking it up, try moving backward."
      ], true);
      break;
    case CHECKS.dragDone:
      popup("Great job! Take some time to get used to the movement and play around with the environment.");
      break;
    case CHECKS.freemove:
      if (!popup()) {
        return;
      }
      showNotif([
        "Take some time to get used to moving around and interacting with objects.",
        <br />,
        <br />,
        `When are you ready, press [${progressKey}] to move on.`
      ]);
      break;
    case CHECKS.computerInfo:
      popup(`To use equipment and run experiments, you will need to use the computer. You can turn on the computer and open/close it by pressing [${getOptionValue("computer")}] or clicking the computer icon.`);
      break;
    case CHECKS.computer:
      if (!popup()) {
        return;
      }
      showNotif(`Press [${getOptionValue("computer")}] or click on the computer icon on the right side of your screen to first turn on the computer, then again to open it.`, true);
      break;
    case CHECKS.paramsInfo:
      popup(`In the "Parameters" tab of the computer, you can configure the equipment's settings based on the experiment. These parameters will be used the next time you take a measurement.`);
      break;
    case CHECKS.controlsInfo:
      popup(`In the "Controls" tab of the computer, you can find the controls to the equipment. For example, you can start a fluorometer measurement from here.`, true);
      break;
    case CHECKS.computerOpen:
      if (!popup()) {
        return;
      }
      showNotif([
        "Look through the computer and familiarize yourself with its contents. Note that the specifics will be different depending on the experiment.",
        <br />,
        <br />,
        `When are you ready, close the computer to continue.`
      ], true);
      break;
    case CHECKS.resultsInfo:
      popup(`Once you take a measurement, you can view the data and download it in the results panel. Press [${getOptionValue("results")}] or click the graph button to open the results panel.`);
      break;
    case CHECKS.results:
      if (!popup()) {
        return;
      }
      showNotif([
        `Open the results panel by pressing [${getOptionValue("results")}] or by clicking the graph icon on the right side of your screen.`
      ], true);
      break;
    case CHECKS.done:
      popup("Congratulations! You have completed the application tutorial. Refresh the page if you need to review anything, or stay if you want to practice on your own.");
      break;
    case CHECKS.free:
      if (!popup()) {
        return false;
      }
      break;
    default:
      return;
  }
  stage++;
}


export const sim = {
  objects: [
    "classroom",
    "lab_table",
    "sf",
    "cuvette"
  ],
  pos: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 4.15, 0],
    [1.5, 3.69, 0],
  ],
  bounds: {
    x: [-11.5, 11.5],
    y: [0.5, 10],
    z: [-11.5, 11.5]
  }, 
  load: (funcs) => {
    state.funcs = funcs;
    NotifPopup([
      "Here, we'll walk you through the basic features of simulations, including how to move around, how to interact with the equipment, and how to run experiments.",
      continueTagline
    ], "Welcome to the BTL!");
    window.addEventListener("keydown", (e) => {
      if (e.code === progressKey) {
        if (state.halted) {
          return;
        }
        progress();
      } else if (e.code === helpKey) {
        state.lastStage = stage;
        stage = CHECKS.help;
        popup(state.history.join(<br />));
      }
    });
  },
  start: () => {
    if (stage === CHECKS.enter) {
      progress();
    }
  },
  pause: () => {
    if (stage < CHECKS.pauseInfo || state.popupOpen) {
      return false;
    }
    
    if (stage === CHECKS.pauseInfo) {
      progress();
    }
  },
  results: () => {
    if (stage < CHECKS.results) {
      return false;
    }

    if (stage === CHECKS.results) {
      progress();
    }
  },
  interactions: {
    sf: {
      start: () => {
        if (stage < CHECKS.freemove) {
          return false;
        }
      },
      power: () => {
        if (stage < CHECKS.freemove) {
          return false;
        }
      },
      lid: () => {
        if (stage < CHECKS.click) {
          return false;
        }
      },
      lidEnd: () => {
        if (stage === CHECKS.click) {
          progress();
        }
      }
    },
    cuvette: {
      options: {
        dragDist: [0.5],
        dragLocks: [[-0.349, 3.988, 0.6015]]
      },
      drag: () => {
        if (stage < CHECKS.drag) {
          return false;
        }
      },
      lock: () => {
        if (stage === CHECKS.drag) {
          progress();
        }
      }
    },
    computer: {
      on: () => {
        if (stage < CHECKS.computer) {
          return false;
        }
      },
      open: () => {
        if (stage < CHECKS.computer) {
          return false;
        }

        if (stage === CHECKS.computer) {
          progress();
        }
      },
      close: () => {
        if (stage < CHECKS.computerOpen) {
          return false;
        }

        if (stage === CHECKS.computerOpen) {
          progress();
        }
      }
    }
  },
  computer: {
    controls: [
      {
        content: "Example Control",
        cb: () => {

        }
      }
    ],
    parameters: {
      state: {},
      fields: {
        foo: {
          type: "static",
          name: "Static Parameter",
          content: "Unchangeable"
        },
        bar: {
          type: "select",
          name: "Example",
          values: ["Value A", "Value B", "Value C"]
        }
      }
    }
  }
}

function popup(message="", keep=false, save=false) {
  if (!keep) {
    for (const cb of state.cbs) {
      cb();
    }
    state.cbs = [];
    if (!state.funcs.isPaused() && !state.funcs.pause(true)) {
      return false;
    }
  }
  if (message === "") {
    state.popupOpen = false;
    NotifPopup("");
  } else {
    state.halted = false;
    state.popupOpen = true;
    if (save) {
      state.history.push(message);
    }
    NotifPopup([message, continueTagline]);
  }
  return true;
}

function showNotif(message, halt=false) {
  const cbs = NotifInfo(message, -1);
  state.cbs.push(cbs);
  state.halted = halt;
}