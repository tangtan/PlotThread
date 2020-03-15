import React, { Component } from 'react';
import { StateType, DispatchType, StoryGraph } from '../../types';
import BendUtil from '../../interactions/IStoryEvent/bendUtil';
import CompressUtil from '../../interactions/IStoryEvent/compressUtil';
import SortUtil from '../../interactions/IStoryEvent/sortUtil';
import StylishUtil from '../../interactions/IStoryEvent/stylishUtil';
import RelateUtil from '../../interactions/IStoryEvent/relateUtil';
import {
  getToolState,
  getCurrentStoryFlowProtoc,
  getCurrentStoryFlowLayout
} from '../../store/selectors';
import { view } from 'paper';
import ToolCanvas from './ToolCanvas';
import { connect } from 'react-redux';
import {
  addVisualObject,
  updateProtocAction,
  updateLayoutAction
} from '../../store/actions';
import { iStoryline } from 'iStoryline';
import RepelUtil from '../../interactions/IStoryEvent/repelUtil';
import AttractUtil from '../../interactions/IStoryEvent/attractUtil';
import TransformUtil from '../../interactions/IStoryEvent/transformUtil';
import { notification } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    storyLayout: getCurrentStoryFlowLayout(state),
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'Sort'),
    bumpState: getToolState(state, 'Bump'),
    dashState: getToolState(state, 'Dash'),
    waveState: getToolState(state, 'Wave'),
    zigzagState: getToolState(state, 'Zigzag'),
    collideState: getToolState(state, 'Collide'),
    mergeState: getToolState(state, 'Merge'),
    splitState: getToolState(state, 'Split'),
    twineState: getToolState(state, 'Twine'),
    repelState: getToolState(state, 'Repel'),
    attractState: getToolState(state, 'Attract'),
    transformState: getToolState(state, 'Transform')
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    updateProtocAction: (protoc: any) => dispatch(updateProtocAction(protoc)),
    updateLayoutAction: (layout: any) => dispatch(updateLayoutAction(layout))
  };
};
type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyLayouter: any;
  bendUtil: BendUtil;
  compressUtil: CompressUtil;
  sortUtil: SortUtil;
  bumpUtil: StylishUtil;
  dashUtil: StylishUtil;
  waveUtil: StylishUtil;
  zigzagUtil: StylishUtil;
  collideUtil: RelateUtil;
  mergeUtil: RelateUtil;
  splitUtil: RelateUtil;
  twineUtil: RelateUtil;
  repelUtil: RepelUtil;
  attractUtil: AttractUtil;
  transformUtil: TransformUtil;
};
class UtilCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyLayouter: new iStoryline(),
      bendUtil: new BendUtil('Bend', 1),
      compressUtil: new CompressUtil('Compress', 0),
      sortUtil: new SortUtil('Sort', 0),
      bumpUtil: new StylishUtil('Bump', 1),
      dashUtil: new StylishUtil('Dash', 1),
      waveUtil: new StylishUtil('Wave', 1),
      zigzagUtil: new StylishUtil('Zigzag', 1),
      collideUtil: new RelateUtil('Collide', 2),
      mergeUtil: new RelateUtil('Merge', 2),
      splitUtil: new RelateUtil('Split', 2),
      twineUtil: new RelateUtil('Twine', 2),
      repelUtil: new RepelUtil('Repel', 0),
      attractUtil: new AttractUtil('Attract', 0),
      transformUtil: new TransformUtil('Transform', 0)
    };
  }
  updateUtils(graph: StoryGraph) {
    this.state.bendUtil.updateStoryStore(graph);
    this.state.compressUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.bumpUtil.updateStoryStore(graph);
    this.state.dashUtil.updateStoryStore(graph);
    this.state.waveUtil.updateStoryStore(graph);
    this.state.zigzagUtil.updateStoryStore(graph);
    this.state.collideUtil.updateStoryStore(graph);
    this.state.mergeUtil.updateStoryStore(graph);
    this.state.splitUtil.updateStoryStore(graph);
    this.state.twineUtil.updateStoryStore(graph);
    this.state.repelUtil.updateStoryStore(graph);
    this.state.attractUtil.updateStoryStore(graph);
    this.state.transformUtil.updateStoryStore(graph);
  }
  deepCopy(x: any) {
    return JSON.parse(JSON.stringify(x));
  }
  componentDidMount() {
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
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.storyLayout !== prevProps.storyLayout ||
      this.props.storyProtoc !== prevProps.storyProtoc
    ) {
      if (this.props.storyLayout && this.props.storyProtoc) {
        const graph = this.state.storyLayouter._layout(
          this.props.storyLayout,
          this.props.storyProtoc
        );
        this.updateUtils(graph);
      }
    }
  }
  onMouseDown(e: paper.MouseEvent) {
    if (this.props.bendState) this.state.bendUtil.down(e);
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.sortState) this.state.sortUtil.down(e);
    if (this.props.bumpState) this.state.bumpUtil.down(e);
    if (this.props.dashState) this.state.dashUtil.down(e);
    if (this.props.waveState) this.state.waveUtil.down(e);
    if (this.props.zigzagState) this.state.zigzagUtil.down(e);
    if (this.props.collideState) this.state.collideUtil.down(e);
    if (this.props.mergeState) this.state.mergeUtil.down(e);
    if (this.props.splitState) this.state.splitUtil.down(e);
    if (this.props.twineState) this.state.twineUtil.down(e);
    if (this.props.transformState) this.state.transformUtil.down(e);
    if (this.props.repelState) this.state.repelUtil.down(e);
    if (this.props.attractState) this.state.attractUtil.down(e);
  }
  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.bendState) this.state.bendUtil.drag(e);
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.sortState) this.state.sortUtil.drag(e);
    if (this.props.bumpState) this.state.bumpUtil.drag(e);
    if (this.props.dashState) this.state.dashUtil.drag(e);
    if (this.props.waveState) this.state.waveUtil.drag(e);
    if (this.props.zigzagState) this.state.zigzagUtil.drag(e);
    if (this.props.collideState) this.state.collideUtil.drag(e);
    if (this.props.mergeState) this.state.mergeUtil.drag(e);
    if (this.props.splitState) this.state.splitUtil.drag(e);
    if (this.props.twineState) this.state.twineUtil.drag(e);
    if (this.props.attractState) this.state.attractUtil.drag(e);
    if (this.props.repelState) this.state.repelUtil.drag(e);
    if (this.props.transformState) this.state.transformUtil.drag(e);
  }
  onMouseUp(e: paper.MouseEvent) {
    if (this.props.compressState) {
      const ret = this.state.compressUtil.up(e);
      if (ret) {
        const [names, span] = ret;
        let newProtocol = this.deepCopy(this.props.storyProtoc);
        if (span && span.length >= 1) {
          if (span.length > 1) {
            newProtocol.sessionOuterGaps.push({
              item1: { item1: span[0], item2: span[1] },
              item2: { item1: 100, item2: -1 }
            });
          } else {
            newProtocol.sessionInnerGaps.push({ item1: span[0], item2: 10 });
          }
          newProtocol.interaction = 'compress';
          this.props.updateProtocAction(newProtocol);
        } else {
          this.openNotification(
            'Compress',
            'Please draw a horizontal line to select the time range.'
          );
        }
      } else {
        this.openNotification(
          'Compress',
          'Please draw a circle to pick characters.'
        );
      }
    }
    if (this.props.bendState) {
      const ret = this.state.bendUtil.up(e);
      if (ret) {
        const [nameIDs, span] = ret;
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
              newProtocol.majorCharacters.push({
                item1: nameIDs[i],
                item2: tmp
              });
            }
          }
          newProtocol.interaction = 'bend';
          console.log(newProtocol);
          this.props.updateProtocAction(newProtocol);
        }
      } else {
        // this.openBendNotification();
        this.openNotification('Bend', 'Please just click one name label.');
      }
    }
    if (this.props.sortState) {
      const param = this.state.sortUtil.up(e);
      if (param) {
        // console.log(param);
        let newProtocol = this.deepCopy(this.props.storyProtoc);
        if (typeof param[0] === 'number') {
          const [id, order] = param;
          order.push(0); //rabbit的order
          newProtocol.orderTable.push({ item1: id, item2: order });
        } else {
          const [ids, span] = param;
          newProtocol.orders.push(ids);
          this.props.updateProtocAction(newProtocol);
        }
        newProtocol.interaction = 'sort';
        // console.log("newProtoc",newProtocol);
        this.props.updateProtocAction(newProtocol);
      } else {
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
      const ret = this.props.waveState
        ? this.state.waveUtil.up(e)
        : this.props.bumpState
        ? this.state.bumpUtil.up(e)
        : this.props.zigzagState
        ? this.state.zigzagUtil.up(e)
        : this.props.dashState
        ? this.state.dashUtil.up(e)
        : null;
      if (ret) {
        const [nameIDs, span] = ret;
        if (span && nameIDs) {
          let newProtocol = this.deepCopy(this.props.storyProtoc);
          if (!newProtocol.stylishInfo) newProtocol.stylishInfo = [];
          newProtocol.stylishInfo.push({
            names: nameIDs,
            timespan: span,
            style: stylishName
          });
          newProtocol.interaction = 'stylish';
          this.props.updateProtocAction(newProtocol);
        }
      } else {
        // this.openStylishNotification();
        this.openNotification('Stylish', 'Please click one name label first.');
      }
    }
    const relateName = this.props.collideState
      ? 'Collide'
      : this.props.mergeState
      ? 'Merge'
      : this.props.splitState
      ? 'Split'
      : this.props.twineState
      ? 'Twine'
      : null;
    if (relateName) {
      const ret = this.props.collideState
        ? this.state.collideUtil.up(e)
        : this.props.mergeState
        ? this.state.mergeUtil.up(e)
        : this.props.splitState
        ? this.state.splitUtil.up(e)
        : this.props.twineState
        ? this.state.twineUtil.up(e)
        : null;
      if (ret) {
        const [nameIDs, span] = ret;
        if (span && nameIDs) {
          let newProtocol = this.deepCopy(this.props.storyProtoc);
          if (!newProtocol.relateInfo) newProtocol.relateInfo = [];
          newProtocol.relateInfo.push({
            names: nameIDs,
            timespan: span,
            style: relateName
          });
          newProtocol.interaction = 'relate';
          // console.log(newProtocol);
          this.props.updateProtocAction(newProtocol);
        }
      } else {
        // this.openRelateNotification();
        this.openNotification('Relate', 'Please click two name labels first.');
      }
    }
    if (this.props.repelState) {
      const ret = this.state.repelUtil.up(e);
      if (ret) {
        const [type, [[name1, s1, e1], [name2, s2, e2]]] = ret; //type为1 则第一组在下面
        let flag = type ? 1 : -1;
        let newLayout = this.deepCopy(this.props.storyLayout);
        for (let j = 0; j < name1.length; j++) {
          for (let i = 0; i < newLayout.array.length; i++) {
            if (newLayout.array[i].name === name1[j]) {
              for (let k = s1; k <= e1; k++) {
                if (newLayout.perm[i][k] !== -1) {
                  newLayout.array[i].points[k].item3 += flag * 30;
                }
              }
            }
          }
        }
        for (let j = 0; j < name2.length; j++) {
          for (let i = 0; i < newLayout.array.length; i++) {
            if (newLayout.array[i].name === name2[j]) {
              for (let k = s2; k <= e2; k++) {
                if (newLayout.perm[i][k] !== -1) {
                  newLayout.array[i].points[k].item3 += -flag * 30;
                }
              }
            }
          }
        }
        this.props.updateLayoutAction(newLayout);
      } else {
        this.openNotification(
          'Repel',
          'Please draw a circle to select a region and then draw a vertical line.'
        );
      }
    }
    if (this.props.attractState) {
      const ret = this.state.attractUtil.up(e);
      if (ret) {
        const [type, [[name1, s1, e1], [name2, s2, e2]]] = ret; //type为1 则第一组在下面
        let flag = type ? 1 : -1;
        let newLayout = this.deepCopy(this.props.storyLayout);
        for (let j = 0; j < name1.length; j++) {
          for (let i = 0; i < newLayout.array.length; i++) {
            if (newLayout.array[i].name === name1[j]) {
              for (let k = s1; k <= e1; k++) {
                if (newLayout.perm[i][k] !== -1) {
                  newLayout.array[i].points[k].item3 -= flag * 30;
                }
              }
            }
          }
        }
        for (let j = 0; j < name2.length; j++) {
          for (let i = 0; i < newLayout.array.length; i++) {
            if (newLayout.array[i].name === name2[j]) {
              for (let k = s2; k <= e2; k++) {
                if (newLayout.perm[i][k] !== -1) {
                  newLayout.array[i].points[k].item3 -= -flag * 30;
                }
              }
            }
          }
        }
        this.props.updateLayoutAction(newLayout);
      } else {
        this.openNotification(
          'Attract',
          'Please draw a circle to select a region and then draw a vertical line.'
        );
      }
    }
    if (this.props.transformState) {
      const ret = this.state.transformUtil.up(e);
      if (ret) {
        const { names, timeID, paths } = ret;
        const sTimeID = timeID[0];
        const eTimeID = timeID[1];
        let upperPath = paths[0];
        let bottomPath = paths[1];
        if (upperPath && bottomPath) {
          upperPath.sort((a: number[], b: number[]) => a[0] - b[0]);
          bottomPath.sort((a: number[], b: number[]) => a[0] - b[0]);
          let newLayout = this.deepCopy(this.props.storyLayout);
          let minY = 1e9;
          let maxY = 0;
          for (let j = 0; j < names.length; j++) {
            for (let i = 0; i < newLayout.array.length; i++) {
              if (newLayout.array[i].name === names[j]) {
                for (let k = sTimeID; k <= eTimeID; k++) {
                  if (newLayout.perm[i][k] !== -1) {
                    minY = Math.min(newLayout.array[i].points[k].item3, minY);
                    maxY = Math.max(newLayout.array[i].points[k].item3, maxY);
                  }
                }
              }
            }
          }
          let pminY = 1e9,
            pmaxY = 0;
          for (let i = 0; i < upperPath.length; i++) {
            pminY = Math.min(upperPath[i][1], pminY);
            pmaxY = Math.max(upperPath[i][1], pmaxY);
          }
          for (let i = 0; i < bottomPath.length; i++) {
            pminY = Math.min(bottomPath[i][1], pminY);
            pmaxY = Math.max(bottomPath[i][1], pmaxY);
          }
          const rate = (maxY - minY) / (pmaxY - pminY);
          for (let i = 0; i < upperPath.length; i++) {
            upperPath[i][1] = rate * (upperPath[i][1] - pminY) + minY;
          }
          for (let i = 0; i < bottomPath.length; i++) {
            bottomPath[i][1] = rate * (bottomPath[i][1] - pminY) + minY;
          }
          let increment = Math.floor(
            upperPath.length / (eTimeID - sTimeID + 1)
          );
          for (let j = 0; j < names.length; j++) {
            for (let i = 0; i < newLayout.array.length; i++) {
              if (newLayout.array[i].name === names[j]) {
                for (let k = sTimeID, st = 0; k <= eTimeID; k++, st++) {
                  if (newLayout.perm[i][k] !== -1) {
                    let l = st * increment;
                    let r = (st + 1) * increment - 1;
                    let m = Math.floor((l + r) / 2);
                    newLayout.array[i].points[k].item3 =
                      ((bottomPath[m][1] - upperPath[m][1]) / (maxY - minY)) *
                        (newLayout.array[i].points[k].item3 - minY) +
                      upperPath[m][1];
                  }
                }
              }
            }
          }
          this.props.updateLayoutAction(newLayout);
        }
      } else {
        // this.openTransformNotification();
        this.openNotification(
          'Transform',
          'Please draw a circle to select at least one group, then draw a free path.'
        );
      }
    }
  }

  openNotification = (toolName: string, msg: string, duration = 8) => {
    notification.error({
      message: toolName,
      description: msg,
      duration: duration,
      placement: 'topLeft',
      style: {
        color: 'white'
      }
    });
  };

  render() {
    return <ToolCanvas />;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UtilCanvas);
