import React, { useState, useEffect } from 'react';
import todosReducer, { loadTodos } from './ToDoReducer';
import '../ToDo.css';

const useReducer = (reducer, initialState) => {
    const [state, setState] = useState(initialState);

    const dispatch = (action) => {
        const nextState = reducer(state, action);
        setState(nextState);
    }

    return [state, dispatch];
}

const Task = ({ task, editTask, completeTask, makeTaskNotCompleted, removeTask }) => {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            {task.title}

            <button style={{ background: "red" }} onClick={() => removeTask(task.id)}>x</button>
            <CompleteButton
                taskId={task.id}
                isComplete={task.completed}
                completeTask={completeTask}
                makeTaskNotCompleted={makeTaskNotCompleted} />
            <button onClick={() => editTask(task.id)}>Edit</button>
        </div>
    );
}

const CompleteButton = ({ taskId, isComplete, completeTask, makeTaskNotCompleted }) => {
    return isComplete ?
        (<button onClick={() => makeTaskNotCompleted(taskId)}>Undo</button>) :
        (<button onClick={() => completeTask(taskId)}>Complete</button>)
}

const EditableTask = ({ taskId, title, editTask }) => {
    const [value, setValue] = useState(title);

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;

        editTask(taskId, value);
    }

    return (
        <form className="create-task" onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add a new task"
                onChange={e => setValue(e.target.value)}
            />
        </form>
    );
}

const ToDo = () => {
    const [state, dispatch] = useReducer(todosReducer, { tasks: [], editableTaskIds: [] });
    const {tasks, editableTaskIds} = state;

    useEffect(() => {
        loadTodos(dispatch);
    }, []);

    const addTask = () => {
        dispatch({ type: "ADD_NEW_TASK" });
    };

    const updateTask = (taskId, title) => {
        dispatch({ type: "EDIT_TASK", taskId, title });
    };

    const completeTask = taskId => {
        dispatch({ type: "COMPLETE_TASK", taskId });
    };

    const makeTaskNotCompleted = taskId => {
        dispatch({ type: "MAKE_TASK_NOT_COMPLETE", taskId });
    };

    const removeTask = taskId => {
        dispatch({ type: "REMOVE_TASK", taskId });
    }

    const makeTaskEditable = taskId => {
        dispatch({ type: "MAKE_TASK_EDITABLE", taskId });
    }

    return (
        <div className="todo-container">
            <div className="header">Todo Items</div>
            <div className="tasks">
                {tasks.map((task, index) =>
                    editableTaskIds.includes(task.id) ?
                        (<EditableTask
                            key={index}
                            taskId={task.id}
                            title={task.title}
                            editTask={updateTask}
                        />) :
                        (<Task
                            key={index}
                            task={task}
                            editTask={makeTaskEditable}
                            completeTask={completeTask}
                            makeTaskNotCompleted={makeTaskNotCompleted}
                            removeTask={removeTask}
                        />))}
            </div>
            <button onClick={addTask}>Add Task</button>
        </div>
    )
}

export default ToDo;