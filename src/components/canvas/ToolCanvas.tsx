import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { addVisualObject, setTool } from '../../store/actions';
import DrawCanvas from './DrawCanvas';
import { getToolState } from '../../store/selectors';

import PolylineTool from '../../interactions/polylineTool';
import FreelineTool from '../../interactions/freelineTool';

const mapStateToProps = (state: StateType) => {
  return {
    // Layout Utils
    freeMode: getToolState(state, 'FreeMode'),
    addLineState: getToolState(state, 'AddLine'),
    groupState: getToolState(state, 'Group'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'Sort'),
    bendState: getToolState(state, 'Forward'), //TODO
    straightenState: getToolState(state, 'Straighten'),
    // Relationship/Group Utils
    mergeState: getToolState(state, 'Merge'),
    splitState: getToolState(state, 'Split'),
    collideState: getToolState(state, 'Collide'),
    twineState: getToolState(state, 'Twine'),
    knotState: getToolState(state, 'Knot'),
    // Line Utils
    strokeDashState: getToolState(state, 'StrokeDash'),
    strokeWidthState: getToolState(state, 'StrokeWidth'),
    strokeZigzagState: getToolState(state, 'StrokeZigzag'),
    strokeWaveState: getToolState(state, 'StrokeWave'),
    adjustState: getToolState(state, 'Adjust')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    escapeTools: (type: string, use: boolean) => dispatch(setTool(type, use))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

let toolStore = new Map();

let toolStore1: PolylineTool | null = null;

class ToolCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Esc':
        case 'Escape':
          this.props.escapeTools('FreeMode', true);
          break;
        default:
          break;
      }
    });
  }

  componentDidUpdate() {
    this.updateTool('polyline', this.props.adjustState);
    this.updateTool('freeline', this.props.compressState);
  }

  updateTool(type: string, toolState: boolean | undefined) {
    if (toolState) {
      let toolItem = this.constructTool(type);
      // console.log(type, toolItem);
      if (toolItem) toolItem.activate();
      toolStore.set(type, toolItem);
    } else {
      // Code works after pressing ESC button
      const toolItem = toolStore.get(type);
      if (toolItem) {
        const _group = toolItem.remove();
        if (_group) this.props.addVisualObject(type, _group);
      }
    }
  }

  constructTool(type: string) {
    switch (type) {
      case 'polyline':
        return new PolylineTool();
      case 'freeline':
        return new FreelineTool();
      default:
        return null;
    }
  }

  render() {
    return <DrawCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolCanvas);
