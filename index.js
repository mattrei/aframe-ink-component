/* global AFRAME THREE */

const Story = require('inkjs').Story;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Ink component for A-Frame.
 */
AFRAME.registerComponent('ink', {
  schema: {
    src: {
      type: 'asset'
    },
    choice: {
      default: undefined
    }
  },

  multiple: false,

  init: function () {
    this.loader = new THREE.FileLoader();
  },

  update: function (oldData) {
    const data = this.data;
    const el = this.el;

    if (data.src !== oldData.src) {
      this.loader.load(data.src, (json) => {
        const story = new Story(json);
        el.emit('ink-loaded', {
          story: story
        });


        this.inkStory = story;
        this.continue();
      });
    }

    if (this.data.choice && data.choice.index > -1) {
      this.continue(data.choice.index);
    }
  },

  remove: function () {},

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

      this.el.emit('ink-continue', {
        text: this.inkStory.currentText,
        tags: this.inkStory.currentTags,
        choices: choices
      });
    }
  }
  
  /*,

  getInkStory: function () {
    return this.inkStory;
  }
  */
});

AFRAME.registerComponent('ink-state', {
  dependencies: ['ink'],
  schema: {},

  multiple: false,

  init: function () {

    const el = this.el;
    const system = el.sceneEl.systems.state;

    if (!system) {
      throw new Error('This component needs to have a registered state store with the aframe-state-component!')
    }


    el.addEventListener('ink-loaded', (evt) => {
      const inkStory = evt.detail.story;
      var key;
      var inkKey;
      for (key in this.system.state) {
        for (inkKey in inkStory.variablesState._globalVariables) {
          if (inkKey === key) {
            inkStory.ObserveVariable(inkKey, (varName, newValue) => {
              el.sceneEl.emit('inkState', {
                [varName]: newValue
              });
            });
          }
        }
      }

      this.inkStory = inkStory;
    });

    el.sceneEl.addEventListener('stateupdate', evt => {

      if (!this.inkStory) return;

      const state = evt.detail.state;
      var key;
      var inkKey;
      for (key in state) {
        // update ink state
        for (inkKey in this.inkStory.variablesState._globalVariables) {
          // state variable is also used in ink
          if (inkKey === key) {
            const inkVal = this.inkStory.variablesState[inkKey];
            if (!AFRAME.utils.deepEqual(inkVal, state[key])) {
              console.log('updating ' + inkKey);
              this.inkStory.variablesState[inkKey] = state[key];
            }
          }
        }
      }
    });


    el.addEventListener('ink-continue', (evt) => {
      const detail = evt.detail;
      const tags = detail.tags;

      // set state
      el.sceneEl.emit('currentStory', detail);
    });
  },

  update: function (oldData) {

  },

  remove: function () {
    this.el.sceneEl.removeEventListener('stateupdate', this);
  }
});
