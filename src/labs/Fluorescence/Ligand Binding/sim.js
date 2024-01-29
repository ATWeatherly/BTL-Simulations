import React from "react";

import shutterOpen from "../../../images/shutterOpen.svg";
import testTube from "../../../images/testTube.svg";

import { NotifInfo, NotifError } from "../../../components/Notifications/Notifications";
import { getOptionValue } from "../../../components/SimOptions/SimOptions";

// "checks" for the steps to complete the simulation
const CHECKS = {
  begin: 0,
  pc_on: 1,
  fm_on: 2,
  params_set: 3,  // ready to measure baseline
  baseline_measured: 4, // ready to measure other samples
  done: 5,
}
const params = {
  bandwidth: 0,
  sensitivity: 0,
  response: 0
};
const state = {
  fmOn: false,
  lidOpen: false,
  shuttersOpen: false,
  sample: -1,
  measuring: false,

  samplesMeasured: [],
  doneMeasuring: false,

  measurementNum: 0
}

const cuvettes = ["Baseline", "Sample 1"];

const measurement_duration = 100; // ms


var stage = 0;



export const sim = {
  objects: [
    "classroom",
    "lab_table",
    "sf",
    "cuvette_tray",
    "cuvette",  // buffer
    "cuvette/1",  // sample 1
  ],
  pos: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 4.15, 0],
    [1.748, 3.377, -0.0225], // slight offsets due to modeling inaccuracies
    [1.5, 3.69, 0], 
    [1.6, 3.69, 0],
  ],
  bounds: {
    x: [-11.5, 11.5],
    y: [0.5, 10],
    z: [-11.5, 11.5]
  }, 
  load: (funcs) => {
    state.funcs = funcs;
  },
  
  interactions: {
    sf: {
      start: () => {
        NotifInfo("Please use the measure control button.");
        return false;
      },

      // Power switch
      power: () => {
        // cannot turn on fluorometer without turning on software first
        if (stage < CHECKS.pc_on) {
          NotifError("Please turn the computer on first.");
          return false;
        }
        if (state.fmOn) {
          if (stage < CHECKS.done) {
            NotifError("You shouldn't be turning the fluorometer off yet.");
            return false;
          }

          if (state.sample !== -1) {
            NotifError("Remove the sample cuvette first.");
            return false;
          }

          if (state.shuttersOpen) {
            NotifError("Close the shutters before turning the machine off.");
            return false;
          }
          
          if (state.lidOpen) {
            NotifError("Please close the lid first.");
            return false;
          }

          NotifInfo("Congratulations! You have completed the Ligand Binding experiment simulation. If you would like to try again, please refresh the page.", 60000);
        }
      },
      powerEnd: (e) => {
        state.fmOn = e.state;
        if (e.state) {
          NotifInfo("Fluorometer powered on.");
          if (stage === CHECKS.pc_on) {
            stage = CHECKS.fm_on;
          }
        } else {
          NotifInfo("Fluoromoter powered off.");
        }
      },

      // Lid open/close
      lid: () => {
        if (state.measuring) {
          NotifError("Cannot open lid while measurement in progress!");
          return false;
        }

        // prevent lid from opening before turning fm on
        if (stage < CHECKS.fm_on) {
          NotifError("You shouldn't be opening the lid yet!");
          return false;
        }

        // reminder to set params when opening lid
        if (stage < CHECKS.params_set) {
          NotifInfo("Don't forget to set the parameters.");
          stage = CHECKS.params_set;
        }

      },
      lidEnd: (e) => {
        // state.lidOpen = !state.lidOpen;
        state.lidOpen = e.state;
      }
    },
    cuvette: cuvetteInt(0),
    "cuvette/1": cuvetteInt(1),
    computer: {
      on: () => {
        if (stage === CHECKS.begin) {
          NotifInfo("Computer turned on.");
          stage = CHECKS.pc_on;
        } else {
          NotifError("Cannot turn computer on now.");
        }
      },
      open: () => {
        if (stage < CHECKS.fm_on) {
          NotifError("Please turn the fluorometer on first.");
          return false;
        }

        if (stage === CHECKS.fm_on) {
          stage = CHECKS.params_set;
        }
      }
    }
  },
  computer: {
    controls: [
      {
        content: "Toggle Shutters",
        icon: shutterOpen,
        cb: () => {
          if (state.measuring) {
            NotifError("Measurement in progress!");
            return false;
          }

          if (state.shuttersOpen) {
            if (stage < CHECKS.done) {
              NotifError("You shouldn't close the shutters yet.");
              return false;
            }
          }

          NotifInfo("Shutters " + (state.shuttersOpen ? "closed" : "opened") + ".");
          state.shuttersOpen = !state.shuttersOpen;
        }
      },
      {
        content: "Measure",
        icon: testTube,
        cb: () => {
          if (state.lidOpen) {
            NotifError("Cannot start measurement, lid is open.");
            return false;
          }

          if (!state.fmOn) {
            NotifError("Cannot start measurement, machine is turned off.");
            return false;
          }

          if (!state.shuttersOpen) {
            NotifError("Cannot start measurement, shutters are closed.");
            return false;
          }

          if (state.sample === -1) {
            NotifError("Cannot start measurement, no sample inserted.");
            return false;
          }

          if (state.measuring) {
            NotifError("Cannot start measurement, another measurement is already in progress.");
            return false;
          }

          state.measuring = true;
          NotifInfo("Measuring...", 5000);

          // Finish measurement
          setTimeout(() => {
            state.measuring = false;
            if (state.sample === 0) {
              if (stage === CHECKS.params_set) {
                stage = CHECKS.baseline_measured;
              }
            }
            if (!state.samplesMeasured.includes(state.sample)) {
              state.samplesMeasured.push(state.sample);

              // done measuring all samples
              if (state.samplesMeasured.length === 2 && stage === CHECKS.baseline_measured) {
                stage = CHECKS.doneMeasuring;
              }
            }
            state.funcs.addResultsData(getMeasurementData(state.sample));
            state.measurementNum++;
            NotifInfo("Measurement complete. View results in the results panel or by pressing [" + getOptionValue("results") + "].", 10000);
          }, measurement_duration);
        }
      }
    ],
    parameters: {
      state: params,
      fields: {
        bar0: {
          type: "static",
          name: "Measurement Mode:",
          content: "Emission"
        },
        bar1: {
          type: "static",
          name: "Excitation Wavelength:",
          content: "280 nm"
        },
        bar2: {
          type: "static",
          name: "Emission Range",
          content: "300 - 500 nm"
        },
        bandwidth: {
          type: "select",
          name: "Bandwidths:",
          values: ["Ex: 2.5 nm, Em: 2.5 nm", "Ex: 5 nm, Em: 5 nm", "Ex: 10 nm, Em: 10 nm"]
        },
        sensitivity: {
          type: "select",
          name: "Sensitivity:",
          values: ["Low", "Medium", "High"]
        },
        response: {
          type: "select",
          name: "Response Time:",
          values: ["20 ms", "50 ms", "0.1 s", "0.2 s", "0.5 s", "1 s", "2 s", "4 s", "8 s"]
        },
        bar3: {
          type: "static",
          name: "Data Interval:",
          content: "1 nm"
        },
        bar4: {
          type: "static",
          name: "Scan Speed:",
          content: "2,000 nm/min"
        },
        bar5: {
          type: "static",
          name: "Accumulations:",
          content: "1"
        }
      }
    },
    protocol: [
      <h2>Binding of Flavonoids to Bovine Serum Albumin: A Ligand-Binding Study</h2>,
      <h3>Overview</h3>,
      <p>Many biochemical processes work by the interaction of a small molecule (ligand) with a biological macromolecule (protein or nucleic acid). The degree to which the ligand binds to the biomolecule can be described by the binding constant (Kd). The goal of this experiment is to determine the binding constant (Kd) for the binding interaction between a flavonoidand a serum protein.</p>,
      <h3>Teaching and Learning Goals</h3>,
      <p>
        Upon completing this laboratory session, students willbeable to:
        <ul>
          <li>Correlate fluorophoreconcentration with fluorescence intensity</li>
          <li>Compute thebinding constant(Kd) of a protein to its ligand from nonlinear data</li>
        </ul>
      </p>,
      <h2><a href="/ligand-binding-protocol.pdf" target="_blank">View full protocol (PDF)</a></h2>
    ]
  }
}

function cuvetteInt(id) {
  // Each cuvette is shifted 0.1 in the x direction to fit in tray
  let cuvettePos = [(1.5 + id * 0.1), 3.69, 0];
  let label = id;
  if (id === 0) {
    label = "B";
  }

  return {
    options: {
      dragDist: [0.5, 0.3],
      dragLocks: [[-0.349, 3.988, 0.6015], cuvettePos],
      name: cuvettes[id],
      label: label
    },
    lock: (data) => {
      if (data.loc === 0) {
        if (!state.lidOpen) {
          NotifError("Cannot insert sample, lid is closed.");
          return false;
        }

        if (state.sample !== -1) {
          NotifError("There is already a sample inserted.");
          return false;
        }
        
        if (stage < CHECKS.baseline_measured && id !== 0) {
          NotifError("Please measure the baseline first.");
          return false;
        }
  
        // only insert sample if locking into fluorometer
        NotifInfo("Sample cuvette inserted.");
        state.sample = id;
      }

    },
    unlock: (data) => {
      if (data.loc === 0) {
        if (!state.lidOpen) {
          NotifError("Please open the lid before removing a sample.");
          return false;
        }
  
        // only remove sample if unlocking from fluorometer
        state.sample = -1;
      }
    }
  };
}


function getMeasurementData(id) {
  if(id !== 0) {
    const datad = require("./data/sample" + id + ".json");
    let xygraphData = datad["data"][params.bandwidth][params.sensitivity][params.response]
    return {
      name: "Measurement " + state.measurementNum,
      xyData: xygraphData
    }
  }
  
}