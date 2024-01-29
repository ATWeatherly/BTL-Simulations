import { Vector3 } from 'three';
import InteractionHandler from "./InteractionHandler";

export default class DragHandler extends InteractionHandler {
  draggable = true;
  grabDist = 0;
  dragRef = null;
  dragLocks = [];
  dragging = false;
  dragAnim = null;
  locked = false;
  lockedAt = -1;

  constructor(obj, grabDist, ref) {
    super(obj);
    this.grabDist = grabDist;
    this.dragRef = ref;
  }

  setDragLocks(locs, dists) {
    this.dragLocks = locs;
    this.dragDists = dists;
  }

  /**
   * Handles drag starts. 
   * @param {t.Raycaster} ray intersection ray
   * @returns false on no drag, null on drag finish, and DragUpdate on drag.
   */
  handleDrag(ray) {
    const intersect = ray.intersectObject(this.obj);
    if (intersect.length > 0) {
      const dist = ray.ray.origin.distanceTo(this.obj.position);

      // object is valid to be dragged
      if (dist <= this.grabDist) {
        if (this.dispatch("drag") === false) {
          return null;
        }
        
        if (!this.dragging) {
          if (this.dispatch("pickup") === false) {
            return null;
          }
        }

        if (this.locked) {
          // check for unlock events
          if (this.dispatch("unlock", {loc: this.lockedAt}) === false) {
            return null;
          }
        }

        this.dragging = !this.dragging;

        if (!this.dragging) {
          let pos = undefined;
          this.locked = false;
          this.lockedAt = -1;

          for (let i = 0; i < this.dragLocks.length; i++) {
            const loc = this.dragLocks[i];
            const objPos = new Vector3(loc[0], loc[1], loc[2]);

            // lock position found
            if (this.obj.position.distanceTo(objPos) <= this.dragDists[i]) {
              let res = this.dispatch("lock", {loc: i});

              // cancel lock if needed
              if (res === false) {
                this.dragAnim.reset();
                return null;
              }

              // set lock
              pos = objPos;
              this.locked = true;
              this.lockedAt = i;
              break;
            }
          }
          this.dragAnim.finish(pos);
          return null;
        } else {
          this.dragAnim = new DragUpdate(this.obj, this.dragRef, dist);
          return this.dragAnim;
        }
      }
    }
    return false;
  }  
}

class DragUpdate {
  constructor(obj, ref, dist) {
    this.startPos = obj.position.clone();
    this.obj = obj;
    this.ref = ref;
    this.dist = dist;
    this.active = true;
    this.setPos = undefined;
  }

  step() {
    if (this.setPos !== undefined) {
      this.obj.position.copy(this.setPos);
    } else {
      const camdir = new Vector3();
      this.ref.getWorldDirection(camdir);
      this.obj.position.copy(this.ref.position.clone().add(camdir.multiplyScalar(this.dist)));
    }
    return !this.active;
  }

  finish(pos) {
    this.setPos = pos;
    this.active = false;
  }

  reset() {
    this.setPos = this.startPos;
    this.active = false;
  }
}