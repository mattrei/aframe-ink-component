/* global AFRAME THREE */

const Story = require('inkjs').Story;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const INK_LOADED_EVENT = 'ink-loaded';
const INK_CONTINUE_EVENT = 'ink-continue';
const INK_STATE_VARIABLE_EVENT = 'ink-state-variable';

const STATE_UPDATE_EVENT = 'stateupdate';

AFRAME.registerComponent('ink', {
  schema: {
    src: {
      type: 'asset'
    },
    choice: {
      default: undefined
    },
    sync: {
      type: 'boolean',
      default: false
    }
  },

  multiple: false,

  init: function () {
    this.loader = new THREE.FileLoader();
    const el = this.el;

    this.stateUpdated = this.stateUpdated.bind(this);
    if (this.data.sync) {
      el.addEventListener(STATE_UPDATE_EVENT, this.stateUpdated); 
    }
  },

  update: function (oldData) {
    const data = this.data;
    const el = this.el;

    if (data.src && data.src !== oldData.src) {
      this.loader.load(data.src, (json) => {
        const story = new Story(json);

        this.inkStory = story;
        var inkVar;
        for (inkVar of story.variablesState._globalVariables.keys()) {
          story.ObserveVariable(inkVar, this._inkVarChanged.bind(this));
        }

        story.ResetState()
        this.continue();

        el.emit(INK_LOADED_EVENT, {
          story: story
        });
      });
    }

    if (this.data.choice && data.choice.index > -1) {
      this.continue(data.choice.index);
    }
  },

  _inkVarChanged: function (varName, newValue) {
    this.el.emit(INK_STATE_VARIABLE_EVENT, {
      [varName]: newValue
    });
  },

  stateUpdated: function (evt) {

    if (!this.inkStory || !this.data.sync) return;

    const state = evt.detail.state;
    var key;
    var inkKey;
    for (key in state) {
      // update ink state
      for (inkKey of this.inkStory.variablesState._globalVariables.keys()) {
        // state variable is also used in ink
        if (inkKey === key) {
          const inkVal = this.inkStory.variablesState[inkKey];
          if (!AFRAME.utils.deepEqual(inkVal, state[key])) {
            this.inkStory.variablesState[inkKey] = state[key];
          }
        }
      }
    }
  },

  remove: function () {
    if (this.data.sync) {
      this.el.removeEventListener(STATE_UPDATE_EVENT, this.stateUpdated); 
    }
  },

  continue: function (choice = -1) {
    // if (!this.inkStory) return;

    if (choice > -1) {
      this.inkStory.ChooseChoiceIndex(choice);
    }

    while (this.inkStory.canContinue) {
      this.inkStory.Continue();

      const choices = this.inkStory.currentChoices.map(c => {
        return {
          index: c.index,
          text: c.text
        };
      });

      const detail = {
        text: this.inkStory.currentText,
        tags: this.inkStory.currentTags,
        choices: choices
      }
      this.el.emit(INK_CONTINUE_EVENT, detail);
    }
  }

});
