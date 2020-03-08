import React, { Component } from 'react';
import ToolBar from '../../toolbar';
import { ITool } from '../../../types';
import SettingPanel from './Setting';
import UploadPicModal from './UploadModal';
import ShapePanel from './Shape';
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
          name: 'Embellish',
          type: 'png',
          url: 'icons/embellish.png',
          subTools: []
        },
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
        <ShapePanel />
        <UploadPicModal />
      </div>
    );
  }
}
