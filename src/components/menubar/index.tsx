import React, { Component } from 'react';
import RadialMenu from 'react-radial-menu';
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
  center: IMenu;
  menus: IMenu[];
  distance: number;
  beginDeg: number;
  endDeg: number;
};

export interface IMenu {
  name: string;
  type: string;
  image: string;
}

export default class MenuBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      center: {
        name: 'add',
        type: 'menu',
        image: `url(${add})`
      },
      menus: [
        {
          name: 'file',
          type: 'menu',
          image: `url(${file})`
        },
        {
          name: 'save',
          type: 'menu',
          image: `url(${save})`
        },
        {
          name: 'download',
          type: 'menu',
          image: `url(${download})`
        }
      ],
      distance: 50,
      beginDeg: 0,
      endDeg: 90
    };
  }

  render() {
    const { center, menus, distance, beginDeg, endDeg } = this.state;
    return (
      <div className={'menu-bar-wrapper'}>
        <RadialMenu
          items={menus}
          center={center}
          distance={distance}
          itemsSize={distance}
          beginDeg={beginDeg}
          endDeg={endDeg}
        />
      </div>
    );
  }
}
