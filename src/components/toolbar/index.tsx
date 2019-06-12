import React, { Component } from 'react';
import ToolItem from './ToolItem';
import './toolbar.css';

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
}

export default class ToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tools: [
        {
          name: 'move',
          type: 'tool',
          url: move
        },
        {
          name: 'morph',
          type: 'tool',
          url: morph
        },
        {
          name: 'adjust',
          type: 'tool',
          url: adjust
        },
        {
          name: 'bend',
          type: 'tool',
          url: bend
        },
        {
          name: 'stroke',
          type: 'tool',
          url: stroke
        },
        {
          name: 'picture',
          type: 'tool',
          url: picture
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
