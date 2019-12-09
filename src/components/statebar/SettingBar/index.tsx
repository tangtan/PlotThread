import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';
import ToolBar from '../../toolbar';
import { ITool } from '../../../types';

type Props = {
  xOffSet?: number;
};

type State = {
  settingTools: ITool[];
};

export default class SettingBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      settingTools: [
        {
          name: 'Setting',
          type: 'png',
          url: 'icons/setting.png',
          subTools: []
        }
      ]
    };
  }

  render() {
    // const ToolBar = styled.div`
    //   display: flex;
    //   flex-direction: row;
    //   align-items: center;
    //   justify-content: center;
    // `;

    return (
      <ToolBar
        Right={this.props.xOffSet || 0}
        Direction={'horizontal'}
        Tools={this.state.settingTools}
      />
    );
  }
}
