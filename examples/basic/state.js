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
    setChoice: function (state, action) {
      //console.log('STATE - set choice ' + action.choice);
      state.choice = action.choice;
    },
    'ink-continue': function (state, action) {
      AFRAME.utils.extend(state, action);
    },
    'ink-state-variable': function (state, action) {
      console.log('STATE - inkState', action);
      // copy variable into state
      AFRAME.utils.extend(state, action);
    }
  }
});
