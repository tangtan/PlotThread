import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import MenuBar from './components/menubar';
import ToolBar from './components/toolbar';
import ShapeModal from './components/toolbar/tools/ShapeModal';
import DrawCanvas from './components/canvas/DrawCanvas';
import { ITool } from './types';

type Props = {};

type State = {
  leftTools: ITool[];
  topTools: ITool[];
  lineTools: ITool[];
  groupTools: ITool[];
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      leftTools: [
        {
          name: 'AddLine',
          type: 'svg',
          url: 'svg/Menu_Left/AddLine.svg',
          subTools: []
        },
        {
          name: 'Group',
          type: 'svg',
          url: 'svg/Menu_Left/Scissors.svg',
          subTools: []
        },
        {
          name: 'Sort',
          type: 'svg',
          url: 'svg/Menu_Tools/Group.svg',
          subTools: []
        },
        {
          name: 'Bend',
          type: 'svg',
          url: 'svg/Menu_Tools/Bend.svg',
          subTools: []
        },
        {
          name: 'Scale',
          type: 'svg',
          url: 'svg/Menu_Left/Scale.svg',
          subTools: []
        },
        {
          name: 'Reshape',
          type: 'svg',
          url: 'svg/Menu_Left/Adjust_Global.svg',
          subTools: []
        },
        {
          name: 'Move',
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
          url: 'svg/Menu_Top/Back.svg',
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
              name: 'StrokeZigzag',
              type: 'svg',
              url: 'svg/Menu_Tools/Stroke_Zigzag.svg',
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
              name: 'SymbolAppear',
              type: 'svg',
              url: 'svg/Menu_Tools/Symbol_Appear.svg',
              subTools: []
            },
            {
              name: 'SymbolDead',
              type: 'svg',
              url: 'svg/Menu_Tools/Symbol_Dead.svg',
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
        }
      ],
      groupTools: []
    };
  }

  render() {
    const { topTools, leftTools, lineTools, groupTools } = this.state;
    return (
      <div className="App">
        <MenuBar tools={lineTools} />
        <DrawCanvas />
        <ShapeModal />
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

export default App;
