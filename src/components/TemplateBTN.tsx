import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../types';
import { Button, Progress } from 'antd';
import { iStoryline } from 'iStoryline';
import axios from 'axios';
import {
  getCurrentStoryFlowProtoc,
  getCurrentStoryFlowLayout
} from '../store/selectors';
import { addAction, newPredictAction, setTool } from '../store/actions';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    storyLayout: getCurrentStoryFlowLayout(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addAction: (protoc: any, layout: any, scale: number) =>
      dispatch(addAction(protoc, layout, scale)),
    newPredictAction: (newPredictQueue: any[]) =>
      dispatch(newPredictAction(newPredictQueue)),
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  serverPredictUrl: string;
  storyLayouter: any;
  percent: number;
  progressVisible: boolean;
};

class TemplateBTN extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverPredictUrl: 'api/predict',
      storyLayouter: new iStoryline(),
      percent: 0,
      progressVisible: false
    };
  }

  increase = () => {
    let percent = this.state.percent + 1;
    if (percent > 98) {
      percent = 98;
    }
    this.setState({ percent });
  };

  async handleClick() {
    this.setState({
      percent: 0,
      progressVisible: true
    });
    let tmpID = setInterval(() => this.increase(), 1000);
    const protoc = this.props.storyProtoc;
    const data = this.props.storyLayout;
    this.props.activateTool('Setting', true);
    const postReq = { data: data, protoc: protoc };
    const postUrl = this.state.serverPredictUrl;
    const postRes = await axios.post(postUrl, postReq);
    clearInterval(tmpID);
    let newPredictQueue = [];
    // for (let i = 0; i < 7; i++) {
    //   newPredictQueue[i] = {
    //     layout: postRes.data.data[0],
    //     protoc: postRes.data.protoc[0]
    //   };
    // }
    for (let i = 0; i < postRes.data.data.length; i++) {
      newPredictQueue[i] = {
        layout: postRes.data.data[i],
        protoc: postRes.data.protoc[i]
      };
    }
    this.setState({
      percent: 100,
      progressVisible: false
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

  render() {
    let { percent, progressVisible } = this.state;
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
    return (
      <div className="ai-btn">
        <Button
          type="primary"
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '60px',
            background: '#34373e'
          }}
          size="large"
          shape="circle"
          onClick={() => this.handleClick()}
        >
          AI
        </Button>
        {progressVisible ? myProgress : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateBTN);
