import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import {
  getToolState,
  getSelectedObjMountState,
  getSelectedObjStrokeColor,
  getSelectedObjFillColor
} from '../../../../store/selectors';
import {
  setTool,
  setObject,
  setObjectFillColor,
  setObjectStrokeColor
} from '../../../../store/actions';
import { SketchPicker } from 'react-color';
import { Color, Point } from 'paper';
import './StyleModal.css';

const mapStateToProps = (state: StateType) => {
  return {
    objectMounted: getSelectedObjMountState(state),
    strokeStyleState: getToolState(state, 'StrokeStyle'),
    fillStyleState: getToolState(state, 'FillStyle'),
    strokeColor: getSelectedObjStrokeColor(state),
    fillColor: getSelectedObjFillColor(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeObject: () => dispatch(setObject(new Point(-100, -100))),
    closeStrokeStyleTool: () => dispatch(setTool('StrokeStyle', false)),
    closeFillStyleTool: () => dispatch(setTool('FillStyle', false)),
    setFillColor: (color: Color) => dispatch(setObjectFillColor(color)),
    setStrokeColor: (color: Color) => dispatch(setObjectStrokeColor(color))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

function ColorPicker(props: any) {
  const { color, fillStyleState, strokeStyleState, objectMounted } = props;
  if ((!strokeStyleState && !fillStyleState) || !objectMounted) {
    return null;
  }
  // TODO: support other types
  let color255 = { r: 0, g: 0, b: 0 };
  switch (color.type) {
    case 'rgb':
      const [r, g, b] = color.components;
      color255.r = Math.round(r * 255);
      color255.g = Math.round(g * 255);
      color255.b = Math.round(b * 255);
      break;
    default:
      break;
  }
  return (
    <SketchPicker color={color255} onChangeComplete={props.onChangeComplete} />
  );
}

class StyleModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleChangeComplete = (color: any) => {
    const { r, g, b, a } = color.rgb;
    const newColor = new Color(r / 255, g / 255, b / 255, a);
    const {
      strokeStyleState,
      strokeColor,
      fillStyleState,
      fillColor
    } = this.props;
    if (strokeStyleState && strokeColor) {
      this.props.setStrokeColor(newColor);
      this.props.closeStrokeStyleTool();
    }
    if (fillStyleState && fillColor) {
      this.props.setFillColor(newColor);
      this.props.closeFillStyleTool();
    }
    this.props.closeObject();
  };

  render() {
    const {
      strokeStyleState,
      fillStyleState,
      strokeColor,
      fillColor,
      objectMounted
    } = this.props;
    const color = strokeStyleState
      ? strokeColor
      : fillStyleState
      ? fillColor
      : null;
    return (
      <div className="style-modal">
        <ColorPicker
          color={color}
          objectMounted={objectMounted}
          fillStyleState={fillStyleState}
          strokeStyleState={strokeStyleState}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyleModal);
