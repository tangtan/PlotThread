///<reference path="../node_modules/@types/react-redux/index.d.ts"/>
import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import 'antd/dist/antd.css';
// State & Tool bars
import ToolBar from './components/toolbar';
import StateBar from './components/statebar';
// Canvas
import ToolCanvas from './components/canvas/ToolCanvas';
import StoryFlowCanvas from './components/canvas/StoryFlowCanvas';
// Panels
import AddEventPanel from './components/toolbar/tools/AddEventPanel';
import StylishPanel from './components/toolbar/tools/StylishPanel';
import UploadModal from './components/toolbar/tools/UploadModal';
import EmbellishPanel from './components/toolbar/tools/EmbellishPanel';
import GlobalPanel from './components/toolbar/tools/GlobalPanel';
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
        {
          name: 'AddActor',
          type: 'png',
          url: 'icons/actor.png',
          subTools: []
        },
        {
          name: 'AddEvent',
          type: 'png',
          url: 'icons/event.png',
          subTools: []
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
          name: 'Reshape',
          type: 'png',
          url: 'icons/reshape.png',
          subTools: []
        },
        {
          name: 'Text',
          type: 'png',
          url: 'icons/label.png',
          subTools: []
        },
        {
          name: 'Stylish',
          type: 'png',
          url: 'icons/stroke.png',
          subTools: []
        },
        {
          name: 'Bellish',
          type: 'png',
          url: 'icons/bellish.png',
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
        <StoryFlowCanvas />
        <StateBar />
        <ToolBar Top={200} Left={0} Direction={'vertical'} Tools={leftTools} />
        <UploadModal />
        <EmbellishPanel />
        <GlobalPanel />
        <AddEventPanel centerX={0} centerY={100} />
        <StylishPanel centerX={0} centerY={100} />
      </div>
    );
  }
}

export default connect(null, null)(App);
