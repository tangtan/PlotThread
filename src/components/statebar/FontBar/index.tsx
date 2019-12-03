import React, { Component } from 'react';
import styled from 'styled-components';

import { Select, InputNumber } from 'antd';

type Props = {
  xOffSet?: number;
};

type State = {};

export default class FontBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const FontBar = styled.div`
      position: absolute;
      top: 0;
      left: ${this.props.xOffSet || 0}px;
      width: 200px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 8px 4px 0 8px;
    `;
    const { Option } = Select;
    return (
      <FontBar>
        <Select defaultValue="lucy" style={{ width: 120 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
        <InputNumber style={{ width: 60 }} min={1} max={10} defaultValue={3} />
      </FontBar>
    );
  }
}
