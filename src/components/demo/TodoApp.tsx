import * as React from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import VisibilityFilters from './VisibilityFilters';
import { ITodo } from '../../types';

import './style.css';

export interface TodoAppProps {}

export interface TodoAppState {
  todos: ITodo[];
}

class TodoApp extends React.Component<TodoAppProps, TodoAppState> {
  constructor(props: TodoAppProps) {
    super(props);
    this.state = {
      todos: []
    };
  }
  render() {
    return (
      <div>
        <h1>Todo List</h1>
        <AddTodo />
        <TodoList />
        <VisibilityFilters />
      </div>
    );
  }
}

export default TodoApp;
