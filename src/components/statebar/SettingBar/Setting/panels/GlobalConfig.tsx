import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../../types';
import { Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';

const mapStateToProps = (state: StateType) => {
  return {};
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  width: number;
  height: number;
};

class GlobalConfig extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      width: 1000,
      height: 372
    };
  }

  private onChange = () => {};
  private changeSpace(value: SliderValue) {
    let newHeight = 190 + (value as number) * 10;
    let newWidth = this.state.width;
    // let newProtocol = this.deepCopy(this.props.storyProtoc);
    // newProtocol.sessionInnerGap = value as number;
    // newProtocol.sessionOuterGap = 36 + (value as number);
    // newProtocol.scaleInfo = [
    //   { style: 'Scale', param: { width: newWidth, height: newHeight } }
    // ];
  }

  private changeWidth(value: SliderValue) {
    let newWidth = (1000 * (value as number)) / 100;
    let newHeight = this.state.height;
    // let newProtocol = this.deepCopy(this.props.storyProtoc);
    // newProtocol.scaleInfo = [
    //   { style: 'Scale', param: { width: newWidth, height: newHeight } }
    // ];
    // this.setState({
    //   width: newWidth
    // });
  }
  private changeHeight(value: SliderValue) {
    let newHeight = (372 * (value as number)) / 100;
    let newWidth = this.state.width;
    // let newProtocol = this.deepCopy(this.props.storyProtoc);
    // newProtocol.scaleInfo = [
    //   { style: 'Scale', param: { width: newWidth, height: newHeight } }
    // ];
    // this.setState({
    //   height: newHeight
    // });
  }
  deepCopy(x: any) {
    return JSON.parse(JSON.stringify(x));
  }
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
          <Slider
            max={50}
            min={0}
            defaultValue={18}
            onChange={this.onChange}
            onAfterChange={value => this.changeSpace(value)}
          />
        </div>
        <div className="settingbar-scale-wrapper">
          <div className="settingbar-content-title">Scale</div>
          <div className="settingbar-scale-width">
            {WidthIcon}
            <Slider
              max={150}
              min={50}
              defaultValue={100}
              onChange={this.onChange}
              onAfterChange={value => this.changeWidth(value)}
            />
          </div>
          <div className="settingbar-scale-height">
            {HeightIcon}
            <Slider
              max={150}
              min={50}
              defaultValue={100}
              onChange={this.onChange}
              onAfterChange={value => this.changeHeight(value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConfig);
