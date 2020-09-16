import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType, TaskType} from "./App";
import classes from './TodoList.module.css';

type TasksStateType = {
	[key: string]: Array<TaskType>
}

type PropsType = {
	id: string
	title: string
	filter: FilterValuesType
	tasks: Array<TaskType>
	removeTask: (taskId: string, todoListId: string) => void
	changeFilter: (value: FilterValuesType, todoListId: string) => void
	checkedTask: (taskId: string, isDone: boolean, todoListId: string) => void
	addTask: (value: string, todoListId: string) => void
	removeTodoList: (todoListId: string) => void
}

export function TodoList(
	{
		title,
		tasks,
		changeFilter,
		removeTask,
		removeTodoList,
		...props
	}: PropsType) {

	let [value, setValue] = useState<string>('');
	let [disabledBtn, setDisabledBtn] = useState<boolean>(true);
	let [error, setError] = useState<string | null>(null);

	// клик по кнопке addTask
	function addValueTask() {
		if (value.trim()) {
			props.addTask(value.trim(), props.id);
			setValue('');
			setDisabledBtn(true);
		} else {
			setError('Title is not empty!');
			setValue('');
		}
	}

	// получение данных из input
	function onChangeAddHandler(event: ChangeEvent<HTMLInputElement>) {
		setValue(event.currentTarget.value);
		setDisabledBtn(false);
		setError(null);
	}

	// добавление таска по нажатию на Enter
	function onKeyUpHandler(event: KeyboardEvent<HTMLInputElement>) {
		return event.key === 'Enter' ? addValueTask() : null;
	}

	// button All
	function onAllClickHandler(id: string) {
		changeFilter('all', id);
	}

	// button Active
	function onActiveClickHandler(id: string) {
		changeFilter('active', id);
	}

	// button Completed
	function onCompletedClickHandler(id: string) {
		changeFilter('completed', id);
	}

	const tasksList = tasks.map((task) => {
		return (
			<li key={task.id}>
				<input
					type="checkbox"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						props.checkedTask(task.id, e.currentTarget.checked, props.id)
					}}
					checked={task.isDone}
				/>
				<span className={task.isDone ? 'is-done' : ''}>{task.title}</span>
				<button
					onClick={() => removeTask(task.id, props.id)}>X
				</button>
			</li>
		)
	});

	return (
		<div className={classes.taskItemWrapper}>
			<div className={classes.ButtonDel}>
				<button onClick={() => removeTodoList(props.id)}>Del</button>
			</div>
			<h3 className={classes.taskItemTitle}>{title}</h3>
			<div className={classes.taskItemInput}>
				<input
					value={value}
					onChange={onChangeAddHandler}
					onKeyUp={onKeyUpHandler}
					className={error ? 'error' : ''}
				/>
				{error && <div className={'error-message'}>{error}</div>}
				{/* button addTask */}
				<button
					disabled={disabledBtn}
					onClick={addValueTask}
				>+
				</button>
			</div>
			<ul className={classes.taskItemList}>
				{tasksList}
			</ul>
			<div className={classes.taskItemButtonGroup}>
				<button
					className={props.filter === 'all' ? 'active-filter' : ''}
					onClick={() => onAllClickHandler(props.id)}>All</button>
				<button
					className={props.filter === 'active' ? 'active-filter' : ''}
					onClick={() => onActiveClickHandler(props.id)}>Active</button>
				<button
					className={props.filter === 'completed' ? 'active-filter' : ''}
					onClick={() => onCompletedClickHandler(props.id)}>Completed</button>
			</div>
		</div>
	)
}