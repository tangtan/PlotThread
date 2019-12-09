import React, { Component } from 'react';
import { Modal, Upload, Icon, message } from 'antd';

type Props = {
  visible: boolean;
  onCloseModal: any;
};

type State = {
  name: string;
  multiple: boolean;
  action: string;
};

export default class OpenFile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: 'file',
      multiple: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
    };
  }

  onChange(info: any) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  render() {
    const { Dragger } = Upload;
    const { name, multiple, action } = this.state;
    return (
      <Modal
        title="Open File"
        visible={this.props.visible}
        onOk={() => this.props.onCloseModal()}
        onCancel={() => this.props.onCloseModal()}
      >
        <Dragger
          name={name}
          multiple={multiple}
          action={action}
          onChange={this.onChange}
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
