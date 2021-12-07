import React, { Component } from 'react';
import './Statebar.css';
import { IMenu } from '../../types';
import store from '../../store';

type Props = {
  menuInfo: IMenu;
};

class StateItem extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isClicked: false
    };
  }

  private onClick = () => {
    const actionName = this.props.menuInfo.name;
    console.log(actionName);
  };

  render() {
    const imgIcon = (
      <img
        className="statebar-icon-img"
        src={this.props.menuInfo.url}
        alt={this.props.menuInfo.name}
      />
    );

    return (
      <div
        className={
          this.props.menuInfo.background
            ? 'statebar-icon-box-bg'
            : 'statebar-icon-box-nobg'
        }
        onClick={this.onClick}
      >
        {imgIcon}
      </div>
    );
  }
}

export default StateItem;
