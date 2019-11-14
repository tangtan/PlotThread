import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, Point } from 'paper';
import { StateType, DispatchType } from '../../types';
import { setObject, addVisualObject } from '../../store/actions';
import { getToolState } from '../../store/selectors';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'iStoryline';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    selectedObj: state.selectedObj,
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
    strokeWaveState: getToolState(state, 'StrokeWave')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    setSelectedObj: (e: paper.MouseEvent) =>
      dispatch(setObject(e.point || new Point(-100, -100)))
  };
};

const hitOption = {
  segments: false,
  stroke: true,
  fill: false,
  tolerance: 5
};

const hitShapeOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyXMLUrl: string;
  storyStore: any;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyStore: new iStoryline()
    };
  }

  // init
  async componentDidMount() {
    console.log(project);
    const { storyXMLUrl, storyStore } = this.state;
    let graph = await storyStore.readFile(storyXMLUrl);
    graph = storyStore.scale(100, 100, 800, 500, true);
    graph = storyStore.space(10, 10);
    console.log(graph);
    graph.names.forEach((name: string, i: number) => {
      const path = graph.paths[i];
      this.props.addVisualObject('storyline', {
        storylineName: name,
        storylinePath: path
      });
    });
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
