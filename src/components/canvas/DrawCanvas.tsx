import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Path, Item, Point, view, project } from 'paper';
import { StateType, DispatchType } from '../../types';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'story-flow';
import { xml } from 'd3-fetch';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

const hitOption = {
  segments: false,
  stroke: true,
  fill: false,
  tolerance: 5
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyXMLUrl: string;
  storyFlower: any;
  orderInfo: string[][];
  straightenInfo: any[][];
  compressInfo: number[][];
  strokes: Path[];
  nodes: number[][][];
  names: string[];
  strokeWidth: number;
  speed: number;
  opt: String;
  selectPath: Item | null;
  startPosition: Point | null;
  endPosition: Point | null;
  currPath: Path | null;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/busan.xml',
      storyFlower: null,
      orderInfo: [],
      straightenInfo: [],
      compressInfo: [],
      strokes: [],
      nodes: [],
      names: [],
      strokeWidth: 4,
      speed: 300,
      opt: '',
      selectPath: null,
      startPosition: null,
      endPosition: null,
      currPath: null
    };
  }

  async componentDidMount() {
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyFlower = new iStoryline();
    this.setState({
      storyFlower: storyFlower
    });
    storyFlower.read(xmlData);
    this.refresh();
    document.addEventListener('keydown', e => {
      console.log(e);
      if (e.keyCode == 13) {
        this.refresh();
      } else if (e.keyCode == 49) {
        this.clearOpt();
        this.setState({
          opt: 'sort'
        });
      } else if (e.keyCode == 50) {
        this.clearOpt();
        this.setState({
          opt: 'blur'
        });
      } else if (e.keyCode == 51) {
        this.clearOpt();
        this.setState({
          opt: 'compress'
        });
      } else if (e.keyCode == 52) {
        this.clearOpt();
        this.setState({
          opt: 'straighten'
        });
      } else if (e.keyCode == 27) {
        this.clearOpt();
      }
    });
    view.onMouseDown = this.onMouseDown;
    view.onMouseUp = this.onMouseUp;
    view.onMouseMove = this.onMouseMove;
    view.onMouseDrag = this.onMouseDrag;
  }

  private clearOpt = () => {
    if (this.state.selectPath) {
      this.state.selectPath.strokeColor = 'black';
    }
    if (this.state.currPath) {
      this.state.currPath.remove();
    }
    this.setState({
      selectPath: null,
      currPath: null
    });
  };

  private findIndexByName = (name: string) => {
    let res = -1;
    this.state.names.forEach((str, index) => {
      if (str == name) {
        res = index;
      }
    });
    return res;
  };

  private findIndexByPosition = (x: number, y: number) => {
    let min_y = -1;
    let res = -1;
    this.state.nodes.forEach((line, index) => {
      line.forEach((node, pos) => {
        if (node[0] >= x && pos > 0 && line[pos - 1][0] < x) {
          const start_x = line[pos - 1][0];
          const start_y = line[pos - 1][1];
          const end_x = line[pos][0];
          const end_y = line[pos][1];
          const pos_y =
            start_y + ((end_y - start_y) * (x - start_x)) / (end_x - start_x);
          console.log(pos_y);
          if ((min_y == -1 || pos_y > min_y) && pos_y < y) {
            min_y = pos_y;
            res = index;
          }
        }
      });
    });
    console.log(y, min_y);
    return res;
  };

  private onSortDown = (e: paper.MouseEvent) => {
    const result = project.hitTest(e.point, hitOption);
    if (result) {
      const item = result.item;
      this.setState({
        selectPath: item,
        startPosition: e.point
      });
    }
  };
  private onSortUp = (e: paper.MouseEvent) => {
    if (this.state.selectPath) {
      if (this.state.currPath) {
        this.state.currPath.remove();
        this.setState({
          currPath: null
        });
      }
      const name = this.state.selectPath.name;
      const x = e.point.x;
      const y = e.point.y;
      const res = this.findIndexByPosition(x, y);
      if (res == -1) {
        return;
      }
      const before_name = this.state.names[res];
      if (name == before_name) {
        return;
      }
      this.state.orderInfo.push([before_name, name]);
      this.refresh();
    }
  };
  private onSortDrag = (e: paper.MouseEvent) => {
    if (this.state.selectPath) {
      if (this.state.currPath) {
        this.state.currPath.remove();
        this.setState({
          currPath: null
        });
      }
      if (this.state.startPosition) {
        const path = this.state.selectPath.clone() as Path;
        path.strokeColor = 'green';
        path.position.y += e.point.y - this.state.startPosition.y;
        this.setState({
          currPath: path
        });
      }
    }
  };

  private onBlurDown = (e: paper.MouseEvent) => {
    if (this.state.selectPath) {
      this.setState({
        startPosition: e.point
      });
    }
  };
  private onBlurUp = (e: paper.MouseEvent) => {
    if (!this.state.selectPath) {
      const result = project.hitTest(e.point, hitOption);
      if (result) {
        this.setState({
          selectPath: result.item
        });
        result.item.strokeColor = 'red';
      }
    } else {
      this.setState({
        endPosition: e.point
      });
      if (this.state.currPath) {
        this.state.currPath.remove();
        this.setState({
          currPath: null
        });
      }
      console.log(this.state.selectPath);
      console.log(this.state.startPosition, this.state.endPosition);
    }
  };
  private onStraightenUp = (e: paper.MouseEvent) => {
    if (!this.state.selectPath) {
      const result = project.hitTest(e.point, hitOption);
      if (result) {
        this.setState({
          selectPath: result.item
        });
        result.item.strokeColor = 'red';
      }
    } else {
      this.setState({
        endPosition: e.point
      });
      if (this.state.currPath) {
        this.state.currPath.remove();
        this.setState({
          currPath: null
        });
      }
      const name = this.state.selectPath.name;
      if (this.state.startPosition && this.state.endPosition) {
        this.state.straightenInfo.push([
          name,
          this.state.startPosition.x * 500,
          this.state.endPosition.x * 500
        ]);
      }
      this.refresh();
    }
  };
  private onBlurDrag = (e: paper.MouseEvent) => {
    if (this.state.selectPath) {
      this.setState({
        endPosition: e.point
      });
      if (this.state.currPath) {
        this.state.currPath.remove();
      }
      if (this.state.startPosition && this.state.endPosition) {
        const path = new Path.Line(
          this.state.startPosition,
          new Point([this.state.endPosition.x, this.state.startPosition.y])
        );
        path.strokeColor = 'blue';
        this.setState({
          currPath: path
        });
      }
    }
  };

  private onCompressDown = (e: paper.MouseEvent) => {
    this.setState({
      startPosition: e.point
    });
  };
  private onCompressUp = (e: paper.MouseEvent) => {
    this.setState({
      endPosition: e.point
    });
    if (this.state.currPath) {
      this.state.currPath.remove();
      this.setState({
        currPath: null
      });
    }
    console.log(this.state.startPosition, this.state.endPosition);
  };
  private onCompressDrag = (e: paper.MouseEvent) => {
    this.setState({
      endPosition: e.point
    });
    if (this.state.currPath) {
      this.state.currPath.remove();
    }
    if (this.state.startPosition && this.state.endPosition) {
      const path = new Path.Line(
        this.state.startPosition,
        new Point([this.state.endPosition.x, this.state.startPosition.y])
      );
      path.strokeColor = 'blue';
      this.setState({
        currPath: path
      });
    }
  };

  private onMouseDown = (e: paper.MouseEvent) => {
    switch (this.state.opt) {
      case 'sort':
        this.onSortDown(e);
        break;
      case 'blur':
        this.onBlurDown(e);
        break;
      case 'compress':
        this.onCompressDown(e);
        break;
      case 'straighten':
        this.onBlurDown(e);
        break;
      default:
        break;
    }
  };

  private onMouseUp = (e: paper.MouseEvent) => {
    switch (this.state.opt) {
      case 'sort':
        this.onSortUp(e);
        break;
      case 'blur':
        this.onBlurUp(e);
        break;
      case 'compress':
        this.onCompressUp(e);
        break;
      case 'straighten':
        this.onStraightenUp(e);
      default:
        break;
    }
  };

  private onMouseMove = (e: paper.MouseEvent) => {};

  private onMouseDrag = (e: paper.MouseEvent) => {
    switch (this.state.opt) {
      case 'sort':
        this.onSortDrag(e);
        break;
      case 'blur':
        this.onBlurDrag(e);
        break;
      case 'compress':
        this.onCompressDrag(e);
        break;
      case 'straighten':
        this.onBlurDrag(e);
        break;
      default:
        break;
    }
  };

  async refresh() {
    const graph = this.state.storyFlower.layout(
      this.state.orderInfo,
      this.state.straightenInfo,
      this.state.compressInfo
    );
    const nodes: number[][][] = graph.nodes;
    const names: string[] = graph.names;
    nodes.forEach(line => {
      line.forEach(node => {
        node[1] /= 50;
        node[1] += 150;
        node[0] /= 500;
      });
    });
    this.setState({
      nodes: nodes,
      names: names
    });
    this.state.strokes.forEach(path => {
      path.remove();
    });
    this.setState({
      strokes: []
    });
    nodes.forEach((line, index) => {
      this.appearing(line, this.state.speed, names[index]);
    });
  }

  appearing(line: number[][], speed: number, name: string) {
    const path = new Path();
    path.name = name;
    path.strokeColor = 'black';
    path.strokeWidth = this.state.strokeWidth;
    this.setState({
      strokes: [...this.state.strokes, path]
    });
    let x = line[0][0];
    let pos = 1;
    path.onFrame = e => {
      x += e.delta * speed;
      if (x > line[pos][0]) {
        path.add(line[pos]);
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
