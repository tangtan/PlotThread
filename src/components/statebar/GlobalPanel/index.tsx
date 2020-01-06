import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GlobalPanel.css';
import { DispatchType, StateType } from '../../../types';
import { getToolState } from '../../../store/selectors';
import styled from 'styled-components';
import { Button, Divider, Tabs, Slider } from 'antd';
import { setTool } from '../../../store/actions';
const { TabPane } = Tabs;

const mapStateToProps = (state: StateType) => {
  return {
    visible: getToolState(state, 'Setting')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {};
type State = {
  top: number;
  width: number;
  //templates
};

class GlobalPanel extends Component<Props, State> {
  private rootElement = React.createRef<HTMLDivElement>();
  constructor(props: Props) {
    super(props);
    this.state = {
      top: 50,
      width: 300
    };
  }
  componentDidUpdate() {
    if (this.rootElement.current) {
      const node = this.rootElement.current;
      node.classList.toggle('is-nav-open');
    }
  }

  private onChange = () => {};

  private callback = () => {};
  render() {
    const { top, width } = this.state;
    // 隔离内部组件与Wrapper
    // Wrapper只负责弹出动画
    // top & width 属性需与CSS文件同步更新
    const Nav = styled.div`
      position: relative;
      width: ${width}px;
      height: calc(100vh - ${top}px);
      padding: 15px;
      background: #34373e;
      text-align: left;
    `;
    const heightIcon = (
      <img className="statebar-icon-img" src="icons/height.png" alt="height" />
    );
    const widthIcon = (
      <img className="statebar-icon-img" src="icons/width.png" alt="width" />
    );
    const settings = (
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
      <div className="panel" ref={this.rootElement}>
        <Nav className="nav">
          <Tabs onChange={this.callback} size="small">
            <TabPane tab="Settings" key="1">
              {settings}
            </TabPane>
            <TabPane tab="Templates" key="2">
              {/*{templates}*/}
            </TabPane>
            <TabPane key="3"></TabPane>
          </Tabs>
        </Nav>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GlobalPanel);
