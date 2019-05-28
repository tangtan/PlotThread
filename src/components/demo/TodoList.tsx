import * as React from 'react';
import Todo from './Todo';
import { ITodo, StateType, TodosType } from '../../types';
import { getTodos, getTodosByVisibilityFilter } from '../../store/selectors';
import { connect } from 'react-redux';

type TodoListProps = {} & ReturnType<typeof mapStateToProps>;

type TodoListState = {};

const mapStateToProps = (state: StateType) => {
  const { visibilityFilter } = state;
  // const todos = getTodos(state);
  const todos = getTodosByVisibilityFilter(state, visibilityFilter);
  return {
    todos
  };
};

class TodoList extends React.Component<TodoListProps, TodoListState> {
  constructor(props: TodoListProps) {
    super(props);
    this.state = {};
  }
  render() {
    const todos = this.props.todos;
    return (
      <ul className="todo-list">
        {todos && todos.length
          ? todos.map((todo, index) => {
              if (todo) {
                return <Todo key={`todo-${todo.id}`} todo={todo} />;
              }
            })
          : 'No todos, yeah!'}
      </ul>
    );
  }
}

export default connect(mapStateToProps)(TodoList);
