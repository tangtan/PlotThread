import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType, ITool } from '../../../types';
import { getToolState } from '../../../store/selectors';
import { setTool, addVisualObject } from '../../../store/actions';
import { Button, Divider } from 'antd';
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
      top: 50,
      width: 300,
      shapes: [
        'appear',
        'end',
        'spark',
        'highlight',
        'star',
        'circle',
        'rectangle',
        'triangle',
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
      padding: 15px;
      background: #34373e;
      opacity: 0.9;
    `;
    const Grid = styled.div`
      position: relative;
      width: 100%;
    `;
    const Item = styled.div`
      display: block;
      position: absolute;
      width: 74px;
      height: 100px;
      z-index: 2001;
      padding: 20px 10px;
      color: #fff;
    `;
    const Content = styled.div`
      position: relative;
      width: 100%;
      font-size: 14px;
      height: 100%;
    `;
    const ItemList = shapes.map(shape => (
      <Item className=".item" key={shape}>
        <div className="item-wrapper">
          <div className="item-image-wrapper">
            <img
              className="toolbar-icon-img"
              src={`icons/${shape}.png`}
              alt={shape}
            />
          </div>
          <Content className=".item-content">{shape}</Content>
        </div>
      </Item>
    ));
    return (
      <div className="panel" ref={this.rootElement}>
        <Nav className="nav">
          <div className="panel-title">Symbols</div>
          <Divider className="panel-divider" />
          <div style={{ margin: '0 0 50px 0' }}>
            <Grid className="grid" ref={this.gridElement}>
              {ItemList}
            </Grid>
          </div>
          <div className="panel-title">Images</div>
          <Divider className="panel-divider" />
          <Button
            type="ghost"
            onClick={() => this.props.openPicture()}
            style={{ width: '100%', margin: '20px 0' }}
          >
            Insert Image
          </Button>
        </Nav>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbellishPanel);
