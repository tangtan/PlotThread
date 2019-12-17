import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../types';
import { getToolState } from '../../../../store/selectors';
import { setTool, addVisualObject } from '../../../../store/actions';
import { Button } from 'antd';
import Muuri from 'muuri';
import styled from 'styled-components';
import './Grid.css';

const mapStateToProps = (state: StateType) => {
  return {
    visible: getToolState(state, 'Bellish')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    openPicture: () => dispatch(setTool('SymbolPic', true)),
    insertShape: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  top: number;
  width: number;
  shapes: string[];
};

class EmbellishPanel extends Component<Props, State> {
  private rootElement = React.createRef<HTMLDivElement>();
  private gridElement = React.createRef<HTMLDivElement>();
  constructor(props: Props) {
    super(props);
    this.state = {
      top: 52,
      width: 320,
      shapes: [
        'circle',
        'ellipse',
        'triangle',
        'rectangle',
        'pentagon',
        'hexagon'
      ]
    };
  }

  // 每次弹出侧边栏时应该重新绑定Muuri类，因此应当写在componentDidUpdate函数中
  // componentDidMount() {
  //   if (this.gridElement.current) {
  //     const grid = new Muuri(this.gridElement.current, {
  //       dragEnabled: true
  //     });
  //   }
  // }

  componentDidUpdate() {
    // 弹出侧边栏
    if (this.rootElement.current) {
      const node = this.rootElement.current;
      node.classList.toggle('is-nav-open');
    }
    // 绑定Muuri类
    const startId = 2;
    if (this.gridElement.current) {
      const grid = new Muuri(this.gridElement.current, {
        dragEnabled: true
      });
      grid.on('dragEnd', (item: any, e: any) => {
        const _id = item._id;
        const type = this.state.shapes[_id - startId];
        // TODO: consider zoom level
        const x0 = e.clientX;
        const y0 = e.clientY;
        this.props.insertShape(type, { x: x0, y: y0 });
        // console.log(e);
      });
    }
  }

  render() {
    const { top, width, shapes } = this.state;
    // 隔离内部组件与Wrapper
    // Wrapper只负责弹出动画
    // top & width 属性需与CSS文件同步更新
    const Nav = styled.div`
      position: relative;
      width: ${width}px;
      height: calc(100vh - ${top}px);
      padding: 5px;
      background: #222;
    `;
    const Grid = styled.div`
      position: relative;
    `;
    const Item = styled.div`
      display: block;
      position: absolute;
      width: 100px;
      height: 100px;
      margin: 5px;
      z-index: 2001;
      background: #000;
      color: #fff;
    `;
    const Content = styled.div`
      position: relative;
      width: 100%;
      height: 100%;
    `;
    const ItemList = shapes.map(shape => (
      <Item className=".item" key={shape}>
        <Content className=".item-content">{shape}</Content>
      </Item>
    ));
    return (
      <div className="panel" ref={this.rootElement}>
        <Nav className="nav">
          <Button type="ghost" onClick={() => this.props.openPicture()}>
            Insert Image
          </Button>
          <Grid className="grid" ref={this.gridElement}>
            {ItemList}
          </Grid>
        </Nav>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbellishPanel);
