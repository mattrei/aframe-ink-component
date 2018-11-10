## aframe-ink-component

[![Version](http://img.shields.io/npm/v/aframe-ink-component.svg?style=flat-square)](https://npmjs.org/package/aframe-ink-component)
[![License](http://img.shields.io/npm/l/aframe-ink-component.svg?style=flat-square)](https://npmjs.org/package/aframe-ink-component)

This component provides two components for easying the integration of [Inkle's Ink](https://www.inklestudios.com/ink/) game scripting language in [A-Frame](https://aframe.io). Note that you still have to learn [the Ink scripting language](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md) in order to make serious use of this component.

> Supports A-Frame 0.8.0.

## 

### API

#### `ink` component

This component just wraps the [InkJS library](https://github.com/y-lohse/inkjs), for running Ink JSON files in the browser, in a few lines of code. 

It goes very well with the [aframe-state-component](https://github.com/ngokevin/kframe/tree/master/components/state) to synchronise the state of the _InkJS_ runtime and the state in the _A-Frame_ application, because there should be only [one single source of truth in your application](https://redux.js.org/introduction/three-principles). That means when you keep [variables in _Ink_](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#part-3-variables-and-logic) they are automatically propagated to the registered application's _state_ and vice versa. The mapping of the state variables is done by their exact name. So be careful to name variables accordingly in the _Ink_ script and in your _initialState_ object!

##### Schema
| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| src | Asset link to the story _JSON_ file produced by the [Inky](https://github.com/inkle/inky) editor. | `undefined` |
| choice | The Ink _choice_ object to continue the storyline. Must be updated on each continuation of the story. Otherwise use the `continue` API. | `undefined` |

##### Events
| Name | Data | Description |
| -------- | ----------- | ------------- |
| ink-loaded | `{ story }` | Fired when the Ink story has been loaded. The _InkJS_ instance to programmatically work with the story is passed as the event data. |
| ink-continue | `{text, tags, choices }` | Fired when the Ink story has continued. The event data contains the current _text_ and _tags_ list (may be empty) and the available _choices_ object list (may be empty). The selected _choice_ object must be either passed to the `continue` API method or set on the _choice_ attribute of the component to continue the storyline. |
| ink-state-variable | `{ variable: value }` | Fired when the Ink story state variable has changed |

##### API
| Name | Data | Description |
| -------- | ----------- | ------------- |
| continue | _choiceIndex_ | Continues the story with the optional choice index. |


### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-ink-component/dist/aframe-ink-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity ink="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-ink-component
```

Then require and use.

```js
require('aframe');
require('aframe-ink-component');
```
