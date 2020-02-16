import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, view } from 'paper';
import { Button } from 'antd';
import { StateType, DispatchType, StoryGraph } from '../../types';
import {
  getCurrentStoryFlowProtoc,
  getCurrentPostRes
} from '../../store/selectors';
import { getToolState } from '../../store/selectors';
import { addVisualObject, addAction, changeAction } from '../../store/actions';
import { iStoryline } from 'iStoryline';
import ToolCanvas from './ToolCanvas';
import axios from 'axios';

import BrushUtil from '../../interactions/IStoryEvent/brushSelectionUtil';
import CircleUtil from '../../interactions/IStoryEvent/circleSelectionUtil';
import SortUtil from '../../interactions/IStoryEvent/sortSelectionUtil';
import TemplatenUtil from '../../interactions/IStoryEvent/templateSelectionUtil';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    layoutBackUp: getCurrentPostRes(state),
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue,
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'FreeMode'),
    predictState: getToolState(state, 'Reshape'),
    collideState: getToolState(state, 'Collide'),
    knotState: getToolState(state, 'Knot'),
    twineState: getToolState(state, 'Twine'),
    waveState: getToolState(state, 'Wave'),
    zigzagState: getToolState(state, 'Zigzag'),
    bumpState: getToolState(state, 'Bump'),
    dashState: getToolState(state, 'Dash')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    addAction: (protocol: any) => dispatch(addAction(protocol)),
    changeAction: (postRes: any) => dispatch(changeAction(postRes))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  serverUpdateUrl: string;
  serverPredictUrl: string;
  storyLayouter: any;
  bendUtil: BrushUtil;
  compressUtil: CircleUtil;
  sortUtil: SortUtil;
  templateUtil: TemplatenUtil;
  waveUtil: BrushUtil;
  zigzagUtil: BrushUtil;
  bumpUtil: BrushUtil;
  dashUtil: BrushUtil;
  knotUtil: BrushUtil;
  twineUtil: BrushUtil;
  collideUtil: BrushUtil;
};

class StoryFlowCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverUpdateUrl: 'api/update',
      serverPredictUrl: 'api/predict',
      storyLayouter: new iStoryline(),
      bendUtil: new BrushUtil('Bend', 1),
      compressUtil: new CircleUtil('Compress', 0),
      sortUtil: new SortUtil('Sort', 0),
      templateUtil: new TemplatenUtil('Template', 0),
      waveUtil: new BrushUtil('Wave', 1),
      zigzagUtil: new BrushUtil('Zigzag', 1),
      bumpUtil: new BrushUtil('Bump', 1),
      dashUtil: new BrushUtil('Dash', 1),
      collideUtil: new BrushUtil('Collide', 2),
      knotUtil: new BrushUtil('Knot', 2),
      twineUtil: new BrushUtil('Twine', 2)
    };
  }

  private genStoryGraph = async () => {
    const protoc = this.props.storyProtoc;
    const data = this.props.layoutBackUp;
    const postUrl = this.state.serverUpdateUrl;
    const postReq = { data: data, protoc: protoc };
    const postRes = await axios.post(postUrl, protoc);
    this.props.changeAction(postRes.data);
    const graph = this.state.storyLayouter._layout(postRes.data, protoc);
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
      this.props.addVisualObject('storyline', {
        storylineName: graph.names[i],
        storylinePath: graph.paths[i],
        prevStoryline:
          i < storylines.length ? storylines[i].lastChild.children : [],
        drawType: 'new'
      });
    }
  }
  private updateStorylines(graph: StoryGraph) {
    this.updateUtils(graph);
    const storylines = this.props.renderQueue.filter(
      item => item.data.type === 'storyline'
    );

    storylines.forEach(storyline => storyline.remove());

    // draw new graph
    for (let i = 0; i < graph.paths.length; i++) {
      if (graph.names[i] === 'RABBIT') continue;
      this.props.addVisualObject('storyline', {
        storylineName: graph.names[i],
        storylinePath: graph.paths[i],
        prevStoryline:
          i < storylines.length ? storylines[i].lastChild.children : [],
        drawType: 'update'
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
  async handleClick() {
    const protoc = this.props.storyProtoc;
    const data = this.props.layoutBackUp;
    const postReq = { data: data, protoc: protoc };
    const postUrl = this.state.serverPredictUrl;
    const postRes = await axios.post(postUrl, postReq);
    const graph = this.state.storyLayouter._layout(postRes.data, postReq);
    this.drawStorylines(graph);
  }
  async componentDidUpdate(prevProps: Props) {
    if (this.props.storyProtoc.id !== prevProps.storyProtoc.id) {
      const graph = await this.genStoryGraph();
      this.drawStorylines(graph);
    } else {
      if (this.props.storyProtoc !== prevProps.storyProtoc) {
        const graph = await this.genStoryGraph();
        this.updateStorylines(graph);
      }
    }
  }

  updateUtils(graph: StoryGraph) {
    this.state.compressUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.templateUtil.updateStoryStore(graph);
    this.state.waveUtil.updateStoryStore(graph);
    this.state.bumpUtil.updateStoryStore(graph);
    this.state.zigzagUtil.updateStoryStore(graph);
    this.state.dashUtil.updateStoryStore(graph);
    this.state.collideUtil.updateStoryStore(graph);
    this.state.twineUtil.updateStoryStore(graph);
    this.state.knotUtil.updateStoryStore(graph);
  }
  deepCopy(x: any) {
    return JSON.parse(JSON.stringify(x));
  }
  onMouseDown(e: paper.MouseEvent) {
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.bendState) this.state.bendUtil.down(e);
    if (this.props.sortState) this.state.sortUtil.down(e);
    if (this.props.waveState) this.state.waveUtil.down(e);
    if (this.props.dashState) this.state.dashUtil.down(e);
    if (this.props.zigzagState) this.state.zigzagUtil.down(e);
    if (this.props.bumpState) this.state.bumpUtil.down(e);
    if (this.props.collideState) this.state.collideUtil.down(e);
    if (this.props.knotState) this.state.knotUtil.down(e);
    if (this.props.twineState) this.state.twineUtil.down(e);
  }

  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.bendState) this.state.bendUtil.drag(e);
    if (this.props.sortState) this.state.sortUtil.drag(e);
    if (this.props.waveState) this.state.waveUtil.drag(e);
    if (this.props.dashState) this.state.dashUtil.drag(e);
    if (this.props.zigzagState) this.state.zigzagUtil.drag(e);
    if (this.props.bumpState) this.state.bumpUtil.drag(e);
    if (this.props.collideState) this.state.collideUtil.drag(e);
    if (this.props.twineState) this.state.twineUtil.drag(e);
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
      let newProtocol = this.deepCopy(this.props.storyProtoc);
      if (span && nameIDs) {
        if (span.length === 5) {
          //bend
          newProtocol.sessionBreaks.push({
            frame: span[0],
            session1: span[2],
            session2: span[3]
          });
          newProtocol.sessionBreaks.push({
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
            newProtocol.majorCharacters.push({ item1: nameIDs[i], item2: tmp });
          }
        }
        this.props.addAction(newProtocol);
      }
    }
    if (this.props.sortState) {
      const param = this.state.sortUtil.up(e);
      if (param) {
        const [ids, span] = param;
        let newProtocol = this.deepCopy(this.props.storyProtoc);
        newProtocol.orders.push(ids);
        this.props.addAction(newProtocol);
      }
    }
    const stylishName = this.props.waveState
      ? 'Wave'
      : this.props.bumpState
      ? 'Bump'
      : this.props.zigzagState
      ? 'Zigzag'
      : this.props.dashState
      ? 'Dash'
      : null;
    if (stylishName) {
      const [nameIDs, span] = this.props.waveState
        ? this.state.waveUtil.up(e)
        : this.props.bumpState
        ? this.state.bumpUtil.up(e)
        : this.props.zigzagState
        ? this.state.zigzagUtil.up(e)
        : this.props.dashState
        ? this.state.dashUtil.up(e)
        : null;
      if (span && nameIDs) {
        let newProcotol = this.deepCopy(this.props.storyProtoc);
        newProcotol.stylishInfo.push({
          names: nameIDs,
          timespan: span,
          style: stylishName
        });
        this.props.addAction(newProcotol);
      }
    }
    const relateName = this.props.collideState
      ? 'Collide'
      : this.props.knotState
      ? 'Knot'
      : this.props.twineState
      ? 'Twine'
      : null;
    if (relateName) {
      const [nameIDs, span] = this.props.collideState
        ? this.state.collideUtil.up(e)
        : this.props.knotState
        ? this.state.knotUtil.up(e)
        : this.props.twineState
        ? this.state.twineUtil.up(e)
        : null;
      if (span && nameIDs) {
        let newProcotol = this.deepCopy(this.props.storyProtoc);
        newProcotol.relateInfo.push({
          names: nameIDs,
          timespan: span,
          style: relateName
        });
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
    return (
      <div>
        <Button
          type="primary"
          style={{ position: 'absolute', top: '700px', background: '#34373e' }}
          size="large"
          onClick={() => this.handleClick()}
        >
          Template
        </Button>
        <ToolCanvas />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryFlowCanvas);
