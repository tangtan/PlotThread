import React, { Component } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import { StateType, DispatchType } from '../../../types';
import { newProtocAction, addAction } from '../../../store/actions';
import { connect } from 'react-redux';
import { iStoryline } from 'iStoryline';
const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    newProtocAction: (id: any) => dispatch(newProtocAction(id)),
    addAction: (protoc: any, layout: any, scale: number) =>
      dispatch(addAction(protoc, layout, scale))
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
  storyLayouter: any;
};

class OpenFile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: 'file',
      multiple: false,
      action: 'http://localhost:5050/api/upload', //'https://www.mocky.io/v2/5cc8019d300000980a055e76'
      storyLayouter: new iStoryline()
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
  openJson(info: any) {
    const url = '/json/' + info.file.name;
    fetch(url)
      .then(response => response.json()) //解析为可读数据
      .then(data => this.loadData(data)) //执行结果是 resolve就调用then方法
      .catch(err => console.log('Error!', err)); //执行结果是 reject就调用catch方法
  }
  loadData(data: any) {
    const graph = this.state.storyLayouter._layout(data.data, data.protoc);
    this.props.addAction(data.protoc, data.data, graph.scaleRate);
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
