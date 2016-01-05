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
        <textarea id='ndjson-textarea'>
        </textarea>
      </section>
    );
  },

  componentDidMount: function() {
    var cm = CodeMirror.fromTextArea(document.getElementById('ndjson-textarea'), {
      mode: 'application/json',
      styleActiveLine: true,
      lineNumbers: true
    });

    var ndjson = localStorage.getItem('ndjson');
    if (ndjson) {
      cm.setValue(ndjson);
    }

    var line = localStorage.getItem('line');
    if (line) {
      cm.setCursor(parseInt(line), 0);
    }

    cm.on('change', this.change);
    cm.on('cursorActivity', this.changeLine);
    this.enableEvents();

    this.setState({
      codemirror: cm
    });
  },

  componentDidUpdate: function() {
    this.disableEvents();

    var line = this.props.data.line;
    var pit = this.props.data.pit;
    if (pit && line > 0) {
      var cm = this.state.codemirror;
      var str = JSON.stringify(pit);

      var oldLineLength = cm.getLine(line).length;

      var cursor = cm.getCursor();

      cm.replaceRange(str, {
        line: line,
        ch: 0
      }, {
        line: line,
        ch: oldLineLength
      });

      cm.setCursor(cursor);
    }

    this.enableEvents();
  },

  change: function() {
    var cm = this.state.codemirror;
    localStorage.setItem('ndjson', cm.getValue());
  },

  changeLine: function() {
    if (!this.allowEvents) {
      return;
    }

    var cm = this.state.codemirror;
    var cursor = cm.getCursor();
    var line = cursor.line;
    localStorage.setItem('line', line);

    var pit;
    try {
      pit = JSON.parse(cm.getLine(line));
    } catch (e) {
      // DO NOTHING
    }

    if (pit) {
      this.props.update({
        line: line,
        pit: pit
      });
    }
  }

});
