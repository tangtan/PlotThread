import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../../types';
import { Button } from 'antd';

const mapStateToProps = (state: StateType) => {
  return {};
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {};

class Template extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="template">
        <Button type="ghost" style={{ width: '40%', margin: '20px 10px' }}>
          Next
        </Button>
        <Button type="ghost" style={{ width: '40%', margin: '20px 10px' }}>
          Last
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Template);
