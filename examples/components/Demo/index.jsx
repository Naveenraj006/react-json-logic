import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactJsonLogic, { applyLogic } from '../../../dist';
import '../../../dist/style.css';

import Editor from '../Editor';
import style from './style.scss';

// PropTypes
const {
  bool, string, object, oneOfType,
} = PropTypes;
const propTypes = {
  title: string.isRequired,
  value: oneOfType([object, string]),
  data: object,
  async: bool,
};

const defaultProps = {
  value: {},
  data: {},
  async: false,
};

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      data: JSON.stringify(props.data, null, '\t'),
      result: 'Not Evaluated',
    };
    this.onLoad = this.onLoad.bind(this);
    this.onFieldValueChange = this.onFieldValueChange.bind(this);
    this.onAccessorDataChange = this.onAccessorDataChange.bind(this);
    this.onEvaluate = this.onEvaluate.bind(this);
  }

  onLoad() {
    const value = JSON.parse('{"==":[{"and":[{"==":["1","1"]},{"===":["0","0"]}]},"1"]}');
    this.setState({ value });
  }

  onFieldValueChange(value) { this.setState({ value }); }

  onAccessorDataChange(data) { this.setState({ data }); }

  onEvaluate() {
    const { value, data } = this.state;
    this.setState({ result: applyLogic(value, JSON.parse(data)) });
  }

  render() {
    const { async, title } = this.props;
    const { value, data, result } = this.state;

    return (
      <div className={style.Wrapper}>
        <h3>
          {title}
        </h3>

        {async
          && (
            <button
              style={{
                display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: 25,
              }}
              type="submit"
              onClick={() => this.onLoad()}
            >
              Load Values
            </button>
          )}

        <ReactJsonLogic
          data={data}
          value={value}
          onChange={this.onFieldValueChange}
        />

        <hr />

        <h4>Built Logic</h4>

        <Editor
          value={JSON.stringify(value, null, '\t')}
          onChange={(e) => {
            try {
              return this.onFieldValueChange(JSON.parse(e));
            } catch (err) {
              return '';
            }
          }}
        />

        <hr />

        <h4>
          Data for Accessor Fields

          <small>
            (Must be JSON)
          </small>
        </h4>

        <Editor
          value={data}
          onChange={this.onAccessorDataChange}
        />

        <button
          disabled={Object.keys(value).length === 0}
          onClick={this.onEvaluate}
          type="submit"
        >
          Evaluate
        </button>

        <hr />

        <b>Result:</b>
        {JSON.stringify(result)}

      </div>
    );
  }
}

Demo.propTypes = propTypes;
Demo.defaultProps = defaultProps;

export default Demo;
