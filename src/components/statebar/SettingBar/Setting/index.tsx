import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Setting.css';
import { DispatchType, StateType } from '../../../../types';
import { getToolState } from '../../../../store/selectors';
import styled from 'styled-components';
import { Tabs } from 'antd';

import Embellish from './panels/Embellish';
import GlobalConfig from './panels/GlobalConfig';
import Template from './panels/Template';

const { TabPane } = Tabs;

const mapStateToProps = (state: StateType) => {
  return {
    visible: getToolState(state, 'Setting')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps>;

type State = {
  top: number;
  width: number;
};

class GlobalPanel extends Component<Props, State> {
  private rootElement = React.createRef<HTMLDivElement>();
  constructor(props: Props) {
    super(props);
    this.state = {
      top: 50,
      width: 350
    };
  }

  componentDidUpdate() {
    if (this.rootElement.current) {
      const node = this.rootElement.current;
      node.classList.toggle('is-nav-open');
    }
  }

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

    return (
      <div className="panel" ref={this.rootElement}>
        <Nav className="nav">
          <Tabs onChange={this.callback} size="small">
            <TabPane tab="Shapes" key="1">
              <Embellish />
            </TabPane>
            <TabPane tab="Config" key="3">
              <GlobalConfig />
            </TabPane>
            <TabPane tab="AI" key="2">
              <Template />
            </TabPane>
          </Tabs>
        </Nav>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GlobalPanel);
