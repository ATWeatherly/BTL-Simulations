export default class InteractionHandler {
  constructor(obj) {
    this.obj = obj;
    this.listeners = {};
  }

  dispatch(event, data={}) {
    if (!(event in this.listeners)) {
      return;
    }

    for (let f of this.listeners[event]) {
      // if a handler returns false, send signal to cancel action (false)
      if (f(data) === false) {
        return false;
      }
    }
  }

  addEventListeners(event, listeners) {
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(...listeners);
  }

  addEventListener(event, listener) {
    this.addEventListeners(event, [listener]);
  }
}