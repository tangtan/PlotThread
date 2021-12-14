import React, { Component } from 'react';
import styled from 'styled-components';
import StateItem from './../StateItem';
import { IMenu } from '../../../types';
import { DispatchType } from '../../../types';
import {
  setTool,
  loadStoryJson,
  cleanVisualObjects
} from '../../../store/actions';
import { Upload } from 'antd';
import SaveFile from './SaveFile';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    downloadPic: () => dispatch(setTool('DownloadPic', true)),
    openJson: (name: string, story: any) =>
      dispatch(loadStoryJson(name, story)),
    cleanRenderQueue: () => dispatch(cleanVisualObjects())
  };
};

type Props = {
  xOffSet?: number;
} & ReturnType<typeof mapDispatchToProps>;

type State = {
  fileItems: IMenu[];
  openFileVisible: boolean;
  saveFileVisible: boolean;
};

class FileBar extends Component<Props, State> {
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
        break;
      case 'Download':
        this.downloadPic();
        break;
      default:
        break;
    }
  }

  uploadStoryJson(info: any) {
    // clean canvas
    this.props.cleanRenderQueue();
    const { name } = info.file;
    const fileUrl = `json/${name}`;
    fetch(fileUrl)
      .then(response => response.json())
      .then(story => {
        this.props.openJson(name, story);
      })
      .catch(err => console.error(err));
  }

  downloadPic() {
    // only download within-window content
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas != null) {
      var image = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      var link = document.createElement('a') as HTMLAnchorElement;
      link.href = image;
      link.download = 'storyline.png';
      link.click();
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
      (fileItem: IMenu, i: number) => {
        if (fileItem.name === 'Open') {
          return (
            <Upload
              key={`state-item-${i}`}
              multiple={false}
              showUploadList={false}
              onChange={info => this.uploadStoryJson(info)}
            >
              <StateItem menuInfo={fileItem} />
            </Upload>
          );
        } else {
          return (
            <div
              key={`state-item-${i}`}
              onClick={() => this.onShowModal(fileItem.name)}
            >
              <StateItem menuInfo={fileItem} />
            </div>
          );
        }
      }
    );
    return (
      <FileBar>
        <FileListWrapper>{FileButtonList}</FileListWrapper>
        <SaveFile
          visible={this.state.saveFileVisible}
          onCloseModal={this.onCloseModal.bind(this)}
        />
      </FileBar>
    );
  }
}

export default connect(null, mapDispatchToProps)(FileBar);
