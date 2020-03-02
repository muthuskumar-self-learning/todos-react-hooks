const todosReducer = (state, action) => {
    switch(action.type) {
        case "LOAD_TODOS":
            return Object.assign({}, state, { tasks: action.todos });
        case "ADD_NEW_TASK": 
            return Object.assign({}, state, addTask(state));
        case "EDIT_TASK": 
            return Object.assign({}, state, updateTask(state, action));
        case "COMPLETE_TASK": 
            return Object.assign({}, state, completeTask(state, action));
        case "MAKE_TASK_NOT_COMPLETE": 
            return Object.assign({}, state, makeTaskNotCompleted(state, action));
        case "REMOVE_TASK": 
            return Object.assign({}, state, removeTask(state, action));
        case "MAKE_TASK_EDITABLE": 
            return Object.assign({}, state, makeTaskEditable(state, action));
        default: 
            return state;
    }

}

const loadTodos = (dispatch) => {
    fetch('./todos.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("data: ", data);
            dispatch({ type: "LOAD_TODOS", todos: data })
        })
        .catch((err) => {
            console.log("An error occrurred. Please try again later.", err);
        });
}

const addTask = ({ tasks, editableTaskIds }) => {
    const newId = getNewId(tasks);
    const newTasks = [...tasks, { id: newId, title: "", completed: false }];

    return { tasks: newTasks, editableTaskIds: [...editableTaskIds, newId] };
};

const updateTask = ({ tasks, editableTaskIds }, { taskId, title }) => {
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? Object.assign({}, task, { title }) : task
    );
    const updatedEditableTaskIds = editableTaskIds.filter(id => id !== taskId);

    return { tasks: updatedTasks, editableTaskIds: updatedEditableTaskIds };
};

const completeTask = ({ tasks }, { taskId }) => {
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? Object.assign({}, task, { completed: true }) : task
    );

    return { tasks: updatedTasks };
};

const makeTaskNotCompleted = ({ tasks }, { taskId }) => {
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? Object.assign({}, task, { completed: false }) : task
    );

    return { tasks: updatedTasks };
};

const removeTask = ({ tasks }, { taskId }) => {
    const updatedTasks = tasks.filter(task =>
        task.id !== taskId
    );

    return { tasks: updatedTasks };
}

const makeTaskEditable = ({ editableTaskIds }, { taskId }) => {
    return { editableTaskIds: [...editableTaskIds, taskId] };
}

const getNewId = (tasks) => {
    return tasks.length === 0 ? 1 : Math.max(...tasks.map(task => task.id)) + 1;
};

export default todosReducer;
export { loadTodos };