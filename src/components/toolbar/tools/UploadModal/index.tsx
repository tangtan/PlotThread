import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import { Modal, Upload, Icon } from 'antd';
import { setTool, addVisualArray } from '../../../../store/actions';
import { getToolState } from '../../../../store/selectors';
import './UploadModal.css';
import { RcFile } from 'antd/lib/upload/interface';

const mapStateToProps = (state: StateType) => {
  return {
    isVisible: getToolState(state, 'SymbolPic')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeModal: () => dispatch(setTool('SymbolPic', false)),
    addShapeToRenderQueue: (array: string[]) => dispatch(addVisualArray(array))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  fileList: string[];
};

class UploadModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  private handleOk = () => {
    this.props.addShapeToRenderQueue(this.state.fileList);
    this.props.closeModal();
  };

  private handleCancel = () => {
    this.props.closeModal();
  };

  private handleUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const value = reader.result as string;
      this.setState({
        fileList: [...this.state.fileList, value]
      });
    };
    return false;
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="upload-modal-wrapper">
        <Modal
          title="Upload Shapes"
          visible={this.props.isVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Upload
            listType="picture-card"
            beforeUpload={this.handleUpload}
            className="upload-modal"
            multiple={true}
          >
            {uploadButton}
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadModal);
