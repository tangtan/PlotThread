import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { StateType } from '../../../types';
import { getSelectedVisualObjects } from '../../../store/selectors';
import { Select, InputNumber } from 'antd';
import { PointText } from 'paper';

const mapStateToProps = (state: StateType) => {
  return {
    selectedItems: getSelectedVisualObjects(state)
  };
};

type Props = {
  xOffSet?: number;
} & ReturnType<typeof mapStateToProps>;

type State = {};

class FontBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleTextChange(value: any, type: string) {
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
        <Select
          defaultValue="sans-serif"
          style={{ width: 120 }}
          onChange={val => this.handleTextChange(val, 'fontFamily')}
        >
          <Option value="sans-serif">Sans Serif</Option>
          <Option value="arial">Arial</Option>
          <Option value="times-new-roman">Times New Roman</Option>
        </Select>
        <InputNumber
          style={{ width: 60 }}
          min={1}
          max={500}
          defaultValue={12}
          onChange={val => this.handleTextChange(val, 'fontSize')}
        />
      </FontBar>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(FontBar);
