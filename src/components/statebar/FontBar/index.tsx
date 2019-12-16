import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { StateType } from '../../../types';
import { getSelectedVisualObjects } from '../../../store/selectors';
import { Select, Input } from 'antd';
import { PointText } from 'paper';
import './FontBar.css';
import { Slider, Popover } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {
    selectedItems: getSelectedVisualObjects(state)
  };
};

type Props = {
  xOffSet?: number;
} & ReturnType<typeof mapStateToProps>;

type State = {
  fontFamily: string;
  fontSize: number;
};

class FontBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fontFamily: 'Sans Serif',
      fontSize: 12
    };
  }

  handleSliderChange(value: any) {
    this.handleTextChange(value, 'fontSize');
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
    const text = <span>Font Size</span>;
    const FontBar = styled.div`
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 8px 4px 0 8px;
    `;
    const { Option } = Select;
    return (
      <FontBar>
        <Select
          value={this.state.fontFamily}
          style={{
            width: 150,
            margin: '0 10px',
            background: '#34373e',
            color: '#fff'
          }}
          onChange={val => this.handleTextChange(val, 'fontFamily')}
        >
          <Option value="sans-serif" style={{ color: '#fff' }}>
            Sans Serif
          </Option>
          <Option value="arial" style={{ color: '#fff' }}>
            Arial
          </Option>
          <Option value="times-new-roman" style={{ color: '#fff' }}>
            Times New Roman
          </Option>
        </Select>
        <Popover placement="topRight" title={text} content={content}>
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

export default connect(
  mapStateToProps,
  null
)(FontBar);
