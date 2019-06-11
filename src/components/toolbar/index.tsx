import React, { Component } from 'react';
import ToolItem from './ToolItem';
import './toolbar.css';

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
          name: 'move',
          type: 'tool',
          url: '../../assets/move.png'
        },
        {
          name: 'morph',
          type: 'tool',
          url: '../../assets/morph.png'
        },
        {
          name: 'adjust',
          type: 'tool',
          url: '../../assets/adjust.png'
        },
        {
          name: 'bend',
          type: 'tool',
          url: '../../assets/bend.png'
        },
        {
          name: 'stroke',
          type: 'tool',
          url: '../../assets/stroke.png'
        },
        {
          name: 'picture',
          type: 'tool',
          url: '../../assets/picture.png'
        }
      ]
    };
  }

  render() {
    const toolList = this.state.tools.map((tool: ITool) => (
      <ToolItem toolInfo={tool} />
    ));

    return (
      <div className="toolbar-wrapper">
        <div className="toolbar-icons-wrapper">{toolList}</div>
      </div>
    );
  }
}
