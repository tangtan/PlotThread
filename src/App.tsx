import React from 'react';
import { connect } from 'react-redux';
import {
  getToolState,
  getSelectedObjMountState,
  getSelectedObjType
} from './store/selectors';
import './App.css';
import 'antd/dist/antd.css';
import MenuBar from './components/menubar';
import ToolBar from './components/toolbar';
import DrawCanvas from './components/canvas/DrawCanvas';
import ShapeModal from './components/toolbar/tools/ShapeModal';
import UploadModal from './components/toolbar/tools/UploadModal';
import StyleModal from './components/toolbar/tools/StyleModal';
import { ITool, StateType } from './types';

const mapStateToProps = (state: StateType) => {
  return {
    lineToolState:
      getSelectedObjMountState(state) && getSelectedObjType(state) !== 'image',
    groupToolState: getToolState(state, 'Back') || false,
    freeMode: getToolState(state, 'FreeMode')
  };
};

type Props = {} & ReturnType<typeof mapStateToProps>;

type State = {
  mouseX: number;
  mouseY: number;
  leftTools: ITool[];
  topTools: ITool[];
  lineTools: ITool[];
  groupTools: ITool[];
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mouseX: 0,
      mouseY: 0,
      leftTools: [
        {
          name: 'AddLine',
          type: 'svg',
          url: 'svg/Menu_Left/Add.svg',
          subTools: []
        },
        {
          name: 'Group',
          type: 'svg',
          url: 'svg/Menu_Left/Group.svg',
          subTools: []
        },
        {
          name: 'Sort',
          type: 'svg',
          url: 'svg/Menu_Left/Sort.svg',
          subTools: []
        },
        {
          name: 'Straighten',
          type: 'svg',
          url: 'svg/Menu_Left/Bend.svg',
          subTools: []
        },
        {
          name: 'Compress',
          type: 'svg',
          url: 'svg/Menu_Left/Scale.svg',
          subTools: []
        },
        {
          name: 'Reshape',
          type: 'svg',
          url: 'svg/Menu_Left/Adjust.svg',
          subTools: []
        },
        {
          name: 'Zoom',
          type: 'svg',
          url: 'svg/Menu_Left/Move.svg',
          subTools: []
        }
      ],
      topTools: [
        {
          name: 'File',
          type: 'svg',
          url: 'svg/Menu_Top/File.svg',
          subTools: []
        },
        {
          name: 'Download',
          type: 'svg',
          url: 'svg/Menu_Top/Download.svg',
          subTools: []
        },
        {
          name: 'Save',
          type: 'svg',
          url: 'svg/Menu_Top/Save.svg',
          subTools: []
        },
        {
          name: 'Back',
          type: 'svg',
          url: 'svg/Menu_Top/Backward.svg',
          subTools: []
        },
        {
          name: 'Forward',
          type: 'svg',
          url: 'svg/Menu_Top/Forward.svg',
          subTools: []
        }
      ],
      lineTools: [
        {
          name: 'Stroke',
          type: 'svg',
          url: 'svg/Menu_Tools/Stroke_Dashed.svg',
          subTools: [
            {
              name: 'StrokeDash',
              type: 'svg',
              url: 'svg/Menu_Tools/Stroke_Dashed.svg',
              subTools: []
            },
            {
              name: 'StrokeWidth',
              type: 'svg',
              url: 'svg/Menu_Tools/Stroke_Zigzag.svg',
              subTools: []
            },
            {
              name: 'StrokeZigzag',
              type: 'svg',
              url: 'svg/Menu_Tools/Stroke_Zigzag2.svg',
              subTools: []
            },
            {
              name: 'StrokeWave',
              type: 'svg',
              url: 'svg/Menu_Tools/Stroke_Curve.svg',
              subTools: []
            }
          ]
        },
        {
          name: 'Symbol',
          type: 'svg',
          url: 'svg/Menu_Tools/Symbols.svg',
          subTools: [
            {
              name: 'SymbolPic',
              type: 'svg',
              url: 'svg/Menu_Tools/Symbol_Add Pic.svg',
              subTools: []
            },
            {
              name: 'StrokeStyle',
              type: 'svg',
              url: 'svg/Menu_Tools/Symbol_Appear.svg',
              subTools: []
            },
            {
              name: 'SymbolStar',
              type: 'svg',
              url: 'svg/Menu_Tools/Symbol_Star.svg',
              subTools: []
            }
          ]
        },
        {
          name: 'Text',
          type: 'svg',
          url: 'svg/Menu_Tools/Text.svg',
          subTools: []
        },
        {
          name: 'Bump',
          type: 'svg',
          url: 'svg/Menu_Tools/Bump.svg',
          subTools: [
            {
              name: 'Collide',
              type: 'svg',
              url: 'svg/Menu_Tools/Bump_Collide.svg',
              subTools: []
            },
            {
              name: 'Knot',
              type: 'svg',
              url: 'svg/Menu_Tools/Bump_Knot.svg',
              subTools: []
            },
            {
              name: 'Twine',
              type: 'svg',
              url: 'svg/Menu_Tools/Bump_Twine.svg',
              subTools: []
            }
          ]
        },
        {
          name: 'MergeSplit',
          type: 'svg',
          url: 'svg/Menu_Tools/Merge.svg',
          subTools: [
            {
              name: 'Merge',
              type: 'svg',
              url: 'svg/Menu_Tools/Merge.svg',
              subTools: []
            },
            {
              name: 'Split',
              type: 'svg',
              url: 'svg/Menu_Tools/Split.svg',
              subTools: []
            }
          ]
        }
      ],
      groupTools: [
        {
          name: 'Bump',
          type: 'svg',
          url: 'svg/Menu_Tools/Bump.svg',
          subTools: [
            {
              name: 'BumpCollide',
              type: 'svg',
              url: 'svg/Menu_Tools/Bump_Collide.svg',
              subTools: []
            },
            {
              name: 'BumpKnot',
              type: 'svg',
              url: 'svg/Menu_Tools/Bump_Knot.svg',
              subTools: []
            },
            {
              name: 'BumpTwine',
              type: 'svg',
              url: 'svg/Menu_Tools/Bump_Twine.svg',
              subTools: []
            }
          ]
        },
        {
          name: 'MergeSplit',
          type: 'svg',
          url: 'svg/Menu_Tools/Merge.svg',
          subTools: [
            {
              name: 'Merge',
              type: 'svg',
              url: 'svg/Menu_Tools/Merge.svg',
              subTools: []
            },
            {
              name: 'Split',
              type: 'svg',
              url: 'svg/Menu_Tools/Split.svg',
              subTools: []
            }
          ]
        }
      ]
    };
  }

  handleMousePos = (e: any) => {
    if (this.props.freeMode) {
      this.setState({
        mouseX: e.clientX,
        mouseY: e.clientY
      });
    }
  };

  render() {
    const {
      topTools,
      leftTools,
      lineTools,
      groupTools,
      mouseX,
      mouseY
    } = this.state;
    const { lineToolState, groupToolState } = this.props;
    return (
      <div className="App" onDoubleClick={this.handleMousePos}>
        <MenuBar mounted={true} right={100} bottom={100} tools={lineTools} />
        {/* <MenuBar
          mounted={groupToolState}
          centerX={mouseX}
          centerY={mouseY}
          tools={groupTools}
        /> */}
        <DrawCanvas />
        <ShapeModal />
        <UploadModal />
        <StyleModal />
        <ToolBar
          Top={0}
          Left={400}
          Hidden={true}
          Direction={'horizontal'}
          Tools={topTools}
        />
        <ToolBar Top={200} Left={0} Direction={'vertical'} Tools={leftTools} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(App);
