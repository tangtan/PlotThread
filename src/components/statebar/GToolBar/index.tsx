import React, { Component } from 'react';
import ToolBar from '../../toolbar';
import { ITool } from '../../../types';

type Props = {
  xOffSet?: number;
};

type State = {
  topTools: ITool[];
};

export default class GToolBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      topTools: [
        {
          name: 'Zoom',
          type: 'png',
          url: 'icons/zoom.png',
          subTools: []
        },
        // {
        //   name: 'Move',
        //   type: 'png',
        //   url: 'icons/move.png',
        //   subTools: []
        // },
        {
          name: 'Timeline',
          type: 'png',
          url: 'icons/timeline.png',
          subTools: []
        },
        {
          name: 'Preview',
          type: 'png',
          url: 'icons/preview.png',
          subTools: []
        }
      ]
    };
  }

  render() {
    return (
      <ToolBar
        Top={0}
        Left={this.props.xOffSet || 0}
        Direction={'horizontal'}
        Tools={this.state.topTools}
      />
    );
  }
}
