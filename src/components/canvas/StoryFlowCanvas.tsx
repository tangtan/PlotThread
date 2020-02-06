import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import DrawCanvas from './DrawCanvas';

const mapStateToProps = (state: StateType) => {
  return {};
};

const mapDispatchToProps = (state: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

class StoryFlowCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return <DrawCanvas />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryFlowCanvas);
