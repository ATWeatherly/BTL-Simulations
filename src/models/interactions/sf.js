import { Color } from 'three';
import AnimationHandler from "./handlers/AnimationHandler";

export default class SFHandler extends AnimationHandler {
  constructor(obj) {
    super(obj);

    let startColor = obj.getObjectByName("StartButton").material[0].color.clone();
    let startGreenColor = new Color(0.2, 1, 0.2);

    this.addAnimInteraction("lid", "Lid", "rotation.x", [0, degToRad(-90)], 0.5);

    this.addAnimInteraction("power", "PowerSwitch", "rotation.z", [0, degToRad(35.4)], 0.5);

    this.addAnimInteraction("start", "StartButton", "position.z", [0.285, 0.285], 0.5, {
      stepper: (p) => {
        if (p < 0.5) {
          return p * 2 * -0.005 + 0.285;
        } else {
          return (p * 2 - 1) * 0.005 + 0.28;
        }
      },
      cb: (o, s) => {
        if (s === 1) {
          o.material[0].color = startGreenColor;
        } else {
          o.material[0].color = startColor;
        }
      }
    });
  }

  handle(ray) {
    return this.handleAnimInteractions(ray);
  }
}

function degToRad(deg) {
  return deg / 180 * Math.PI;
}