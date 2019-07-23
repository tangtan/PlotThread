import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieMenu, { PieCenter, Slice } from 'react-pie-menu';
import { ITool } from '../../types';
import { ThemeProvider } from 'styled-components';
import * as styles from './index.style';
import { setTool } from '../../store/actions';
import { DispatchType } from '../../types';
import ReactSVG from 'react-svg';

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
  centerX?: number;
  centerY?: number;
  radius?: number;
  centerRadius?: number;
  tools: ITool[];
} & ReturnType<typeof mapDispatchToProps>;

type State = {
  center: ITool;
  option: number; // menu id
  toolName: string;
};

class MenuBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      option: 0,
      toolName: '',
      center: {
        name: 'MenuCollapse',
        type: 'svg',
        url: 'svg/Menu_Tools/PieMenu_Collapse.svg',
        subTools: []
      }
    };
  }

  goBack = () => {
    const { option } = this.state;
    if (option === 0) return;
    this.setState({ option: 0 });
  };

  render() {
    const { state, props } = this;
    const { centerX, centerY, radius, centerRadius, tools } = props;
    const { center, option } = state;
    const Center = (props: Props) => (
      <PieCenter {...props} onClick={this.goBack}>
        {option !== 0 && <ReactSVG src={center.url} />}
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
            }}
          >
            <ReactSVG src={item.url} />
          </Slice>
        ))}
      </React.Fragment>
    ));
    return (
      <ThemeProvider theme={theme}>
        <PieMenu
          centerX={`${centerX || 150}px`}
          centerY={`${centerY || 150}px`}
          centerRadius={`${centerRadius || 30}px`}
          radius={`${radius || 100}px`}
          Center={Center}
        >
          {option === 0 ? MainMenu : SubMenus[option - 1]}
        </PieMenu>
      </ThemeProvider>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(MenuBar);
