import React, { Component } from 'react';
import ToolBar from '../../toolbar';
import { ITool } from '../../../types';
import SettingPanel from './Setting';
import UploadPicModal from './UploadModal';

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
    return (
      <div>
        <ToolBar
          Top={0}
          Right={this.props.xOffSet || 0}
          Direction={'horizontal'}
          Tools={this.state.settingTools}
        />
        <SettingPanel />
        <UploadPicModal />
      </div>
    );
  }
}
