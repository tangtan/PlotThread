import React, { Component } from 'react';
import { Modal, Input } from 'antd';

type Props = {
  visible: boolean;
  onCloseModal: any;
};

type State = {
  fileName: string;
};

export default class SaveFile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fileName: ''
    };
  }

  private handleInputChange = (e: any) => {
    this.setState({
      fileName: e.target.value
    });
    console.log(this.state.fileName);
  };

  render() {
    return (
      <Modal
        style={{ left: -150 }}
        title="Save File"
        visible={this.props.visible}
        onOk={() => {
          this.props.onCloseModal();
        }}
        onCancel={() => this.props.onCloseModal()}
      >
        <Input defaultValue="storyline" onChange={this.handleInputChange} />
      </Modal>
    );
  }
}
