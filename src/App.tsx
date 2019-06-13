import React, { Component } from 'react';
import './App.css';
import TodoApp from './components/demo/TodoApp';
import ZoomCanvas from './components/canvas/ZoomCanvas';
import ToolBar from './components/toolbar';
import HitTest from './components/utils/HitTest';

type Props = {};

type State = {};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="t-app-root">
        <ZoomCanvas />
        {/* <TodoApp /> */}
        <HitTest />
        <ToolBar />
      </div>
    );
  }
}

export default App;
