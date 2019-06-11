import React, { Component } from 'react';
import { ITool } from './index';
import '../../App.css';

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
    return <div className="tool-item-wrapper">{this.props.toolInfo.name}</div>;
  }
}
