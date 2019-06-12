import React, { Component } from 'react';
import { IMenu } from './index';
import '../../App.css';

type Props = {
  menuInfo: IMenu;
};

type State = {};

export default class MenuItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="menu-item-wrapper">{this.props.menuInfo.name}</div>;
  }
}
