# Simulation Templates

The lab simulation template details the components used in the simulation as well all of the interactions. 

## Recommended Variables

Additional variables that might be helpful or relevant to have.

### Checks : *Object{Number}*
> Used to enforce steps in a lab. Object of numbers to reference "before" or "after" a checkpoint.

### Stage : *Number*
> Used with Checks to store the current checkpoint.

### State : *Object*
> Used to store the state of the simulation. For example, if the equipment is turned on.

### Parameters : *Object*
> Used to hold the parameters for the equipment. Optionally, can be included in state.


# Sim Object
The sim object stores the primary content for the simulation. Should be written as 
```javascript
export const sim = { ... };
```

## Values

### objects : *String array*
> String name of models to include in the simulation. To use a model multiple times, you can assign each additional model an id using `"model/id"`

Example:
```javascript
objects: [
  "model1",
  "model2",
  "reusedModel",
  "reusedModel/1"
]
```

### pos : *[x : Number, y : Number, z : Number] array*
> The starting position of each object in `objects`, in the same order. Should be an array of 3D points in array format as `[x, y, z]`

Example:
```javascript
pos: [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
```

### bounds: *{x : Number array, y : Number array, z : Number array}*
> Describes the bounds of the environment. Should be an object of the x, y, and z `[min, max]` points.

Example: 
```javascript
bounds: {
  x: [-10, 10],
  y: [-10, 10],
  z: [-10, 10]
}
```

### load : *function(funcs : Object of functions), **optional***
> Function to be called on load. Single argument of useful functions. Currently contains `pause(quiet)`, `isPaused()`, and `addResultsData(data)`.

Example:
```javascript
load: (funcs) => {
  // do something...
}
```

### start : *function(), **optional***
> Function to be called when the user enters the simulation.

Example:
```javascript
start: () => {
  // simulation entered
}
```

### pause : *function(), **optional***
> Function to be called when the user requests pause. Return `false` to prevent pause.

Example:
```javascript
pause: () => {
  if (preventPause) {
    return false;
  }
}
```

### results : *function(), **optional***
> Function to be called when the user requests the results panel. Return `false` to prevent.

Example:
```javascript
results: () => {
  if (preventResults) {
    return false;
  }
}
```

### interactions : *Object*
> Object of interaction event handlers. The key for each entry should correspond to the object name detailed in `objects`, including the id. Each entry should be an object of the event listeners, and `options` that specifies options to pass to the `Listener` object. See [Interactions](interactions.md) for more details.

Example:
```javascript
interactions: {
  model1: {
    options: {
      foo: "bar",
      hello: "world"
      id: 1
    }
    open: () => {
      // ...
    }
  },
  // ...
}
```

### computer : *Object {controls, parameters, protocol}*
> Describes the contents of the computer.

Example:
```javascript
computer: [
  controls: {
    // controls here...
  ],
  parameters: {
    // parameters here...
  },
  protocol: [
    <p>Protocol here</p>
  ]
}
```


**controls** : *Object array*
> An array of the buttons. Each object should contain:
```javascript
{
  content: "String to display on the button",
  icon: IconToDisplay,
  cb: () => {
    // callback function on click
  }
}
```

**parameters** : *Object*
> An object of the parameters and their data. Should also include a `state` object where the parameter values will be set. Values are set by their respective index in the `values` array.

Example:
```javascript
parameters: {
  state: params,
  param1: {
    type: "static" or "select",
    name: "Name of the parameter",
    // if type === static
    content: "value",
    // if type === select
    values: ["value1", "value2", "value3"]
  }
}
```

**protocol** : *JSX Array*
> An array or single JSX element to display as the protocol for the simulation