# Usage

Lrud handles the registering of new navigation nodes, the handling of key events, and the emitting of events based on internal state changes.

For some examples of common desired behaviour and how to achieve it, see our [common recipes](./recipes.md).

## Creating a new instance

```js
const { Lrud } = require('Lrud')

const navigation = new Lrud()
```

## Registering a node

A node can be added to the navigation tree by calling `navigation.registerNode` with the `id` of the node and any node options

```js
navigation.registerNode('root', {})
```

The very first node that is registered will become the *root node*. From here, any node that is registered without a parent will automatically become a child of the root node.

```js
navigation
    .registerNode('root', { orientation: 'horizontal' })
    .registerNode('alpha', { isFocusable: true })

// ...is the same as

navigation
    .registerNode('root', { orientation: 'horizontal' })
    .registerNode('alpha', { isFocusable: true, parent: 'root' })
```

## Registration options

Most options affect behaviour for when Lrud is handling key events and assigning focus.

### `orientation`

`"vertical" | "horizontal"`

Any node that has children should be registered with an orientation. A node of vertical orientation will handle up/down key events while horizontal will handle left/right key events.

### `isWrapping`

`boolean`

Used in conjunction with orientation to make a list wrap at the top/bottom or left/right depending on orientation.

### `index`

`number`

The zero-based index of the node, relative to its siblings. If no idex is given, it will be set as the _next_ index under its parent.

```js
navigation
    .registerNode('X', { parent: 'root' })
    .registerNode('Y', { parent: 'root' })
    .registerNode('Z', { parent: 'root' })

// ...is the same as

navigation
    .registerNode('X', { parent: 'root', index: 0 })
    .registerNode('Y', { parent: 'root', index: 1 })
    .registerNode('Z', { parent: 'root', index: 2 })
```

### `isIndexAlign`

`boolean`

To be used in conjunction with orientation to give a node index alignment functionality.

Index alignment ensures that when focus would move from one of this nodes descendants to another, Lrud will attempt to ensure that the focused node matches the index of the node that was left.

For further details, see the [docs on index alignment](./index-align.md).

### `indexRange`

`number[]`

An array with 2 elements. Value `[0]` is the lower bound of matching indexes, `[1]` is the upper bound.

Used in conjuction with `isIndexAlign` behaviour, allows a node to replicate the effects of a "column span" by assuming the role of multiple indexes relative to its siblings.

For further details, see the [docs on index alignment](./index-align.md).

---

Several functions can also be given as registration options to a node. These functions will be called at specific state change points for the node.

### `onFocus`

`function`

If given, the `onFocus` function will be called when the node gets focussed on.

### `onBlur`

`function`

If given, the `onBlur` function will be called when the node if the node had focus and a new node gains focus.

### `onSelect`

`function`

If given, the `onSelect` function will be called when the node is focused and a key event of "ENTER" is handled.

### `onActive`

`function`

If given, the `onActive` function will be called when the node is made active by either itself or one of its descendants gaining focus.

### `onInactive`

`function`

If given, the `onInactive` function will be called when the node was active and due to an updated focus, is no longer active.

### `onLeave`

`function`

If given, the `onLeave` function will be called when the node was focused and the handling of a key event means the node is no longer focused.

### `onEnter`

`function`

If given, the `onEnter` function will be called when the node was not focused and the handling of a key event means the node is now focused.

## Unregistering a node

A node can be removed from the navigation tree by calling `navigation.unregisterNode()` with the id of the node

Unregistering a node will also remove all of its children and trigger events correctly.

If an unregister causes the current focused node to be removed, focus will be moved to the _last_ node that could be focused. This also works when unregistering a branch.

Unregistering the root node will cause the tree to become empty and also remove all overrides that have been set (see Overrides, below).

## Assigning Focus

You can give focus to a particular node by calling `navigation.assignFocus()` with the node id

```js
navigation.assignFocus('list')
```

If the node that has been assigned focus is not focusable, LRUD will attempt to find the first active child of the node that _is_ focusable, and focus on that instead.

## Handling Key Events

You can pass key events into Lrud using the `navigation.handleKeyEvent` function

```js
document.onkeydown = function (event) {
    navigation.handleKeyEvent(event)
  }
}
```

## Events

Lrud emits events in response to key events. See the [TAL docs](http://bbc.github.io/tal/widgets/focus-management.html) for an explanation of 'focused' and 'active' nodes. Each of these callbacks is called with the node that changed state.

* `navigation.on('focus', function)` - Focus was given to a node.
* `navigation.on('blur', function)` - Focus was taken from a node.
* `navigation.on('active', function)` - The node has become active.
* `navigation.on('inactive', function)` - The node has become inactive.
* `navigation.on('select', function)` - The current focused node was selected.

A special event of `move` is emitted after handling a key event.

* `navigation.on('move', function)` - Triggered when focus is changed within a list

The `move` event callback is called with a move event in the following shape:

```json
{
    leave: <node>       // the node that was focused that we're now leaving
    enter: <node>       // the node that is now focused that we're entering
    offset: -1 : 1      // 1 if direction was RIGHT or DOWN, -1 if direction was LEFT or UP
}
```

## Overrides

LRUD supports an override system, for times when correct product/UX behaviour requires focus to change in a way that is not strictly in accordance with the structure of the navigation tree.

New overrides can be registered with `navigation.registerOverride(<overrideId>, <overrideOptions>)`.

`navigation.overrides` is an object, each key representing an override object.

The override object below represents that when LRUD is bubbling its key event, when it hits the `box-1` node, and direction of travel is `DOWN`, STOP the propogation of the bubble event and focus directly on `box-2`.

```js
navigation.overrides = {
  'override-1': {           // the name of the override
    'id': 'box-1',          // the ID to trigger the override on
    'direction': 'DOWN',    // the direction of travel in order for the override to trigger
    'target': 'box-2'       // the ID of the node we want to focus on
  }
}
```
# F.A.Q

> Q: A node that should be focusabled is never receiving focus - whats happening?

A: Ensure that the parent nodes, etc. have the correct orientation in order to be able to jump inbetween nodes.

> Q: All my parents have orientations, everything is setup in the navigation tree, and I STILL can't focus on the node I expect.

A: Ensure the node has either `isFocusable: true` or a `selectAction` registered against it. A node needs either one of these in order to be considered "focusable"

> Q: What is the different between `onBlur/onFocus` and `onLeave/onEnter`?

A: `onBlur` and `onFocus` can/will be called at any point in time for when a node loses focus. This includes a direct call to `assignFocus()` from user land. On the other hand, `onLeave` and `onEnter` will only be called via the result of a `handleKeyEvent()`