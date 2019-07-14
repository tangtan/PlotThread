import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Path } from 'paper';
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
  strokes: Path[];
  nodes: number[][][];
  speed: number;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/busan.xml',
      strokes: [],
      nodes: [],
      speed: 300
    };
  }

  async componentDidMount() {
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyFlower = storyflow();
    const storyData = storyFlower.read(xmlData);
    const generator = storyFlower.extent([[0, 0], [800, 500]]).lineWidth(3);
    const storyLayout = generator(storyData);
    const nodes: number[][][] = storyLayout.nodes;
    nodes.forEach(line => {
      line.forEach(node => {
        node[1] /= 50;
        node[1] += 150;
      });
    });
    this.setState({
      nodes: nodes
    });
    this.refresh();
    document.addEventListener('keydown', e => {
      if (e.keyCode == 13) {
        this.refresh();
      }
    });
  }

  refresh() {
    this.state.strokes.forEach(path => {
      path.removeSegments();
    });
    this.setState({
      strokes: []
    });
    this.state.nodes.forEach(line => {
      this.appearing(line, this.state.speed);
    });
  }

  appearing(line: number[][], speed: number) {
    const path = new Path();
    path.strokeColor = 'black';
    this.setState({
      strokes: [...this.state.strokes, path]
    });
    let x = line[0][0];
    let pos = 1;
    path.onFrame = e => {
      x += e.delta * speed;
      if (x > line[pos][0]) {
        pos++;
      }
      if (pos >= line.length) {
        path.onFrame = () => {};
        return;
      }
      const start_x = line[pos - 1][0];
      const start_y = line[pos - 1][1];
      const end_x = line[pos][0];
      const end_y = line[pos][1];
      const y =
        start_y + ((end_y - start_y) * (x - start_x)) / (end_x - start_x);
      console.log(x, y);
      console.log(path);
      path.add([x, y]);
    };
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
