
AFRAME.registerComponent('choice-manager', {
  dependencies: ['ink'],
  schema: {
    choices: {
      type: 'array',
      default: []
    },
    tags: {
      type: 'array',
      default: []
    }
  },

  init: function () {
    this.entities = [];
  },

  update: function (oldData) {
    const el = this.el;
    const data = this.data;

    this.entities.forEach(e => {
      this.el.removeChild(e);
    });
    this.entities.length = 0;

    data.choices.forEach((c, i) => {
      const e = document.createElement('a-entity');
      e.setAttribute('mixin', 'answerText');
      e.setAttribute('text', 'value', c.text);
      e.setAttribute('position', `2 ${-i * 0.5} 0`);
      e.addEventListener('click', _ => {
        el.sceneEl.emit('setChoice', {choice: c});
      });
      el.appendChild(e);
      this.entities.push(e);
    });
  }

});
