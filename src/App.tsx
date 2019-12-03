import React from 'react';
import { connect } from 'react-redux';
import { getToolState } from './store/selectors';
import './App.css';
import 'antd/dist/antd.css';

import MenuBar from './components/menubar';
import ToolBar from './components/toolbar';
import StateBar from './components/statebar';
import ToolCanvas from './components/canvas/ToolCanvas';
import ShapeModal from './components/toolbar/tools/ShapeModal';
import UploadModal from './components/toolbar/tools/UploadModal';
import StyleModal from './components/statebar/StyleBar/StyleModal';
import { ITool, StateType } from './types';

const mapStateToProps = (state: StateType) => {
  return {
    freeMode: getToolState(state, 'FreeMode')
  };
};

type Props = {} & ReturnType<typeof mapStateToProps>;

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
          name: 'Relate',
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

  render() {
    const { leftTools } = this.state;
    return (
      <div className="App">
        <ToolCanvas />
        <StateBar />
        <ToolBar Top={200} Left={0} Direction={'vertical'} Tools={leftTools} />
        <ShapeModal />
        <UploadModal />
        <StyleModal />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(App);
