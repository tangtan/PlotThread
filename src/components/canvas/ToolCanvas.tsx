import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { addVisualObject, setTool } from '../../store/actions';
import DrawCanvas from './DrawCanvas';
import { getToolState } from '../../store/selectors';
import { Group } from 'paper';

import PolylineTool from '../../interactions/IDrawEvent/polylineTool';
import FreelineTool from '../../interactions/IDrawEvent/freelineTool';
import TextTool from '../../interactions/IDrawEvent/textTool';

const mapStateToProps = (state: StateType) => {
  return {
    adjustState: getToolState(state, 'Adjust'),
    freelineState: getToolState(state, 'StrokeWave'),
    textState: getToolState(state, 'Text')
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
    this.updateTool('freeline', this.props.freelineState);
    this.updateTool('freetext', this.props.textState);
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
        const _groups = toolItem.remove();
        _groups.forEach((_group: Group) =>
          this.props.addVisualObject(type, _group)
        );
      }
    }
  }

  constructTool(type: string) {
    switch (type) {
      case 'polyline':
        return new PolylineTool();
      case 'freeline':
        return new FreelineTool();
      case 'freetext':
        return new TextTool();
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
