import React, { Component } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import { loadStoryFile, loadStoryJson } from '../../../store/actions';
import { StateType, DispatchType } from '../../../types';
import { connect } from 'react-redux';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    openFile: (fileUrl: string, fileType: string) =>
      dispatch(loadStoryFile(fileUrl, fileType)),
    openJson: (story: any) => dispatch(loadStoryJson(story))
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
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76' // Pretend to upload
    };
  }

  onChange(info: any) {
    const { status, type } = info.file;
    // if (status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      switch (type) {
        case 'text/xml':
          this.openXMLFile(info);
          break;
        case 'application/json':
          // this.openJSONFile(info);
          this.openJSONData(info);
          break;
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  openXMLFile(info: any) {
    const fileUrl = `xml/${info.file.name}`;
    this.props.openFile(fileUrl, 'xml');
  }
  openJSONFile(info: any) {
    const fileUrl = `json/${info.file.name}`;
    this.props.openFile(fileUrl, 'json');
  }

  openJSONData(info: any) {
    const fileUrl = `json/${info.file.name}`;
    fetch(fileUrl)
      .then(response => response.json())
      .then(story => {
        this.props.openJson(story);
      })
      .catch(err => console.error(err));
  }

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
