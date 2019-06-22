import React, { Component } from 'react';
import ToolItem from './ToolItem';
import './ToolBar.css';

// add tool icons
import move from '../../assets/move.png';
import morph from '../../assets/morph.png';
import adjust from '../../assets/adjust.png';
import bend from '../../assets/bend.png';
import stroke from '../../assets/stroke.png';
import picture from '../../assets/picture.png';

type Props = {};

type State = {
  tools: ITool[];
};

export interface ITool {
  name: string;
  type: string;
  url: string;
  subTools: string[];
}

export default class ToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tools: [
        {
          name: 'move',
          type: 'tool',
          url: move,
          subTools: []
        },
        {
          name: 'bend',
          type: 'tool',
          url: bend,
          subTools: ['bend', 'scale']
        },
        {
          name: 'morph',
          type: 'tool',
          url: morph,
          subTools: ['twine', 'converge', 'separate']
        },
        {
          name: 'adjust',
          type: 'tool',
          url: adjust,
          subTools: ['whole', 'single']
        },
        {
          name: 'stroke',
          type: 'tool',
          url: stroke,
          subTools: ['stroke', 'style']
        },
        {
          name: 'picture',
          type: 'tool',
          url: picture,
          subTools: []
        }
      ]
    };
  }

  render() {
    const toolList = this.state.tools.map((tool: ITool, i: number) => (
      <ToolItem key={`tool-item-${i}`} toolInfo={tool} />
    ));

    return (
      <div className="toolbar-wrapper">
        <div className="toolbar-icons-wrapper">{toolList}</div>
      </div>
    );
  }
}
