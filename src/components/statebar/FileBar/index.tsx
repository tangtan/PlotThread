import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';

type Props = {
  xOffSet?: number;
};

type State = {};

export default class FileBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const FileBar = styled.div`
      position: absolute;
      top: 0;
      left: ${this.props.xOffSet || 0}px;
      width: 200px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 4px 4px 0 8px;
    `;
    return (
      <FileBar>
        <Button type="primary" size="large" shape="circle">
          <Icon type="file-add" style={{ fontSize: '22px' }} />
        </Button>
        <Button type="primary" size="large" shape="circle">
          <Icon type="save" style={{ fontSize: '22px' }} />
        </Button>
        <Button type="primary" size="large" shape="circle">
          <Icon type="download" style={{ fontSize: '22px' }} />
        </Button>
      </FileBar>
    );
  }
}
