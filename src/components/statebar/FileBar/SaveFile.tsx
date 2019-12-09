import React, { Component } from 'react';
import { Modal } from 'antd';

type Props = {
  visible: boolean;
  onCloseModal: any;
};

type State = {};

export default class SaveFile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal
        title="Save File"
        visible={this.props.visible}
        onOk={() => this.props.onCloseModal()}
        onCancel={() => this.props.onCloseModal()}
      >
        <p>TT</p>
      </Modal>
    );
  }
}
