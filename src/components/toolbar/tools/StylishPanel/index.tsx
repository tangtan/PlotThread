import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, ITool } from '../../../../types/index';
import { getToolState } from '../../../../store/selectors';
import StylishItem from './StylishItem';
import styled from 'styled-components';

const mapStateToProps = (state: StateType) => {
  return {
    visible: getToolState(state, 'StylishPop')
  };
};

type Props = {
  centerX: number;
  centerY: number;
} & ReturnType<typeof mapStateToProps>;

type State = {
  stylishTools: ITool[];
};

class StylishPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stylishTools: [
        {
          name: 'Wave',
          type: 'png',
          url: 'icons/wave.png',
          subTools: []
        },
        {
          name: 'Zigzag',
          type: 'png',
          url: 'icons/zigzag.png',
          subTools: []
        },
        {
          name: 'Dash',
          type: 'png',
          url: 'icons/dashed.png',
          subTools: []
        },
        {
          name: 'Bump',
          type: 'png',
          url: 'icons/wiggle.png',
          subTools: []
        }
      ]
    };
  }

  render() {
    const StylishToolWrapper = styled.div`
      position: absolute;
      justify-content: space-between;
      background: #34373e;
      align-items: center;
      border-radius: 5px;
      left: ${this.props.centerX}px;
      top: ${this.props.centerY}px;
      width: auto;
      padding: 5px 10px;
      height: auto;
    `;
    const StylishToolListWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      height: 100%;
    `;
    const toolList = this.state.stylishTools.map((tool: ITool, i: number) => (
      <StylishItem key={`tool-item-${i}`} toolInfo={tool} />
    ));
    return this.props.visible ? (
      <StylishToolWrapper>
        <StylishToolListWrapper>{toolList}</StylishToolListWrapper>
      </StylishToolWrapper>
    ) : null;
  }
}
export default connect(mapStateToProps, null)(StylishPanel);
