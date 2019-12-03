import React, { Component } from 'react';
import styled from 'styled-components';

type Props = {
  xOffSet?: number;
};

type State = {};

export default class StyleBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const FileBar = styled.div`
      position: absolute;
      top: 0;
      left: ${this.props.xOffSet || 0}px;
      width: 100px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      padding: 10px 4px 0 8px;
    `;
    const FillBtn = styled.div`
      flex: 0 1 30px;
      height: 30px;
      border-radius: 15px;
      background: rgb(0, 144, 244);
    `;
    const StrokeBtn = styled.div`
      flex: 0 1 30px;
      height: 30px;
      border-radius: 15px;
      border: 6px solid rgb(144, 244, 4);
    `;
    return (
      <FileBar>
        <StrokeBtn />
        <FillBtn />
      </FileBar>
    );
  }
}
