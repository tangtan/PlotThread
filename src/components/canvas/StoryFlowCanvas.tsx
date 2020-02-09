import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, view } from 'paper';
import {
  StateType,
  DispatchType,
  StoryGraph,
  historyQueueType
} from '../../types';
import { getCurrentStoryFlowProtoc } from '../../store/selectors';
import { getToolState, getGroupEventState } from '../../store/selectors';
import {
  addVisualObject,
  redoAction,
  undoAction,
  addAction
} from '../../store/actions';
import { iStoryline, storyRender } from 'iStoryline';
import ToolCanvas from './ToolCanvas';
import axios from 'axios';

import BrushUtil from '../../interactions/IStoryEvent/brushSelectionUtil';
import CircleUtil from '../../interactions/IStoryEvent/circleSelectionUtil';
import SortUtil from '../../interactions/IStoryEvent/sortSelectionUtil';
import historyQueue from '../../store/reducers/canvas/historyQueue';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue,
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'FreeMode')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    //  redoAction: () => dispatch(redoAction()),
    //undoAction: () => dispatch(undoAction()),
    addAction: (protocol: any) => dispatch(addAction(protocol))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyScriptUrl: string;
  storyServerUrl: string;
  storyLayouter: any;
  bendUtil: BrushUtil;
  compressUtil: CircleUtil;
  sortUtil: SortUtil;
};

class StoryFlowCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyScriptUrl: 'StarWars.xml',
      storyServerUrl: 'http://localhost:5050/api/update',
      storyLayouter: new iStoryline(),
      bendUtil: new BrushUtil('Bend', 1),
      compressUtil: new CircleUtil('Compress', 0),
      sortUtil: new SortUtil('Sort', 0)
    };
  }

  private genStoryGraph = async () => {
    const postReq = this.props.storyProtoc;
    const postUrl = this.state.storyServerUrl;
    const postRes = await axios.post(postUrl, postReq);
    const graph = this.state.storyLayouter._layout(postRes.data);
    return graph;
  };

  private drawStorylines(graph: StoryGraph) {
    this.updateUtils(graph);
    const storylines = this.props.renderQueue.filter(
      item => item.data.type === 'storyline'
    );
    storylines.forEach(storyline => storyline.remove());
    // draw new graph
    for (let i = 0; i < graph.paths.length; i++) {
      if (graph.names[i] === 'RABBIT') continue;
      const path = graph.paths[i];
      this.props.addVisualObject('storyline', {
        storylineName: graph.names[i],
        storylinePath: graph.paths[i]
      });
    }
  }

  async componentDidMount() {
    const graph = await this.genStoryGraph();
    this.drawStorylines(graph);
    view.onClick = (e: paper.MouseEvent) => {
      this.onMouseClick(e);
    };
    view.onMouseDown = (e: paper.MouseEvent) => {
      this.onMouseDown(e);
    };
    view.onMouseDrag = (e: paper.MouseEvent) => {
      this.onMouseDrag(e);
    };
    view.onMouseUp = (e: paper.MouseEvent) => {
      this.onMouseUp(e);
    };
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.historyQueue !== prevProps.historyQueue) {
      const graph = await this.genStoryGraph();
      this.drawStorylines(graph);
    }
  }

  updateUtils(graph: StoryGraph) {
    this.state.compressUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
  }
  deepCopy(x: any) {
    return JSON.parse(JSON.stringify(x));
  }
  onMouseDown(e: paper.MouseEvent) {
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.bendState) this.state.bendUtil.down(e);
    if (this.props.sortState) this.state.sortUtil.down(e);
  }

  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.bendState) this.state.bendUtil.drag(e);
    if (this.props.sortState) this.state.sortUtil.drag(e);
  }

  onMouseUp(e: paper.MouseEvent) {
    if (this.props.compressState) {
      const [names, span] = this.state.compressUtil.up(e);
      let newProcotol = this.deepCopy(this.props.storyProtoc);
      if (span) {
        for (let i = 0; i < span.length; i++) {
          newProcotol.sessionInnerGaps.push({ item1: span[i], item2: 10 });
        }
        this.props.addAction(newProcotol);
      }
    }
    if (this.props.bendState) {
      const [nameIDs, span] = this.state.bendUtil.up(e);
      let newProcotol = this.deepCopy(this.props.storyProtoc);
      if (span && nameIDs) {
        if (span.length === 5) {
          //bend
          newProcotol.sessionBreaks.push({
            frame: span[0],
            session1: span[2],
            session2: span[3]
          });
          newProcotol.sessionBreaks.push({
            frame: span[1],
            session1: span[3],
            session2: span[4]
          });
        } else {
          for (let i = 0; i < nameIDs.length; i++) {
            let tmp = [];
            for (let j = span[0]; j <= span[1]; j++) {
              tmp.push(j);
            }
            newProcotol.majorCharacters.push({ item1: nameIDs[i], item2: tmp });
          }
        }
        this.props.addAction(newProcotol);
      }
    }
    if (this.props.sortState) {
      const param = this.state.sortUtil.up(e);
      if (param) {
        const [ids, span] = param;
        let newProcotol = this.deepCopy(this.props.storyProtoc);
        newProcotol.orders.push(ids);
        this.props.addAction(newProcotol);
      }
    }
  }

  onMouseClick(e: paper.MouseEvent) {
    if (project) {
      project.deselectAll();
      this.props.renderQueue.forEach(item => {
        item.data.isTransforming = false;
        item.data.selectionBounds.visible = false;
      });
    }
  }
  render() {
    return <ToolCanvas />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryFlowCanvas);
