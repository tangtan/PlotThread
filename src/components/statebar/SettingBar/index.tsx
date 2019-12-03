import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';

type Props = {
  xOffSet?: number;
};

type State = {};

export default class SettingBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const ToolBar = styled.div`
      flex: 0 1 70px;
      padding: 4px 4px 0 8px;
    `;
    return (
      <ToolBar>
        <Button type="link" size="large" ghost>
          <Icon type="appstore" style={{ fontSize: '26px' }} />
        </Button>
      </ToolBar>
    );
  }
}
