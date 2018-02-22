AFRAME.registerState({
  initialState: {
    preset: 'forest',
    sphere: {
      visible: false,
      color: 'red'
    },
    box: {
      visible: false,
      size: 1
    },
    choice: undefined,
    text: '',
    choices: [],
    tags: []
  },

  handlers: {
    enemyMoved: function (state, action) {
      state.enemyPosition = action.newPosition;
    },

    setChoice: function (state, action) {
      console.log('STATE - set choice ' + action.choice);
      state.choice = action.choice;
    },
    currentStory: function (state, action) {
      console.log('STATE - currentStory');
      console.log(action);
      AFRAME.utils.extend(state, action);
    },
    inkState: function (state, action) {
      console.log('STATE - inkState');
      console.log(action);

        // copy variable into state
      AFRAME.utils.extend(state, action);
      console.log(state);
    }
  }
});
