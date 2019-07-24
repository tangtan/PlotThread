import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import { getToolState } from '../../../../store/selectors';
import { setTool } from '../../../../store/actions';
import { SketchPicker, SliderPicker } from 'react-color';
import './StyleModal.css';

const mapStateToProps = (state: StateType) => {
  return {
    strokeStyleState: getToolState(state, 'StrokeStyle')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeStyleTool: () => dispatch(setTool('StrokeStyle', false))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  background: string;
};

function ColorPicker(props: any) {
  if (!props.strokeStyleState) {
    return null;
  }
  return (
    // <SketchPicker></SketchPicker>
    <SketchPicker
      color={props.color}
      onChangeComplete={props.onChangeComplete}
    />
  );
}

class StyleModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      background: '#fff'
    };
  }

  handleChangeComplete = (color: any) => {
    this.setState({ background: color.hex });
    this.props.closeStyleTool();
  };

  render() {
    const { strokeStyleState } = this.props;
    return (
      <div className="style-modal">
        <ColorPicker
          color={this.state.background}
          onChangeComplete={this.handleChangeComplete}
          strokeStyleState={strokeStyleState}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyleModal);
