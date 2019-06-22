import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import TodoApp from './components/demo/TodoApp';
import ToolBar from './components/toolbar';
import MenuBar from './components/menubar';
import ShapeModal from './components/toolbar/tools/ShapeModal';
import HitTest from './components/utils/HitTest';
import ToolCanvas from './components/canvas/ToolCanvas';

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
        <MenuBar />
        <ToolCanvas />
        <ShapeModal />
        {/* <HitTest /> */}
        <ToolBar />
      </div>
    );
  }
}

export default App;
