import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';

type Props = {
  xOffSet?: number;
};

type State = {};

export default class FBBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const FBBar = styled.div`
      position: absolute;
      top: 0;
      left: ${this.props.xOffSet || 0}px;
      width: 200px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: 4px 4px 0 8px;
    `;
    return (
      <FBBar>
        <Button type="link" size="large" shape="circle" ghost>
          <Icon type="caret-left" style={{ fontSize: '26px' }} />
        </Button>
        <Button type="link" size="large" shape="circle" ghost>
          <Icon type="caret-right" style={{ fontSize: '26px' }} />
        </Button>
      </FBBar>
    );
  }
}
