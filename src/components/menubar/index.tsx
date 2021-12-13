import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieMenu, { PieCenter, Slice } from 'react-pie-menu';
import { ITool } from '../../types';
import { ThemeProvider } from 'styled-components';
import { setTool } from '../../store/actions';
import { getToolName } from '../../store/selectors';
import { StateType, DispatchType } from '../../types';
import { Tooltip } from 'antd';
import ReactSVG from 'react-svg';
import { css } from 'styled-components';

const container = css`
  border: none;
`;

const slice = css`
  cursor: pointer;
  color: grey;
  opacity: 0.78;
  background: #34373e;
  box-shadow: 0 2px 7px 0 rgba(131, 131, 131, 0.5);
  &[filled='true'] {
    color: black;
  }
  &:hover,
  &[active='true'] {
    color: black;
    background: radial-gradient(transparent 30px, #eee 30px);
  }
`;

const mapStateToProps = (state: StateType) => {
  return {
    toolName: getToolName(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    activateTool: (name: string) => dispatch(setTool(name, true))
  };
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
  option: number; // menu id
  toolIconUrl: string;
  goBackIconUrl: string;
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
        radius={`${radius || 90}px`}
        Center={Center}
      >
        {option !== -1 && (option === 0 ? MainMenu : SubMenus[option - 1])}
      </PieMenu>
    </ThemeProvider>
  );
}

function SliceIcon(props: any) {
  const { item } = props;
  return item.type === 'svg' ? (
    <ReactSVG src={item.url} />
  ) : (
    <Tooltip placement="top" title={item.name} arrowPointAtCenter>
      <img style={{ width: 42, height: 42 }} src={item.url} alt={item.name} />
    </Tooltip>
  );
}

function CenterIcon(props: any) {
  const { iconUrl } = props;
  return (
    <img style={{ width: 42, height: 42 }} src={iconUrl} alt="center-icon" />
  );
}

function isInMenuBar(tools: ITool[], toolName: string) {
  for (let i = 0; i < tools.length; i++) {
    const toolItem = tools[i];
    if (toolItem.name === toolName) return true;
    for (let j = 0; j < toolItem.subTools.length; j++) {
      const subToolItem = toolItem.subTools[j];
      if (subToolItem.name === toolName) return true;
    }
  }
  return false;
}

class MenuBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      option: 0,
      toolIconUrl: '',
      goBackIconUrl: 'icons/terminate_active.png'
    };
  }

  static getDerivedStateFromProps(nextProps: Props) {
    if (!isInMenuBar(nextProps.tools, nextProps.toolName)) {
      return {
        option: 0,
        toolIconUrl: ''
      };
    }
    return null;
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
    const { option } = state;
    const Center = (props: Props) => (
      <PieCenter {...props} onClick={this.goBack}>
        {option !== -1 && option !== 0 && (
          <CenterIcon iconUrl={this.state.goBackIconUrl} />
        )}
        {option === -1 && <CenterIcon iconUrl={this.state.toolIconUrl} />}
      </PieCenter>
    );
    const MainMenu = (
      <React.Fragment key={'submenu-0'}>
        {tools.map((item, i) => (
          <Slice
            key={`${item.name}-${i}`}
            onSelect={() => {
              this.props.activateTool(item.name);
              if (item.subTools.length === 0) {
                this.setState({ option: -1, toolIconUrl: item.url });
              } else {
                this.setState({ option: i + 1 });
              }
            }}
          >
            <SliceIcon item={item} />
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
              this.setState({ option: -1, toolIconUrl: item.url });
            }}
          >
            <SliceIcon item={item} />
          </Slice>
        ))}
      </React.Fragment>
    ));
    const style: React.CSSProperties = {
      position: 'absolute',
      left: left,
      right: right,
      top: top,
      bottom: bottom
    };
    const center = css`
      background: ${option === -1 ? '#6376cc' : 'white'};
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 7px 0 rgba(131, 131, 131, 0.5);
      &:not(:empty):hover {
        cursor: pointer;
      }
    `;
    const theme = {
      pieMenu: {
        container: container,
        center: center
      },
      slice: {
        container: slice
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
