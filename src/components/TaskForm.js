// src/components/TaskForm.js

import styles from "../styles/Home.module.css";

const TaskForm = ({
    taskName,
    taskPriority,
    taskDeadline,
    handleTaskNameChange,
    handleTaskPriorityChange,
    handleTaskDeadlineChange,
    addTask
}) => {
    return (
        <div className={styles.taskForm}>
            <input
                type="text"
                className={styles.taskNameInput}
                placeholder="Enter task..."
                value={taskName}
                onChange={handleTaskNameChange}
            />
            <select 
                className={styles.taskPrioritySelect}
                value={taskPriority}
                onChange={handleTaskPriorityChange}
            >
                <option value="Top">High Priority</option>
                <option value="Middle">Medium Priority</option>
                <option value="Low">Not Important</option>
            </select>
            <input
                type="date"
                className={styles.taskDeadlineInput}
                value={taskDeadline}
                onChange={handleTaskDeadlineChange}
            />
            <button className={styles.addTaskButton} onClick={addTask}>
                Add Task
            </button>
        </div>
    );
};

export default TaskForm;
