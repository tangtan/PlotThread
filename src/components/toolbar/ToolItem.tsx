import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ITool } from '../../types';
import './ToolBar.css';
import { DispatchType, StateType } from '../../types';
import { setTool } from '../../store/actions';
import { getToolName } from '../../store/selectors';
import ReactSVG from 'react-svg';
import ToolBar from './index';

const mapStateToProps = (state: StateType) => {
  return {
    toolName: getToolName(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    openTool: (name: string, use: boolean) => dispatch(setTool(name, use)),
    closeTools: () => dispatch(setTool('FreeMode', true))
  };
};

type Props = {
  toolInfo: ITool;
} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

type State = {};

class ToolItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private onClick = () => {
    const lastToolName = this.props.toolName;
    const currToolName = this.props.toolInfo.name;
    this.props.closeTools();
    if (currToolName !== lastToolName) {
      this.props.openTool(currToolName, true);
    }
  };

  isShowSubToolBar() {
    const currentToolName = this.props.toolName;
    const subToolsName = this.props.toolInfo.subTools.map(_ => _.name);
    const validToolList = [...subToolsName, this.props.toolInfo.name];
    return validToolList.includes(currentToolName);
  }

  render() {
    const imgIcon = (
      <img
        className="toolbar-icon-img"
        src={this.props.toolInfo.url}
        alt={this.props.toolInfo.name}
      />
    );

    const svgIcon = <ReactSVG src={this.props.toolInfo.url} />;

    const { subTools } = this.props.toolInfo;
    const subToolBar =
      this.props.toolInfo.subTools.length > 0 ? (
        <ToolBar Top={-50} Direction={'horizontal'} Tools={subTools} />
      ) : null;

    return (
      <div className="toolbar-icon-wrapper">
        <div
          className={
            this.props.toolName === this.props.toolInfo.name
              ? 'toolbar-icon-box-clicked'
              : 'toolbar-icon-box'
          }
          onClick={this.onClick}
        >
          {this.props.toolInfo.type === 'svg' ? svgIcon : imgIcon}
        </div>
        {this.isShowSubToolBar() ? subToolBar : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolItem);
