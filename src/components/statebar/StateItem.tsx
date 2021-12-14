import React, { Component } from 'react';
import './Statebar.css';
import { IMenu } from '../../types';

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

  // private onClick = () => {
  //   const actionName = this.props.menuInfo.name;
  // };

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
      >
        {imgIcon}
      </div>
    );
  }
}

export default StateItem;
