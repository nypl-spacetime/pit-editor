var React = require('react');
var EventsMixin = require('./events');

module.exports = React.createClass({
  mixins: [EventsMixin],

  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <section>
        <textarea id='json-textarea' />
      </section>
    );
  },

  componentDidMount: function() {
    var cm = CodeMirror.fromTextArea(document.getElementById('json-textarea'), {
      mode: 'application/json'
    });

    cm.on('change', this.change);
    this.enableEvents();

    this.setState({
      codemirror: cm
    });
  },

  componentDidUpdate: function() {
    this.disableEvents();

    var cm = this.state.codemirror;
    var pit = this.props.data.pit;

    if (cm && pit) {
      var cursor = cm.getCursor();
      cm.setValue(this.stringify(pit));
      cm.setCursor(cursor);
    }

    this.enableEvents();
  },

  stringify: function(pit) {
    return JSON.stringify(pit, null, 2);
  },

  change: function() {
    if (!this.allowEvents) {
      return;
    }

    var cm = this.state.codemirror;
    var pit;
    try {
      pit = JSON.parse(cm.getValue());
    } catch (e) {
      // DO NOTHING
    }

    if (pit) {
      this.props.update({
        line: this.props.data.line,
        pit: pit
      });
    }
  }

});
