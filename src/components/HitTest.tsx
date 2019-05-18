import * as React from 'react';
import { Component } from 'react';

export interface HitTestProps {}

export interface HitTestState {}

class HitTest extends React.Component<HitTestProps, HitTestState> {
  constructor(props: HitTestProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>Hello</div>;
  }
}

export default HitTest;
