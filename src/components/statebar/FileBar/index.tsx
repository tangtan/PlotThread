import React, { Component } from 'react';
import styled from 'styled-components';
import StateItem from './../StateItem';
import { IMenu } from '../../../types';

import OpenFile from './OpenFile';
import SaveFile from './SaveFile';

type Props = {
  xOffSet?: number;
};

type State = {
  fileItems: IMenu[];
  openFileVisible: boolean;
  saveFileVisible: boolean;
};

export default class FileBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openFileVisible: false,
      saveFileVisible: false,
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

  onShowModal(btn: string) {
    switch (btn) {
      case 'Open':
        this.setState({
          openFileVisible: true
        });
        break;
      case 'Save':
        this.setState({
          saveFileVisible: true
        });
      default:
        break;
    }
  }

  onCloseModal() {
    this.setState({
      openFileVisible: false,
      saveFileVisible: false
    });
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
        <div
          key={`state-item-${i}`}
          onClick={() => this.onShowModal(fileItem.name)}
        >
          <StateItem menuInfo={fileItem} />
        </div>
      )
    );
    return (
      <FileBar>
        <FileListWrapper>{FileButtonList}</FileListWrapper>
        <OpenFile
          visible={this.state.openFileVisible}
          onCloseModal={this.onCloseModal.bind(this)}
        />
        <SaveFile
          visible={this.state.saveFileVisible}
          onCloseModal={this.onCloseModal.bind(this)}
        />
      </FileBar>
    );
  }
}
