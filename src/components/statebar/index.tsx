import React, { Component } from 'react';
import styled from 'styled-components';

import FileBar from './FileBar';
import FBBar from './FBBar';
import GToolBar from './GToolBar';
import StyleBar from './StyleBar';
import FontBar from './FontBar';
import SettingBar from './SettingBar';

type Props = {};

type State = {};

export default class StateBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const StateBar = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 50px;
      background-color: #34373e;
      display: flex;
      flex-direction: row-reverse;
    `;
    const StateWrapper = styled.div`
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      justify-content: space-between;
      align-items: center;
    `;
    const RightMenuWrapper = styled.div`
      display: flex;
      flex-direction: row;
      width: auto;
      height: auto;
    `;
    return (
      <StateBar>
        <StateWrapper>
          <FileBar />
          <FBBar xOffSet={250} />
          <GToolBar xOffSet={450} />

          <RightMenuWrapper>
            <StyleBar xOffSet={750} />
            <FontBar xOffSet={850} />
            <SettingBar xOffSet={-50} />
          </RightMenuWrapper>
        </StateWrapper>
      </StateBar>
    );
  }
}
