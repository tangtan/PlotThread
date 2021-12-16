import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../types';
import { setTool } from '../../../store/actions';
import { getSelectedVisualObjects } from '../../../store/selectors';
import { Input, Slider, Popover, Menu, Dropdown, Button } from 'antd';
import { PointText } from 'paper';
import './FontBar.css';

const mapStateToProps = (state: StateType) => {
  return {
    selectedItems: getSelectedVisualObjects(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {
  xOffSet?: number;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  fontFamily: string;
  fontSize: number;
};

class FontBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fontFamily: 'sans-serif',
      fontSize: 12
    };
  }

  handleTextChange(value: any, type: string) {
    if (type === 'fontFamily') {
      this.setState({
        fontFamily: value,
        fontSize: this.state.fontSize
      });
    } else {
      this.setState({
        fontFamily: this.state.fontFamily,
        fontSize: value
      });
    }
    // console.log(value, this.props.selectedItems);
    const selectedTexts = this.props.selectedItems.filter(
      item => item.data.type === 'text' || 'freetext'
    );
    selectedTexts.forEach(item => {
      const _textItem = item.firstChild as PointText;
      switch (type) {
        case 'fontFamily':
          _textItem.fontFamily = value;
          break;
        case 'fontSize':
          _textItem.fontSize = value;
          break;
        default:
          break;
      }
    });
  }

  render() {
    const content = (
      <Slider
        max={200}
        min={1}
        defaultValue={this.state.fontSize}
        onAfterChange={val => this.handleTextChange(val, 'fontSize')}
      />
    );
    const FontBar = styled.div`
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 8px 0px 0 8px;
    `;
    const PopoverTitle = styled.h3`
      color: #fff;
    `;
    const TitleText = <PopoverTitle>Font Size</PopoverTitle>;
    const menu = (
      <Menu onClick={({ key }) => this.handleTextChange(key, 'fontFamily')}>
        <Menu.Item key="sans-serif" style={{ color: '#fff' }}>
          sans-serif
        </Menu.Item>
        <Menu.Item key="arial" style={{ color: '#fff' }}>
          arial
        </Menu.Item>
        <Menu.Item key="times-new-roman" style={{ color: '#fff' }}>
          times-new-roman
        </Menu.Item>
      </Menu>
    );
    return (
      <FontBar>
        <Button
          shape="circle"
          onClick={() => {
            this.props.activateTool('Text', true);
          }}
        >
          文
        </Button>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            style={{
              width: 150,
              margin: '0 10px',
              background: '#34373e',
              color: '#fff'
            }}
          >
            {this.state.fontFamily}
          </Button>
        </Dropdown>
        <Popover
          placement="topRight"
          style={{ width: 150 }}
          title={TitleText}
          content={content}
        >
          <Input
            style={{ width: 50, textAlign: 'center' }}
            min={1}
            max={200}
            value={this.state.fontSize}
          />
        </Popover>
      </FontBar>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FontBar);
