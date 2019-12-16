import React, { Component } from 'react';
import ToolBar from '../../toolbar';
import { ITool } from '../../../types';
import SettingPanel from './SettingPanel';
import { Slider } from 'antd';

import { Popover, Divider } from 'antd';
import { Animated } from 'react-native';

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

  private onChange = () => {};

  render() {
    const text = <span>Setting</span>;
    const heightIcon = (
      <img className="statebar-icon-img" src="icons/height.png" alt="height" />
    );
    const widthIcon = (
      <img className="statebar-icon-img" src="icons/width.png" alt="width" />
    );
    const content = (
      <div className="settingbar-content-wrapper">
        <div className="settingbar-space-wrapper">
          <div className="settingbar-content-title">Space</div>
          <Slider max={100} min={0} onChange={this.onChange} />
        </div>
        <div className="settingbar-scale-wrapper">
          <div className="settingbar-content-title">Scale</div>
          <div className="settingbar-scale-width">
            {widthIcon}
            <Slider max={100} min={0} onChange={this.onChange} />
          </div>
          <div className="settingbar-scale-height">
            {heightIcon}
            <Slider max={100} min={0} onChange={this.onChange} />
          </div>
        </div>
      </div>
    );
    return (
      <Popover
        placement="bottomRight"
        content={content}
        title={text}
        trigger="click"
      >
        <div>
          <ToolBar
            Right={this.props.xOffSet || 0}
            Direction={'horizontal'}
            Tools={this.state.settingTools}
          ></ToolBar>
        </div>
      </Popover>
    );
  }
}
