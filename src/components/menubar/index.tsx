import React, { Component } from 'react';
import MenuItem from './MenuItem';
import './MenuBar.css';

import file from '../../assets/file.png';
import add from '../../assets/add.png';
import save from '../../assets/save.png';
import download from '../../assets/download.png';
import play from '../../assets/play.png';
import undo from '../../assets/undo.png';
import redo from '../../assets/redo.png';

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
          name: 'file',
          type: 'menu',
          url: file
        },
        {
          name: 'add',
          type: 'menu',
          url: add
        },
        {
          name: 'save',
          type: 'menu',
          url: save
        },
        {
          name: 'download',
          type: 'menu',
          url: download
        }
        /*{
          name: 'play',
          type: 'menu',
          url: play
        },
        {
          name: 'undo',
          type: 'menu',
          url: undo
        },
        {
          name: 'redo',
          type: 'menu',
          url: redo
        }*/
      ]
    };
  }

  render() {
    const menuList = this.state.menus.map((menu: IMenu) => (
      <MenuItem menuInfo={menu} />
    ));
    return (
      <div className="menu-bar-wrapper">
        <div className="menu-bar-icons-wrapper">{menuList}</div>
      </div>
    );
  }
}
