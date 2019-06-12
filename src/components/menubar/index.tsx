import React, { Component } from 'react';
import MenuItem from './MenuItem';

type Props = {};

type State = {
  menus: IMenu[];
};

export interface IMenu {
  name: string;
  type: string;
  url: string;
}

export default class MenuBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      menus: [
        {
          name: 'open',
          type: 'menu',
          url: ''
        },
        {
          name: 'add',
          type: 'menu',
          url: ''
        },
        {
          name: 'save',
          type: 'menu',
          url: ''
        },
        {
          name: 'download',
          type: 'menu',
          url: ''
        },
        {
          name: 'play',
          type: 'menu',
          url: ''
        },
        {
          name: 'undo',
          type: 'menu',
          url: ''
        },
        {
          name: 'redo',
          type: 'menu',
          url: ''
        }
      ]
    };
  }

  render() {
    const menuList = this.state.menus.map((menu: IMenu) => (
      <MenuItem menuInfo={menu} />
    ));
    return <div className="menu-bar-wrapper">{menuList}</div>;
  }
}
