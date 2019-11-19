import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import {
  getToolState,
  getSelectedVisualObjects
} from '../../../../store/selectors';
import { setTool } from '../../../../store/actions';
import { SketchPicker } from 'react-color';
import { Color, Group } from 'paper';
import './StyleModal.css';

const mapStateToProps = (state: StateType) => {
  return {
    selectedItems: getSelectedVisualObjects(state),
    strokeStyleState: getToolState(state, 'StrokeStyle'),
    fillStyleState: getToolState(state, 'FillStyle')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    closeStrokeStyleTool: () => dispatch(setTool('StrokeStyle', false)),
    closeFillStyleTool: () => dispatch(setTool('FillStyle', false))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

function ColorPicker(props: any) {
  const {
    selectedItems,
    fillStyleState,
    strokeStyleState,
    onChangeComplete
  } = props;
  if (!strokeStyleState && !fillStyleState) {
    return null;
  }
  // Obtain the color of the selected items
  let _selectedItems = selectedItems.map((item: Group) => item);
  let selectedColor = pickColorFromSelectedItems(
    _selectedItems,
    strokeStyleState,
    fillStyleState
  );
  // TODO: support other types, such as hsl
  let color255 = { r: 0, g: 0, b: 0, a: 1 };
  switch (selectedColor.type) {
    case 'rgb':
      const [r, g, b] = selectedColor.components;
      color255.r = Math.round(r * 255);
      color255.g = Math.round(g * 255);
      color255.b = Math.round(b * 255);
      color255.a = selectedColor.alpha || 1;
      break;
    default:
      break;
  }
  return <SketchPicker color={color255} onChangeComplete={onChangeComplete} />;
}

function pickColorFromSelectedItems(
  items: any[],
  strokeColor: boolean,
  fillColor: boolean
) {
  const defaultColor = new Color(0, 0, 0, 1);
  if (items.length === 0) {
    return defaultColor;
  }
  let color;
  if (strokeColor) {
    color = BSFSearch(items, 'strokeColor');
    console.log(color);
  }
  if (fillColor) {
    color = BSFSearch(items, 'fillColor');
  }
  return color || defaultColor;
}

function DSFSearch(node: any, style = 'fillColor') {
  const color = style === 'fillColor' ? node.fillColor : node.strokeColor;
  if (color) return color;
  node.children.forEach((_node: any) => {
    const _color = DSFSearch(_node, style);
    if (_color) return _color;
  });
  return color;
}

// 会破坏原数组，最好用一个域外变量来记录队列
function BSFSearch(nodes: any[], style = 'fillColor'): Color | undefined {
  if (nodes.length === 0) return undefined;
  const firstNode = nodes.shift();
  const color =
    style === 'fillColor' ? firstNode.fillColor : firstNode.strokeColor;
  if (color) return color;
  if (firstNode.children) {
    nodes.push(...firstNode.children);
  }
  return BSFSearch(nodes, style);
}

class StyleModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleChangeComplete = (color: any) => {
    const { r, g, b, a } = color.rgb;
    const newColor = new Color(r / 255, g / 255, b / 255, a);
    const { strokeStyleState, fillStyleState, selectedItems } = this.props;
    if (strokeStyleState) {
      selectedItems.forEach(item => (item.strokeColor = newColor));
      this.props.closeStrokeStyleTool();
    }
    if (fillStyleState) {
      selectedItems.forEach(item => (item.fillColor = newColor));
      this.props.closeFillStyleTool();
    }
  };

  render() {
    const { selectedItems, strokeStyleState, fillStyleState } = this.props;
    return (
      <div className="style-modal">
        <ColorPicker
          selectedItems={selectedItems}
          strokeStyleState={strokeStyleState}
          fillStyleState={fillStyleState}
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
