import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../../types';
import { Slider } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {};
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

class GlobalConfig extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private onChange = () => {};

  render() {
    const HeightIcon = (
      <img className="statebar-icon-img" src="icons/height.png" alt="height" />
    );
    const WidthIcon = (
      <img className="statebar-icon-img" src="icons/width.png" alt="width" />
    );
    return (
      <div className="settingbar-content-wrapper">
        <div className="settingbar-space-wrapper">
          <div className="settingbar-content-title">Space</div>
          <Slider max={100} min={0} onChange={this.onChange} />
        </div>
        <div className="settingbar-scale-wrapper">
          <div className="settingbar-content-title">Scale</div>
          <div className="settingbar-scale-width">
            {WidthIcon}
            <Slider max={100} min={0} onChange={this.onChange} />
          </div>
          <div className="settingbar-scale-height">
            {HeightIcon}
            <Slider max={100} min={0} onChange={this.onChange} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConfig);
