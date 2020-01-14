import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType, ITool } from '../../../types';
import { getToolState } from '../../../store/selectors';
import { addVisualObject } from '../../../store/actions';
import ToolItem from '../../toolbar/ToolItem';
import styled from 'styled-components';

const mapStateToProps = (state: StateType) => {
  return {
    visible: getToolState(state, 'AddEventPop')
    //问题一：如何知道是否是刚画完的状态？是否需要加一个toolState表示该笔刚画完？
    //问题二：此处需要获取region的centerX 和 centerY，目前在"circleSelectionUtil的up函数中能获取到bounds.center的x，y坐标，是不是要把这个状态存到store里面？然后在此处获取？
    //groupCenterX: getRegionCenterX(state),
    //groupCenterY: getRegionCenterY(state),
  };
};

type Props = {
  centerX: number;
  centerY: number;
} & ReturnType<typeof mapStateToProps>;

type State = {
  eventTools: ITool[];
};

class AddEventPanel extends Component<Props, State> {
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
      <ToolItem key={`tool-item-${i}`} toolInfo={tool} />
    ));
    return this.props.visible ? (
      <EventToolWrapper>
        <EventToolListWrapper>{toolList}</EventToolListWrapper>
      </EventToolWrapper>
    ) : null;
  }
}
export default connect(mapStateToProps, null)(AddEventPanel);
