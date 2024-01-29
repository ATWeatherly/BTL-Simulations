# Interaction Handling
This document describes how to handle interactions with objects. Parent/abstract classes for interaction handling can be found at `src/models/interactions/handlers`. Individual model handlers should be placed at `src/models/interactions`.

## Creating new interaction handlers
Each interaction handler must be added to the `factory.js` class so they can be built properly.

## Options
Options can be passed to each interaction handler. For example, the lock locations can be passed to a `DragHandler` through the `options`.

# InteractionHandler
The base class for all interaction handlers. Essentially acts as an EventListener wrapper. 


## Parameters

### object : THREE.Object3D
> Object that the handler is for.


## Methods

### dispatch(event : String, data : anything)
> Dispatches an event to its event handlers. `data` is passed to each handler. If a handler returns `false`, all further event handlers are cancelled. 

### addEventListener: *function(event : String, listener : function)*
> Adds an event listener function for the specified event.

### addEventListeners: *function(event : String, listeners: array of functions)*
> Adds multiple event listener funtions for the specified event.


# AnimationHandler
Parent class that handles animation-based interactions. For example, toggling a power switch, opening a door, etc. 


## Methods

### addAnimListener(eventName, objName, property, stages, dur, options)
> Adds a listener for an interaction with `objName`. 

**eventName** : *String*
> Name of the event to dispatch. A `name` event is dispatched before animation, return `false` to cancel the animation. A `nameEnd` event is dispatched after animation. 

**objName** : *String*
> Name of the 3D object to interact with.

**property** : *String*
> Name of the property of the object to animate. Use `.` to separate object properties. Example: `position.x`

**stages** : *Number array*
> Values for each stage of the object's state. For example, `[0, 1]` for on/off.

**dur** : *Number*
> Duration of the animation, in seconds

**options** : *Object*
> Additional options
* incrementor : *function(stages, currStage)* - Function used to increment the stage after each interaction.
* cb : *function(obj, nextStage)* - Callback after the animation completes.


### handleAnimInteractions(ray)
> Handles animation interactions given a ray representing the user's click.

**ray** : *THREE.Raycaster*
> A Raycaster object to use for the interaction.


### handle(ray)
> To be implemented by children classes.



# DragHandler
Parent class that handles drag interactions. Fires the `lock` event with the index of the lock location as data before locking into a position; return `false` to cancel the lock. Fires the `unlock` event when unlocking from a locked position, with the index of the lock location as data; return `false` to prevent unlocking. 


## Parameters

### obj
> See `InteractionHandler`

### grabDist : Number
> Maximum distance to allow a grab.

### ref : THREE.Camera
> Camera object to use as a reference for the drag.


## Methods

### setDragLocks(locs, dists)
> Sets the drag lock locations. Length of `locs` should match `dists`.

**locs** : *array of [x, y, z]*
> Locations to lock to.

**dists** : *Number array*
> Distance to lock for each location.


### handleDrag(ray)
> See `AnimationHandler`