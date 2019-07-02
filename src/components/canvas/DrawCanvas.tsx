import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import ZoomCanvas from './ZoomCanvas';
import { storyflow } from 'story-flow';
import { xml } from 'd3-fetch';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyXMLUrl: string;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/busan.xml'
    };
  }

  async componentDidMount() {
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyFlower = storyflow();
    const storyData = storyFlower.read(xmlData);
    const generator = storyFlower.extent([[0, 0], [800, 500]]).lineWidth(3);
    const storyLayout = generator(storyData);
    const nodes = storyLayout.nodes;
    console.log(nodes);
  }

  componentDidUpdate() {}

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
