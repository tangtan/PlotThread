import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import ToolBar from './components/toolbar';
import ShapeModal from './components/toolbar/tools/ShapeModal';
import DrawCanvas from './components/canvas/DrawCanvas';

type Props = {};

type State = {};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        {/* <MenuBar /> */}
        {/* <ToolCanvas /> */}
        <DrawCanvas />
        <ShapeModal />
        <ToolBar />
      </div>
    );
  }
}

export default App;
