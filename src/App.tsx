import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";

export type TaskType = {
	id: string
	title: string
	isDone: boolean
}

export type FilterValuesType = "all" | "active" | "completed";

type TodoListType = {
	id: string
	title: string
	filter: FilterValuesType
}

type TasksStateType = {
	[key: string]: Array<TaskType>
}

function App() {

	let todoListId1 = v1();
	let todoListId2 = v1();

	let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
		{id: todoListId1, title: "What to learn", filter: "all"},
		{id: todoListId2, title: "What to buy", filter: "all"},
	]);

	let [tasks, setTasks] = useState<TasksStateType>({
		[todoListId1]: [
			{id: v1(), title: "HTML CSS", isDone: true},
			{id: v1(), title: "React", isDone: true},
			{id: v1(), title: "JavaScript", isDone: false},
			{id: v1(), title: "Angular 8", isDone: true},
			{id: v1(), title: "Angular 9", isDone: false},
		],
		[todoListId2]: [
			{id: v1(), title: "Beer", isDone: true},
			{id: v1(), title: "Learn JS", isDone: true},
			{id: v1(), title: "Books", isDone: false},
			{id: v1(), title: "Fish", isDone: true},
		],
	});

	// filter "active" | "completed"
	function changeFilter(value: FilterValuesType, todoListId: string) {
		let todoList = todoLists.find(todo => todo.id === todoListId);
		if (todoList) {
			todoList.filter = value;
			setTodoLists([...todoLists]);
		}
	}

	// add new task
	function addTask(value: string, todoListId: string) {
		let todoListTasks = tasks[todoListId];
		let newTask: TaskType = {id: v1(), title: value, isDone: false};
		tasks[todoListId] = [newTask, ...todoListTasks];
		setTasks({...tasks});
	}

	// delete task
	function removeTask(taskId: string, todoListId: string) {
		// let todoListTasks = tasks[todoListId];
		tasks[todoListId] = tasks[todoListId].filter(t => t.id !== taskId);
		setTasks({...tasks});
	}

	// checked
	function checkedTask(taskId: string, isDone: boolean, todoListId: string) {
		let todoListTasks = tasks[todoListId];
		let task = todoListTasks.find(t => t.id === taskId);
		if (task) {
			task.isDone = isDone;
			setTasks({...tasks});
		}
	}

	// remove todoList
	function removeTodoList(todoListId: string) {
		setTodoLists(todoLists.filter(todo => todo.id !== todoListId));
		delete tasks[todoListId];
		setTasks({...tasks});
	}

	return (
		<div className="App">
			{
				todoLists.map(todo => {
					let tasksForTodoList = tasks[todo.id];

					if (todo.filter === "active") tasksForTodoList = tasks[todo.id].filter(t => !t.isDone);
					if (todo.filter === "completed") tasksForTodoList = tasks[todo.id].filter(t => t.isDone);

					return(
						<TodoList
							key={todo.id}
							id={todo.id}
							title={todo.title}
							filter={todo.filter}
							tasks={tasksForTodoList}
							changeFilter={changeFilter}
							removeTask={removeTask}
							checkedTask={checkedTask}
							addTask={addTask}
							removeTodoList={removeTodoList}
						/>
					)
				})
			}

		</div>
	);
}

export default App;
