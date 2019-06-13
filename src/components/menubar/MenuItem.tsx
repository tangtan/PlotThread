import React, { Component } from 'react';
import { IMenu } from './index';
import './MenuBar.css';
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
    const menuList = this.props.menuInfo;
    return (
      <div className="menu-bar-icon-box">
        <img
          className="menu-bar-icon-pic"
          src={this.props.menuInfo.url}
          alt={this.props.menuInfo.name}
        />
      </div>
    );
  }
}
