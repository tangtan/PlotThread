import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import { Modal, Upload, Icon } from 'antd';
import { setTool, addVisualArray } from '../../../../store/actions';
import { getToolState } from '../../../../store/selectors';
import './UploadModal.css';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

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
  fileList: UploadFile[];
};

class UploadModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  private handleOk = () => {
    const list: string[] = [];
    this.state.fileList.forEach(file => {
      if (file.url) {
        list.push(file.url);
      }
    });
    this.props.addShapeToRenderQueue(list);
    this.setState({
      fileList: []
    });
    this.props.closeModal();
  };

  private handleCancel = () => {
    this.setState({
      fileList: []
    });
    this.props.closeModal();
  };

  private handleUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const value = reader.result as string;
      const upload = file as UploadFile;
      upload.url = value;
      this.setState({
        fileList: [...this.state.fileList, upload]
      });
    };
    return false;
  };

  private handleRemove = (file: UploadFile) => {
    const index = this.state.fileList.indexOf(file);
    this.setState({
      fileList: [
        ...this.state.fileList.slice(0, index),
        ...this.state.fileList.slice(index + 1)
      ]
    });
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
            showUploadList={{ showRemoveIcon: true, showPreviewIcon: false }}
            fileList={this.state.fileList}
            onRemove={this.handleRemove}
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
