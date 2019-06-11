import React, { Component } from 'react';

type Props = {};

type State = {};

export default class ToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="tool-bar-wrapper" />;
  }
}
