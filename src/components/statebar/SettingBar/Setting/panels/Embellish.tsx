import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../../types';
// import { getToolState } from "../../../../../store/selectors";
import { setTool, addVisualObject } from '../../../../../store/actions';
import { Button } from 'antd';
import Muuri from 'muuri';
import styled from 'styled-components';

const mapStateToProps = (state: StateType) => {
  return {};
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    openPicture: () => dispatch(setTool('SymbolPic', true)),
    closeSetting: () => dispatch(setTool('Setting', false)),
    insertShape: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  shapes: string[];
};

class EmbellishPanel extends Component<Props, State> {
  private gridElement = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    // 绑定Muuri类
    if (this.gridElement.current) {
      const grid = new Muuri(this.gridElement.current, {
        dragEnabled: true
      });
      grid.on('dragEnd', (item: any, e: any) => {
        const type = item._element.textContent;
        // TODO: consider zoom level
        const x0 = e.clientX;
        const y0 = e.clientY;
        this.props.insertShape(type, { x: x0, y: y0 });
        // console.log(item, e);
      });
    }
  }

  insertImage() {
    this.props.closeSetting();
    this.props.openPicture();
  }

  render() {
    const { shapes } = this.state;
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
      text-align: center;
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
      <div className="settingbar-content-wrapper">
        <div className="settingbar-content-title">Symbols</div>
        <div style={{ margin: '0 0 50px 0' }}>
          <Grid className="grid" ref={this.gridElement}>
            {ItemList}
          </Grid>
        </div>
        <div className="settingbar-content-title">Images</div>
        <Button
          type="ghost"
          onClick={() => this.insertImage()}
          style={{ width: '100%', margin: '20px 0' }}
        >
          Insert Image
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbellishPanel);
