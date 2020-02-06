import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Statebar.css';
import { DispatchType, IMenu } from '../../types';
import { redoAction, undoAction } from '../../store/actions';
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
    // console.log(actionName);
    if (actionName == 'Back') {
      store.dispatch(undoAction());
    }
    if (actionName == 'Forward') {
      store.dispatch(redoAction());
    }
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
