import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MouseEvent, Path, view, project, Item, Segment } from 'paper';
import DrawCanvas from './DrawCanvas';
import { StateType } from '../../types';

const mapStateToProps = (state: StateType) => {
  return {
    // toolState: state.toolState
    morphState: state.toolState.morph,
    strokeState: state.toolState.stroke,
    freeMode: !(
      state.toolState.move ||
      state.toolState.morph ||
      state.toolState.stroke
    )
  };
};

type Props = {} & ReturnType<typeof mapStateToProps>;

type State = {
  strokes: Path[];
  currStroke: Path | null;
  focusPath: Item | null;
  focusSegment: Segment | null;
  isMoveFocusPath: boolean;
};

const hitOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

class ToolCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currStroke: null,
      strokes: [],
      focusPath: null,
      focusSegment: null,
      isMoveFocusPath: false
    };
  }

  private onMouseDown = (e: MouseEvent) => {
    this.onStrokeMouseDown(e);
    this.onHitTestDown(e);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.onHitTestMove(e);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.onMorphMouseUp(e);
    this.onHitTestUp(e);
  };

  private onMouseDrag = (e: MouseEvent) => {
    this.onStrokeMouseDrag(e);
    this.onHitTestDrag(e);
  };

  private onStrokeMouseDown = (e: MouseEvent) => {
    if (this.props.strokeState) {
      const _stroke = new Path();
      _stroke.strokeColor = 'black';
      this.setState({
        strokes: [...this.state.strokes, _stroke],
        currStroke: _stroke
      });
    }
  };

  private onStrokeMouseDrag = (e: MouseEvent) => {
    if (this.state.currStroke && this.props.strokeState) {
      this.state.currStroke.add(e.point);
    }
  };

  private onMorphMouseUp = (e: MouseEvent) => {
    if (this.props.morphState) {
      const circle = new Path.Circle({
        center: e.point,
        radius: 10
      });
      circle.strokeColor = 'black';
      circle.fillColor = 'white';
    }
  };

  private onHitTestDown = (e: MouseEvent) => {
    if (this.props.freeMode) {
      const hitResult = project.hitTest(e.point, hitOption);
      if (hitResult) {
        switch (hitResult.type) {
          case 'fill':
            this.setState({
              focusPath: hitResult.item,
              isMoveFocusPath: true
            });
            break;
          case 'segment':
            if (e.modifiers.shift) {
              hitResult.segment.remove();
            } else {
              this.setState({
                focusSegment: hitResult.segment,
                isMoveFocusPath: false
              });
            }
            break;
          case 'stroke':
            this.setState({
              focusPath: hitResult.item,
              isMoveFocusPath: true
            });
            break;
          default:
            break;
        }
      }
    }
  };

  private onHitTestMove = (e: MouseEvent) => {
    if (this.props.freeMode) {
      project.activeLayer.selected = false;
      const hitResult = project.hitTest(e.point, hitOption);
      if (hitResult && hitResult.item) {
        hitResult.item.selected = true;
      }
    }
  };

  private onHitTestUp = (e: MouseEvent) => {
    if (this.props.freeMode) {
      this.setState({
        focusPath: null,
        focusSegment: null,
        isMoveFocusPath: false
      });
    }
  };

  private onHitTestDrag = (e: MouseEvent) => {
    if (this.props.freeMode) {
      if (this.state.focusPath && this.state.isMoveFocusPath) {
        this.state.focusPath.position.x += e.delta.x;
        this.state.focusPath.position.y += e.delta.y;
      }
      if (this.state.focusSegment && !this.state.isMoveFocusPath) {
        this.state.focusSegment.point.x += e.delta.x;
        this.state.focusSegment.point.y += e.delta.y;
      }
    }
  };

  componentDidMount() {
    // console.log(project);
    // view.onMouseDown = this.onMouseDown;
    // view.onMouseUp = this.onMouseUp;
    // view.onMouseMove = this.onMouseMove;
    // view.onMouseDrag = this.onMouseDrag;
  }

  render() {
    return <DrawCanvas />;
  }
}

export default connect(
  mapStateToProps,
  null
)(ToolCanvas);
