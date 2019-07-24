import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../types';
import { Modal, Upload, Icon } from 'antd';
import { setTool, addVisualObject } from '../../../store/actions';
import { getToolState } from '../../../store/selectors';

const mapStateToProps = (state: StateType) => {
  return {
    isVisible: getToolState(state, 'SymbolPic')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeModal: () => dispatch(setTool('SymbolPic', false)),
    addShapeToRenderQueue: (type: string) => dispatch(addVisualObject(type))
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
  };

  private handleCancel = () => {
    this.props.closeModal();
  };

  private handleChange = (e: any) => {
    this.setState({
      radioVal: e.target.value
    });
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="shape-modal-wrapper">
        <Modal
          title="Upload Shapes"
          visible={this.props.isVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Upload listType="picture-card">{uploadButton}</Upload>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShapeModal);
