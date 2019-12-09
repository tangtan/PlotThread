import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'antd';
import StateItem from './../StateItem';
import { IMenu } from '../../../types';

type Props = {
  xOffSet?: number;
};

type State = {
  fileItems: IMenu[];
};

export default class FileBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fileItems: [
        {
          name: 'Open',
          type: 'png',
          url: 'icons/open.png',
          background: true
        },
        {
          name: 'Save',
          type: 'png',
          url: 'icons/save.png',
          background: true
        },
        {
          name: 'Download',
          type: 'png',
          url: 'icons/download.png',
          background: true
        }
      ]
    };
  }

  render() {
    const FileBar = styled.div`
      width: 200px;
    `;
    const FileListWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 0px 28px 0px 10px;
    `;

    const FileButtonList = this.state.fileItems.map(
      (fileItem: IMenu, i: number) => (
        <StateItem key={`tool-item-${i}`} menuInfo={fileItem} />
      )
    );
    return (
      <FileBar>
        <FileListWrapper>{FileButtonList}</FileListWrapper>
      </FileBar>
    );
  }
}
