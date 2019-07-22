import React, { Component } from 'react';
import ToolItem from './ToolItem';
import './ToolBar.css';
import styled from 'styled-components';
import { ITool } from '../../types';

// add tool png-icons
// import move from '../../assets/move.png';

type Props = {
  Top?: number;
  Left?: number;
  Right?: number;
  Bottom?: number;
  Direction?: string;
  Hidden?: boolean;
  Tools: ITool[];
};

type State = {
  tools: ITool[];
};

export default class ToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tools: []
    };
  }

  render() {
    const transitionFlow =
      this.props.Left === 0
        ? 'left'
        : this.props.Right === 0
        ? 'right'
        : this.props.Top === 0
        ? 'top'
        : this.props.Bottom === 0
        ? 'bottom'
        : 'null';
    let width, height;
    let ToolListWrapperLeft,
      ToolListWrapperRight,
      ToolListWrapperTop,
      ToolListWrapperBottom;
    switch (transitionFlow) {
      case 'left':
        width = '60px';
        height = `calc(100vh - ${this.props.Top}px)`;
        ToolListWrapperLeft = this.props.Hidden ? -65 : this.props.Left;
        break;
      case 'right':
        width = '60px';
        height = `calc(100vh - ${this.props.Top}px)`;
        ToolListWrapperRight = this.props.Hidden ? -65 : this.props.Right;
        break;
      case 'top':
        width = `calc(100vw - ${this.props.Left}px)`;
        height = '60px';
        ToolListWrapperTop = this.props.Hidden ? -65 : this.props.Top;
        break;
      case 'bottom':
        width = `calc(100vw - ${this.props.Left}px)`;
        height = '60px';
        ToolListWrapperBottom = this.props.Hidden ? -65 : this.props.Bottom;
        break;
      default:
        break;
    }
    const ToolBarWrapper = styled.div`
      position: absolute;
      top: ${this.props.Top}px;
      left: ${this.props.Left}px;
      right: ${this.props.Right}px;
      bottom: ${this.props.Bottom}px;
      width: ${width};
      height: ${height};

      &:hover div {
        left: ${this.props.Left === 0 ? '0px' : ''};
        right: ${this.props.Right === 0 ? '0px' : ''};
        top: ${this.props.Top === 0 ? '0px' : ''};
        bottom ${this.props.Bottom === 0 ? '0px' : ''};
        transition: ${transitionFlow} 0.5s;
      }
    `;
    const ToolListWrapper = styled.div`
      position: absolute;
      left: ${ToolListWrapperLeft}px;
      right: ${ToolListWrapperRight}px;
      top: ${ToolListWrapperTop}px;
      bottom: ${ToolListWrapperBottom}px;
      width: ${width === '60px' ? width : ''};
      height: ${height === '60px' ? height : ''};
      padding: 5px;
      display: flex;
      flex-direction: ${this.props.Direction === 'horizontal'
        ? 'row'
        : 'column'};
      align-items: 'center';
      justify-content: 'space-between';
      background: #111;
      opacity: 0.7;
      border-radius: 5px;
    `;
    const toolList = this.props.Tools.map((tool: ITool, i: number) => (
      <ToolItem key={`tool-item-${i}`} toolInfo={tool} />
    ));
    return (
      <ToolBarWrapper>
        <ToolListWrapper>{toolList}</ToolListWrapper>
      </ToolBarWrapper>
    );
  }
}
