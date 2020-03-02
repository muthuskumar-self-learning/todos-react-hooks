import React, { useState, useEffect } from 'react';
import './ToDo.css';

const Task = ({ task, editTask, completeTask, makeTaskNotCompleted, removeTask }) => {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            {task.title}
            
            <button style={{ background: "red" }} onClick={() => removeTask(task.id)}>x</button>
            <CompleteButton
                taskId = {task.id}
                isComplete = {task.completed}
                completeTask = {completeTask}
                makeTaskNotCompleted = {makeTaskNotCompleted} />
            <button onClick={() => editTask(task.id)}>Edit</button>
        </div>
    );
}

const CompleteButton = ({ taskId, isComplete, completeTask, makeTaskNotCompleted}) => {
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
    const [tasks, setTasks] = useState([]);
    const [editableTaskIds, setEditableTaskIds] = useState([]);

    useEffect(() => {
        fetch('./todos.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log("data: ", data);
                setTasks(data);
            })
            .catch((err) => {
                console.log("An error occrurred. Please try again later.", err);
            });
    }, []);

    const addTask = () => {
        const newId = getNewId();
        const newTasks = [...tasks, { id: newId, title: "", completed: false }];

        setTasks(newTasks);
        setEditableTaskIds([...editableTaskIds, newId]);
    };

    const updateTask = (taskId, title) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? Object.assign({}, task, { title }) : task
        ));

        setEditableTaskIds(editableTaskIds.filter(id => id !== taskId));
    };

    const completeTask = taskId => {
        setTasks(tasks.map(task =>
            task.id === taskId ? Object.assign({}, task, { completed: true }) : task
        ));
    };

    const makeTaskNotCompleted = taskId => {
        setTasks(tasks.map(task =>
            task.id === taskId ? Object.assign({}, task, { completed: false }) : task
        ));
    };

    const removeTask = taskId => {
        setTasks(tasks.filter(task =>
           task.id !== taskId 
        ));
    }

    const makeTaskEditable = taskId => {
        setEditableTaskIds([...editableTaskIds, taskId]);
    }

    const getNewId = () => {
        return tasks.length === 0 ? 1 : Math.max(...tasks.map(task => task.id)) + 1;
    };

    return (
        <div className="todo-container">
            <div className="header">Todo Items</div>
            <div className="tasks">
                {tasks.map((task, index) =>
                    editableTaskIds.includes(task.id) ?
                        (<EditableTask 
                            key = {index}
                            taskId = {task.id}
                            title = {task.title}
                            editTask = {updateTask}
                        />) :
                        (<Task
                            key={index}
                            task={task}
                            editTask = {makeTaskEditable}
                            completeTask = {completeTask}
                            makeTaskNotCompleted = {makeTaskNotCompleted}
                            removeTask = {removeTask}
                            />))}
            </div>
            <button onClick={addTask}>Add Task</button>
        </div>
    )
}

export default ToDo;