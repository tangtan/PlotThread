import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import { Menu, Dropdown } from 'antd';
import {
  getSelectedVisualObjects,
  getToolState
} from '../../../../store/selectors';
import { setTool } from '../../../../store/actions';
import { Button } from 'antd/lib/radio';
import { Item } from 'paper';

const mapStateToProps = (state: StateType) => {
  return {
    selectedItems: getSelectedVisualObjects(state),
    strokeWidthState: getToolState(state, 'StrokeWidth')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {
  xOffSet?: number;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  width: number;
};

class StrokePicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      width: 1
    };
  }

  changeWidth(key: string) {
    const width = (key as unknown) as number;
    this.setState({
      width: width
    });
    const { strokeWidthState, selectedItems } = this.props;
    selectedItems.forEach(item => this.changeItemWidth(item, width));
  }

  changeItemWidth(item: Item, width: number) {
    switch (item.data.type) {
      case 'storyline':
        this.changeLineWidth(item, width);
        break;
      default:
        item.strokeWidth = width;
        break;
    }
  }

  changeLineWidth(item: Item, width: number) {
    if (item.children && item.children.length) {
      let flag = item.children[0].selected;
      for (let i = 1; i < item.children.length; i++) {
        if (flag || item.children[i].selected) {
          item.children[i].strokeWidth = width;
        }
      }
    }
  }

  handleClick() {
    this.props.activateTool('StrokeWidth', true);
  }

  render() {
    const menu = (
      <Menu onClick={({ key }) => this.changeWidth(key)}>
        <Menu.Item key="1">
          <img src="icons/l1.png" />
          1px
        </Menu.Item>
        <Menu.Item key="2">
          <img src="icons/l2.png" />
          2px
        </Menu.Item>
        <Menu.Item key="3">
          <img src="icons/l3.png" />
          3px
        </Menu.Item>
        <Menu.Item key="4">
          <img src="icons/l4.png" />
          4px
        </Menu.Item>
        <Menu.Item key="5">
          <img src="icons/l5.png" />
          5px
        </Menu.Item>
      </Menu>
    );
    const url = `icons/l${this.state.width}.png`;

    return (
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            style={{
              width: 120,
              margin: '0 0 0 10px',
              background: '#34373e',
              color: '#fff'
            }}
            onClick={() => {
              this.handleClick();
            }}
          >
            {/*{this.state.width}*/}
            <img src={url} />
          </Button>
        </Dropdown>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StrokePicker);
