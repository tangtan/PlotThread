import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../types';
import { Modal, Radio } from 'antd';
import { setTool, setObject, addVisualObject } from '../../../store/actions';
import { getToolState } from '../../../store/selectors';
import { Point } from 'paper';

const mapStateToProps = (state: StateType) => {
  return {
    isVisible: getToolState(state, 'SymbolStar')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeModal: () => dispatch(setTool('SymbolStar', false)),
    addShapeToRenderQueue: (type: string) => dispatch(addVisualObject(type)),
    closeObject: () => dispatch(setObject(new Point(-100, -100)))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  radioVal: string;
};

class ShapeModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      radioVal: 'circle'
    };
  }

  private handleOk = () => {
    // TODO: 完善 visual object 类型定义
    const visualObjType = this.state.radioVal;
    this.props.addShapeToRenderQueue(visualObjType);
    this.props.closeModal();
    this.props.closeObject();
  };

  private handleCancel = () => {
    this.props.closeModal();
    this.props.closeObject();
  };

  private handleChange = (e: any) => {
    this.setState({
      radioVal: e.target.value
    });
  };

  render() {
    return (
      <div className="shape-modal-wrapper">
        <Modal
          title="Basic Shapes"
          visible={this.props.isVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Radio.Group
            onChange={this.handleChange}
            defaultValue={this.state.radioVal}
          >
            <Radio value={'circle'}>Circle</Radio>
            <Radio value={'rectangle'}>Rectangle</Radio>
          </Radio.Group>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShapeModal);
