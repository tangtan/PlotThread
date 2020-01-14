import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, ITool } from '../../../../types/index';
import { getToolState } from '../../../../store/selectors';
import StylishItem from './StylishItem';
import styled from 'styled-components';

const mapStateToProps = (state: StateType) => {
  return {
    visible: getToolState(state, 'AddEventPop')
  };
};

type Props = {
  centerX: number;
  centerY: number;
} & ReturnType<typeof mapStateToProps>;

type State = {
  eventTools: ITool[];
};

class StylishPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      eventTools: [
        {
          name: 'Collide',
          type: 'png',
          url: 'icons/collide.png',
          subTools: []
        },
        {
          name: 'Twine',
          type: 'png',
          url: 'icons/twine.png',
          subTools: []
        },
        {
          name: 'Merge',
          type: 'png',
          url: 'icons/merge.png',
          subTools: []
        },
        {
          name: 'Split',
          type: 'png',
          url: 'icons/split.png',
          subTools: []
        }
      ]
    };
  }

  render() {
    const EventToolWrapper = styled.div`
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
    const EventToolListWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      height: 100%;
    `;
    const toolList = this.state.eventTools.map((tool: ITool, i: number) => (
      <StylishItem key={`tool-item-${i}`} toolInfo={tool} />
    ));
    return this.props.visible ? (
      <EventToolWrapper>
        <EventToolListWrapper>{toolList}</EventToolListWrapper>
      </EventToolWrapper>
    ) : null;
  }
}
export default connect(mapStateToProps, null)(StylishPanel);
