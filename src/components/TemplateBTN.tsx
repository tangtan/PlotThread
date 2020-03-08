import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../types';
import { Button, Progress, Menu } from 'antd';
import { iStoryline } from 'iStoryline';
import axios from 'axios';
import {
  getCurrentStoryFlowProtoc,
  getCurrentStoryFlowLayout,
  getHistoryPointer
} from '../store/selectors';
import {
  addAction,
  newPredictAction,
  setTool,
  recordPointerAction
} from '../store/actions';
import ReactSVG from 'react-svg';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    storyLayout: getCurrentStoryFlowLayout(state),
    pointer: getHistoryPointer(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addAction: (protoc: any, layout: any, scale: number) =>
      dispatch(addAction(protoc, layout, scale)),
    newPredictAction: (newPredictQueue: any[]) =>
      dispatch(newPredictAction(newPredictQueue)),
    recordPointerAction: (originalPointer: number) =>
      dispatch(recordPointerAction(originalPointer)),
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  serverPredictUrl: string;
  storyLayouter: any;
  percent: number;
  predictSignal: boolean;
};

class TemplateBTN extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverPredictUrl: 'api/predict',
      storyLayouter: new iStoryline(),
      percent: 0,
      predictSignal: false
    };
  }

  increase = () => {
    let percent = this.state.percent + 1;
    if (percent > 98) {
      percent = 98;
    }
    this.setState({ percent });
  };
  clickCancel() {
    this.setState({
      predictSignal: false
    });
    this.props.activateTool('Setting', false);
  }
  async clickAi() {
    const originalPointer = this.props.pointer;
    this.setState({
      percent: 0,
      predictSignal: true
    });
    this.props.recordPointerAction(originalPointer);
    //console.log(originalPointer);
    let tmpID = setInterval(() => this.increase(), 1000);
    const protoc = this.props.storyProtoc;
    const data = this.props.storyLayout;
    this.props.activateTool('Setting', true);
    const postReq = { data: data, protoc: protoc };
    //console.log(JSON.stringify(postReq));
    const postUrl = this.state.serverPredictUrl;
    const postRes = await axios.post(postUrl, postReq);
    clearInterval(tmpID);
    if (this.state.predictSignal) {
      let newPredictQueue = [];
      for (let i = 0; i < postRes.data.data.length; i++) {
        newPredictQueue[i] = {
          layout: postRes.data.data[i],
          protoc: postRes.data.protoc[i]
        };
      }
      this.setState({
        percent: 100,
        predictSignal: false
      });
      const graph = this.state.storyLayouter._layout(
        postRes.data.data[0],
        postRes.data.protoc[0]
      );
      this.props.addAction(
        postRes.data.protoc[0],
        postRes.data.data[0],
        graph.scaleRate
      );
      this.props.newPredictAction(newPredictQueue);
    }
  }

  render() {
    let { percent, predictSignal } = this.state;
    let myProgress = (
      <Progress
        percent={percent}
        type="circle"
        strokeWidth={6}
        width={300}
        strokeColor="#6376cc"
        style={{
          position: 'fixed',
          left: '38vw',
          bottom: '32vh',
          background: 'rgba(52,55,62,0.6)',
          borderRadius: '3px'
        }}
      />
    );
    const AI = <ReactSVG src="svg/Menu_Ai/AI generator.svg"></ReactSVG>;
    return (
      <div className="ai-btn">
        <Button
          type="primary"
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '60px',
            background: '#34373e'
          }}
          size="large"
          shape="circle"
          onClick={() => this.clickAi()}
        >
          Ai
        </Button>
        <Button
          type="primary"
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '60px',
            background: '#34373e'
          }}
          size="large"
          shape="circle"
          disabled={!this.state.predictSignal}
          onClick={() => this.clickCancel()}
        >
          X
        </Button>
        {predictSignal ? myProgress : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateBTN);
