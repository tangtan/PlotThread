import React, { Component } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import { StateType, DispatchType } from '../../../types';
import { newProtocAction } from '../../../store/actions';
import { connect } from 'react-redux';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    newProtocAction: (id: any) => dispatch(newProtocAction(id))
  };
};

type Props = {
  visible: boolean;
  onCloseModal: any;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  name: string;
  multiple: boolean;
  action: string;
};

class OpenFile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: 'file',
      multiple: false,
      action: 'http://localhost:5050/api/upload' //'https://www.mocky.io/v2/5cc8019d300000980a055e76'
    };
  }

  onChange(info: any) {
    const { status, type } = info.file;
    if (status !== 'uploading') {
      //console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      switch (type) {
        case 'text/xml':
          this.openXml(info);
          break;
        case 'application/json':
          this.openJson(info);
          break;
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  openXml(info: any) {
    const id = info.file.response.data.identifier;
    this.props.newProtocAction(id);
  }
  openJson(info: any) {}
  render() {
    const { Dragger } = Upload;
    const { name, multiple, action } = this.state;
    return (
      <Modal
        style={{ top: 180 }}
        title="Open File"
        visible={this.props.visible}
        onOk={() => this.props.onCloseModal()}
        onCancel={() => this.props.onCloseModal()}
      >
        <Dragger
          name={name}
          multiple={multiple}
          action={action}
          method="post"
          onChange={info => this.onChange(info)}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Modal>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OpenFile);
