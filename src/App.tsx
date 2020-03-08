///<reference path="../node_modules/@types/react-redux/index.d.ts"/>
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import 'antd/dist/antd.css';

import ToolBar from './components/toolbar';
import StateBar from './components/statebar';
import DrawCanvas from './components/canvas/DrawCanvas';
import AIBTN from './components/TemplateBTN';
import { ITool } from './types';

type Props = {};

type State = {
  leftTools: ITool[];
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      leftTools: [
        // {
        //   name: 'Comb',
        //   type: 'png',
        //   url: 'icons/comb.png',
        //   subTools: []
        // },
        {
          name: 'Repel',
          type: 'png',
          url: 'icons/repel.png',
          subTools: []
        },
        {
          name: 'Attract',
          type: 'png',
          url: 'icons/attract.png',
          subTools: []
        },
        {
          name: 'Transform',
          type: 'png',
          url: 'icons/transform.png',
          subTools: []
        },
        {
          name: 'Relate',
          type: 'png',
          url: 'icons/relate.png',
          subTools: [
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
            // {
            //   name: 'Knot',
            //   type: 'png',
            //   url: 'icons/knot.png',
            //   subTools: []
            // },
            {
              name: 'Merge',
              type: 'png',
              url: 'icons/knot.png',
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
        },
        {
          name: 'Stylish',
          type: 'png',
          url: 'icons/stroke.png',
          subTools: [
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
        },
        {
          name: 'Bend',
          type: 'png',
          url: 'icons/bend.png',
          subTools: []
        },
        {
          name: 'Compress',
          type: 'png',
          url: 'icons/expand.png',
          subTools: []
        },
        {
          name: 'Text',
          type: 'png',
          url: 'icons/label.png',
          subTools: []
        },
        {
          name: 'Sort',
          type: 'png',
          url: 'icons/sort.png',
          subTools: []
        }
      ]
    };
  }

  componentDidMount() {
    document.onselectstart = () => {
      return false;
    };
  }

  render() {
    const { leftTools } = this.state;
    return (
      <div className="App">
        <DrawCanvas />
        <StateBar />
        <ToolBar
          Bottom={0}
          Left={500}
          Direction={'horizontal'}
          Tools={leftTools}
        />
        <AIBTN />
      </div>
    );
  }
}

export default connect(null, null)(App);
