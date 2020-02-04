import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';
import { IMenu, ITool } from '../../../types';
import StateItem from './../StateItem';

type Props = {
  xOffSet?: number;
};

type State = {
  controlItems: IMenu[];
};

export default class FBBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      controlItems: [
        {
          name: 'Back',
          type: 'png',
          url: 'icons/back.png',
          background: false
        },
        {
          name: 'Forward',
          type: 'png',
          url: 'icons/forward.png',
          background: false
        }
      ]
    };
  }

  render() {
    const ControlButtonList = this.state.controlItems.map(
      (controlItem: IMenu, i: number) => (
        <StateItem key={`control-item-${i}`} menuInfo={controlItem} />
      )
    );
    const FBBar = styled.div`
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0px 18px 0 18px;
      margin-right: 64px;
    `;
    return <FBBar>{ControlButtonList}</FBBar>;
  }
}
