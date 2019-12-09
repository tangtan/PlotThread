import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../types';
import { getToolState } from '../../../store/selectors';
import { setTool } from '../../../store/actions';
import styled from 'styled-components';

import { Drawer } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {
    settingState: getToolState(state, 'Setting')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeSetting: () => dispatch(setTool('Setting', false))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

class SettingPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { settingState, closeSetting } = this.props;
    return (
      <Drawer
        title="Setting"
        placement="right"
        closable={true}
        mask={false}
        visible={settingState}
        onClose={() => closeSetting()}
      >
        <p>TT...</p>
        <p>TT...</p>
        <p>TT...</p>
      </Drawer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingPanel);
