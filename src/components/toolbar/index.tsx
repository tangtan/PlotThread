import React, { Component } from 'react';
import ToolItem from './ToolItem';
import './ToolBar.css';
import styled from 'styled-components';
import { ITool } from '../../types';
import { connect } from 'react-redux';

type Props = {
  Top?: number;
  Left?: number;
  Right?: number;
  Bottom?: number;
  Direction?: string;
  Hidden?: boolean;
  Tools: ITool[];
};

type State = {};

class ToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const toolBarWidth = `${this.props.Tools.length * 60}px`;

    const ToolBarWrapper = styled.div`
      // position: ${this.props.Top === 0 ? '' : 'absolute'};
      display: flex;
      top: ${this.props.Top}px;
      left: ${this.props.Left}px;
      right: ${this.props.Right}px;
      bottom: ${this.props.Bottom}px;
    `;
    const ToolListWrapper = styled.div`
      height: ${this.props.Direction === 'vertical' ? toolBarWidth : '50px'};
      width: ${this.props.Direction === 'horizontal' ? toolBarWidth : '50px'};
      padding: ${this.props.Direction === 'vertical'
        ? '20px 2px 20px 2px'
        : '2px 18px 2px 18px'};
      display: flex;
      flex-direction: ${this.props.Direction === 'horizontal'
        ? 'row'
        : 'column'};
      align-items: center;
      justify-content: space-between;
      background: ${'#34373e'};
      opacity: 1;
      border-radius: ${this.props.Direction === 'vertical'
        ? '0 5px 5px 0'
        : '5px 5px 0 0'};
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

export default connect(null, null)(ToolBar);
