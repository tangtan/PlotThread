import * as React from 'react';
import { Component } from 'react';
import { ITodo } from '../../types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { toggleTodo } from '../../store/actions';
import { DispatchType } from '../../types';

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    toggleTodo: (id: number) => dispatch(toggleTodo(id))
  };
};

type TodoProps = {
  todo: ITodo;
} & ReturnType<typeof mapDispatchToProps>;

type TodoState = {};

class Todo extends React.Component<TodoProps, TodoState> {
  constructor(props: TodoProps) {
    super(props);
    this.state = {};
  }
  render() {
    const todo = this.props.todo;
    return (
      <li className="todo-item" onClick={() => this.props.toggleTodo(todo.id)}>
        {todo && todo.completed ? '😀' : '😠'}
        {''}
        <span
          className={cx(
            'todo-item__text',
            todo && todo.completed && 'todo-item__text--completed'
          )}
        >
          {todo.content}
        </span>
      </li>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Todo);
