import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ITool, DispatchType, StateType } from '../../../types';
import './AddEventPanel.css';
import { setGroupEvent } from '../../../store/actions';
import {
  getGroupEventState,
  getGroupEventName
} from '../../../store/selectors';
import ReactSVG from 'react-svg';

const mapStateToProps = (state: StateType) => {
  return {
    toolName: getGroupEventName(state),
    toolState: getGroupEventState(
      state,
      state.groupEventState.groupEventName
    ) as boolean
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string, use: boolean) =>
      dispatch(setGroupEvent(name, use))
  };
};

type Props = {
  toolInfo: ITool;
} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

type State = {
  isClicked: boolean;
};

class GroupEventItem extends Component<Props, State> {
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
    // console.log(name, use);
    // 同步点击状态
    this.setState({
      isClicked: use
    });
  };

  render() {
    const imgIcon = (
      <img
        className="toolbar-icon-img"
        src={this.props.toolInfo.url}
        alt={this.props.toolInfo.name}
      />
    );

    const svgIcon = <ReactSVG src={this.props.toolInfo.url} />;

    return (
      <div className="toolbar-icon-wrapper">
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
          {this.props.toolInfo.type === 'svg' ? svgIcon : imgIcon}
        </div>
        {this.state.isClicked && this.props.toolName != 'Setting' ? (
          <div className="toolbar-icon-annotation">{this.props.toolName}</div>
        ) : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupEventItem);