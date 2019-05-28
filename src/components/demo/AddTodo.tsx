import * as React from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../../store/actions';
import { DispatchType } from '../../types';

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addTodo: (content: string) => dispatch(addTodo(content))
  };
};

type AddTodoProps = {} & ReturnType<typeof mapDispatchToProps>;

export interface AddTodoState {
  input: string;
}

class AddTodo extends React.Component<AddTodoProps, AddTodoState> {
  constructor(props: AddTodoProps) {
    super(props);
    this.state = {
      input: ''
    };
  }

  updateInput = (input: string) => {
    this.setState({ input });
  };

  handleAddTodo = () => {
    this.props.addTodo(this.state.input);
    this.setState({ input: '' });
  };

  render() {
    return (
      <div>
        <input
          onChange={e => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className="add-todo" onClick={this.handleAddTodo}>
          Add Todo
        </button>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(AddTodo);
