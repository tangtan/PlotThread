import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Statebar.css';
import { DispatchType, IMenu } from '../../types';
import { redoAction, undoAction } from '../../store/actions';

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    redoAction: () => dispatch(redoAction()),
    undoAction: () => dispatch(undoAction())
  };
};

type Props = {
  menuInfo: IMenu;
} & ReturnType<typeof mapDispatchToProps>;

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
    if (actionName == 'Back') {
      this.props.undoAction();
    }
    if (actionName == 'Forward') {
      this.props.redoAction();
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

export default connect(mapDispatchToProps)(StateItem);
