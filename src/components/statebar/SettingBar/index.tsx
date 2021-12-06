import React, { Component } from 'react';
import ToolItem from '../../toolbar/ToolItem';
import { ITool } from '../../../types';
import SettingPanel from './Setting';
import UploadPicModal from './UploadModal';
import styled from 'styled-components';

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
    const Settingbar = styled.div`
      width: 80px;
    `;
    const ButtonListWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: left;
      margin-left: 10px;
      padding: 0px 10px 0px 10px;
    `;

    const ButtonList = this.state.settingTools.map(
      (fileItem: ITool, i: number) => (
        <div key={`state-item-${i}`}>
          <ToolItem toolInfo={fileItem} />
        </div>
      )
    );

    return (
      <div>
        <Settingbar>
          <ButtonListWrapper>{ButtonList}</ButtonListWrapper>
        </Settingbar>
        <SettingPanel />
        <UploadPicModal />
      </div>
    );
  }
}
