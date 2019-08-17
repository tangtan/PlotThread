import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieMenu, { PieCenter, Slice } from 'react-pie-menu';
import { ITool } from '../../types';
import { ThemeProvider } from 'styled-components';
import * as styles from './index.style';
import { setTool } from '../../store/actions';
import { StateType, DispatchType } from '../../types';
import ReactSVG from 'react-svg';

const mapStateToProps = (state: StateType) => {
  return {};
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string) => dispatch(setTool(name, true))
  };
};

const theme = {
  pieMenu: {
    container: styles.container,
    center: styles.center
  },
  slice: {
    container: styles.slice
  }
};

type Props = {
  mounted: boolean;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  radius?: number;
  centerRadius?: number;
  tools: ITool[];
} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

type State = {
  center: ITool;
  option: number; // menu id
  toolName: string;
  expandUrl: string;
};

function MenuPanel(props: any) {
  const {
    mounted,
    theme,
    centerRadius,
    radius,
    Center,
    option,
    MainMenu,
    SubMenus
  } = props;
  if (!mounted) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <PieMenu
        centerRadius={`${centerRadius || 30}px`}
        radius={`${radius || 100}px`}
        Center={Center}
      >
        {option != -1 && (option === 0 ? MainMenu : SubMenus[option - 1])}
      </PieMenu>
    </ThemeProvider>
  );
}

class MenuBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      option: -1,
      toolName: '',
      center: {
        name: 'MenuCollapse',
        type: 'svg',
        url: 'svg/Menu_Tools/PieMenu_Collapse.svg',
        subTools: []
      },
      expandUrl: 'svg/Menu_Tools/PieMenu_Expand.svg'
    };
  }

  goBack = (e: any) => {
    const { option } = this.state;
    if (option === 0) return;
    this.setState({ option: 0 });
  };

  render() {
    const { state, props } = this;
    const {
      left,
      right,
      top,
      bottom,
      radius,
      centerRadius,
      tools,
      mounted
    } = props;
    const { center, option } = state;
    const Center = (props: Props) => (
      <PieCenter {...props} onClick={this.goBack}>
        {option != -1 && option !== 0 && <ReactSVG src={center.url} />}
        {option == -1 && <ReactSVG src={this.state.expandUrl} />}
      </PieCenter>
    );
    const MainMenu = (
      <React.Fragment key={'submenu-0'}>
        {tools.map((item, i) => (
          <Slice
            key={`${item.name}-${i}`}
            onSelect={() => {
              this.setState({ option: i + 1 });
            }}
          >
            <ReactSVG src={item.url} />
          </Slice>
        ))}
      </React.Fragment>
    );
    const subMenus = tools.map(tool => tool.subTools);
    const SubMenus = subMenus.map((menu, i) => (
      <React.Fragment key={`submenu-${i + 1}`}>
        {menu.map(item => (
          <Slice
            key={`${item.name}-${i}`}
            onSelect={() => {
              this.props.activateTool(item.name);
              this.setState({
                option: -1
              });
            }}
          >
            <ReactSVG src={item.url} />
          </Slice>
        ))}
      </React.Fragment>
    ));
    // return (
    //   <ThemeProvider theme={theme}>
    //     <PieMenu
    //       centerX={`${centerX || 150}px`}
    //       centerY={`${centerY || 150}px`}
    //       centerRadius={`${centerRadius || 30}px`}
    //       radius={`${radius || 100}px`}
    //       Center={Center}
    //     >
    //       {option === 0 ? MainMenu : SubMenus[option - 1]}
    //     </PieMenu>
    //   </ThemeProvider>
    // );
    const style: React.CSSProperties = {
      position: 'absolute',
      left: left,
      right: right,
      top: top,
      bottom: bottom
    };
    return (
      <div
        onMouseUp={(e: any) => e.stopPropagation()}
        onMouseMove={(e: any) => e.stopPropagation()}
        onMouseDown={(e: any) => e.stopPropagation()}
        style={style}
      >
        <MenuPanel
          mounted={mounted}
          centerRadius={centerRadius}
          radius={radius}
          Center={Center}
          option={option}
          MainMenu={MainMenu}
          SubMenus={SubMenus}
          theme={theme}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar);
