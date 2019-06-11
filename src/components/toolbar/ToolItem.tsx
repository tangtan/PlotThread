import React, { Component } from 'react';
import { ITool } from './index';
import './toolbar.css';

type Props = {
  toolInfo: ITool;
};

type State = {};

export default class ToolItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.toolInfo.url);
    return (
      <div className="toolbar-icon-box">
        <img
          className="toolbar-icon-pic"
          src={require('../../assets/' +
            `${this.props.toolInfo.name}` +
            '.png')}
        />
      </div>
    );
  }
}
