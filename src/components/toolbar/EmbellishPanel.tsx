import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { getToolState } from '../../store/selectors';
import { setTool } from '../../store/actions';
import UploadModal from './tools/UploadModal';
import ShapeModal from './tools/ShapeModal';
import { Drawer } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {
    bellishState: getToolState(state, 'Bellish')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeBellish: () => dispatch(setTool('Bellish', false))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

class EmbellishPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { bellishState, closeBellish } = this.props;
    return (
      <Drawer
        title="Embellish"
        placement="right"
        width="40vw"
        closable={true}
        mask={false}
        visible={bellishState}
        onClose={() => closeBellish()}
      >
        <UploadModal />
        <ShapeModal />
        <p>TT...</p>
        <p>TT...</p>
        <p>TT...</p>
      </Drawer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbellishPanel);
