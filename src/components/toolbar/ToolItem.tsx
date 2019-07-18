import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ITool } from './index';
import './ToolBar.css';
import { DispatchType, StateType } from '../../types';
import { setTool } from '../../store/actions';
import { getToolState } from '../../store/selectors';

const mapStateToProps = (state: StateType) => {
  return {
    toolName: state.toolState.toolName,
    toolState: getToolState(state, state.toolState.toolName)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {
  toolInfo: ITool;
} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

type State = {
  isClicked: boolean;
};

class ToolItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isClicked: false
    };
  }

  private onClick = () => {
    // 同步工具状态
    this.setState({
      isClicked: this.props.toolState
    });
    const name = this.props.toolInfo.name;
    const use = !this.state.isClicked;
    this.props.activateTool(name, use);
    // 同步点击状态
    this.setState({
      isClicked: use
    });
  };

  render() {
    return (
      <div
        className={
          this.props.toolName === this.props.toolInfo.name &&
          this.state.isClicked &&
          this.props.toolState
            ? 'toolbar-icon-box-clicked'
            : 'toolbar-icon-box'
        }
        onClick={this.onClick}
      >
        <img
          className="toolbar-icon-pic"
          src={this.props.toolInfo.url}
          alt={this.props.toolInfo.name}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolItem);
