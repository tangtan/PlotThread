import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Statebar.css';
import { IMenu } from '../../types';

type Props = {
  menuInfo: IMenu;
};

class StateItem extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

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
