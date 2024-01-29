import InteractionHandler from "./InteractionHandler";

export default class AnimationHandler extends InteractionHandler {
  interactions = {};
  interObjects = [];

  /**
   * Adds an animated interaction to check for. Set animations for multiple properties by calling again with the same
   * objName. 
   * @param {String} objName Name of the mesh object to interact with. Cannot be a group.
   * @param {String} property Name of the property of the mesh. Separate sub-properties with ".", do not begin with ".". For example, "position.x"
   * @param {Number[]} stages Values for each stage of the object's state. For example, [0, 1] could be for a toggle switch.
   * @param {Number} dur Duration of the animation in seconds
   * @param {Function} incrementor Function to increment stages, optional. Default increments by 1 after each interaction.
   */
  addAnimInteraction(eventName, objName, property, stages, dur, options={}) {
    // get mesh for interaction
    let o = this.obj.getObjectByName(objName);
    
    // get property object from mesh
    let prop;
    if (typeof property === "string") {
      property = property.split(".");
      prop = o;
      for (let i = 0; i < property.length - 1; i++) {
        prop = prop[property[i]];
      }
    } else if (typeof property === "function") {
      let res = property(o);
      prop = res[0];
      property = res[1];
    } else {
      console.error("Invalid property value");
    }

    // set default incrementor
    if (options.incrementor === undefined) {
      options.incrementor = (stages, n) => {
        n++;
        if (n >= stages.length) {
          n = 0;
        }
        return n;
      }
    }

    // make empty object if adding a new interaction
    if (!(objName in this.interactions)) {
      let stgArray = [];
      for (let i = 0; i < stages.length; i++) {
        stgArray.push([]);
      }

      this.interactions[objName] = {
        eventName: eventName,
        obj: o,
        propObj: [],
        prop: [],
        stages: stgArray,
        dur: [],
        incr: options.incrementor,
        // # of active animations
        anim: 0,
        // current stage
        n: 0,
        stepper: [],
        cb: options.cb
      }
      this.interObjects.push(o);
    }

    // add new interaction data
    let obj = this.interactions[objName];
    obj.propObj.push(prop);
    obj.prop.push(property[property.length - 1]);
    obj.dur.push(dur);
    obj.stepper.push(options.stepper);
    for (let i = 0; i < stages.length; i++) {
      obj.stages[i].push(stages[i]);
    }
  }

  /**
   * Handles all interactions given a ray of a click. Does not support pass-through; only interacts with the closest object clicked.
   * @param {t.Raycaster} ray Ray of the click
   * @returns Returns an array of animations, or null if nothing was interacted with
   */
  handleAnimInteractions(ray) {
    const intersect = ray.intersectObjects(this.interObjects);
    if (intersect.length > 0) {
      const int = this.interactions[intersect[0].object.name];
      if (this.dispatch(int.eventName) === false) {
        this.anim = 1;
        // delay before allowing animation
        setTimeout(() => {
          this.anim = 0;
        }, 500);
        return null;
      }
      const anim = this.buildInterAnim(int);
      if (anim !== false) {
        return anim;
      }
    }
    return null;
  }

  /**
   * Private helper for building animations for interacted objects.
   * @param {Object} obj object data for interaction
   * @returns an array of animations
   */
  buildInterAnim(obj) {
    // don't start new animation if an old animation is still running
    if (obj.anim > 0) {
      return false;
    }

    const animations = [];
    const nextN = obj.incr(obj.stages, obj.n);
    const cb = () => {
      obj.anim--;
      // only increment the stage after all animations are done
      if (obj.anim === 0) {
        obj.n = nextN;
        if (obj.cb !== undefined) {
          obj.cb(obj.obj, nextN);
        }
        this.dispatch(obj.eventName + "End", {state: nextN});
      }
    }

    // loop through all properties to animate
    for (let i = 0; i < obj.propObj.length; i++) {
      animations.push(new IntAnim(
        obj.propObj[i],
        obj.prop[i],
        obj.stages[obj.n][i],
        obj.stages[nextN][i],
        obj.dur[i],
        cb,
        obj.stepper[i]
      ));
      obj.anim++;
    }

    return animations;
  }

  /**
   * Handles interactions given a raycast of the user's click.
   * @param {t.Raycaster} ray 
   * @returns any animation objects that need to be handled
   */
  handle(ray) {
    console.error('Method "handle" is not implemented!');
    return false;
  }
}

class IntAnim {
  /**
   * Represents an animation.
   * @param {Object} obj object containing the property to animate. Can be a "property" of a Three object.
   * @param {String} prop name of the property to animate.
   * @param {Number} from start value of the animation.
   * @param {Number} to end value of the animation.
   * @param {Number} dur duration of the animation.
   * @param {Function} cb callback function upon completion.
   */
  constructor(obj, prop, from, to, dur, cb, stepper) {
    this.obj = obj;
    this.prop = prop;
    this.from = from;
    this.to = to;
    this.totalDur = dur;
    this.dur = dur;
    this.cb = cb;

    if (stepper === undefined) {
      this.stepper = (p) => ((this.to - this.from) * p + this.from);
    } else {
      this.stepper = stepper;
    }

    this.stepSize = (this.to - this.from) / this.dur;
    this.obj[this.prop] = this.from;
  }

  /**
   * Steps the animation given a time delta.
   * @param {*} delta Time change since last frame in seconds.
   * @returns True if animation is complete, false otherwise.
   */
  step(delta) {
    this.obj[this.prop] = this.stepper(1 - this.dur / this.totalDur);

    this.dur -= delta;

    if (this.dur <= 0) {
      this.obj[this.prop] = this.to;
      this.cb();
      return true;
    }

    return false;
  }
}