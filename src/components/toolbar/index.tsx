import React, { Component } from 'react';
import ToolItem from './ToolItem';

type Props = {};

type State = {
  tools: ITool[];
};

export interface ITool {
  name: string;
  type: string;
  url: string;
}

export default class ToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tools: [
        {
          name: 'pan',
          type: 'tool',
          url: ''
        },
        {
          name: 'pen',
          type: 'tool',
          url: ''
        }
      ]
    };
  }

  render() {
    const toolList = this.state.tools.map((tool: ITool) => (
      <ToolItem toolInfo={tool} />
    ));

    return <div className="tool-bar-wrapper">{toolList}</div>;
  }
}
