import React, { Component } from 'react';
import styled from 'styled-components';
import { DispatchType, StateType } from '../../../types';
import { setTool } from '../../../store/actions';
import { getSelectedItemColor } from '../../../store/selectors';
import { connect } from 'react-redux';
import StyleModal from './StyleModal';
import StrokePicker from './StrokePicker';
import { Button } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {
    strokeColor: getSelectedItemColor(state, 'StrokeColor'),
    fillColor: getSelectedItemColor(state, 'FillColor')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {
  xOffSet?: number;
} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

type State = {
  isStrokeClicked: boolean;
  isFillClicked: boolean;
};

class StyleBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isStrokeClicked: false,
      isFillClicked: false
    };
  }

  private onClick = (toolName: string) => {
    // 同步工具状态
    const strokeToolName = 'StrokeStyle';
    const fillToolName = 'FillStyle';
    if (toolName === strokeToolName) {
      const isStrokeUse = !this.state.isStrokeClicked;
      this.props.activateTool(strokeToolName, isStrokeUse);
      this.setState({
        isStrokeClicked: isStrokeUse,
        isFillClicked: false
      });
    } else {
      const isFillUse = !this.state.isFillClicked;
      this.props.activateTool(fillToolName, isFillUse);
      this.setState({
        isStrokeClicked: false,
        isFillClicked: isFillUse
      });
    }
  };

  render() {
    const FileBar = styled.div`
      width: 200px;
      height: 50px;
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding: 0px 0px 0 8px;
    `;
    const BtnWrapper = styled.div`
      flex: 0 1 30px;
      height: 30px;
      margin: 0 1px;
    `;

    return (
      <FileBar>
        <BtnWrapper>
          <Button
            shape="circle"
            onClick={() => {
              this.onClick('FillStyle');
            }}
          >
            F
          </Button>
        </BtnWrapper>
        <BtnWrapper>
          <Button
            shape="circle"
            type="dashed"
            onClick={() => {
              this.onClick('StrokeStyle');
            }}
          >
            S
          </Button>
        </BtnWrapper>
        <StrokePicker xOffSet={20} />
        <StyleModal xOffSet={-100} />
      </FileBar>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StyleBar);
