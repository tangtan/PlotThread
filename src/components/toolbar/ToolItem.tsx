import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ITool } from './index';
import './toolbar.css';
import { DispatchType, StateType } from '../../types';
import { setTool } from '../../store/actions';
import { Popover } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {
    toolName: state.toolState.toolName
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
    const name = this.props.toolInfo.name;
    const use = !this.state.isClicked;
    this.props.activateTool(name, use);
    this.setState({
      isClicked: !this.state.isClicked
    });
  };

  render() {
    const subTools = (
      <div className="sub-tools-wrapper">
        {this.props.toolInfo.subTools.map(subTool => (
          <p>{subTool}</p>
        ))}
      </div>
    );

    return (
      <Popover placement="topLeft" content={subTools}>
        <div
          className={
            this.props.toolName === this.props.toolInfo.name &&
            this.state.isClicked
              ? 'toolbar-icon-clicked'
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
      </Popover>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolItem);
