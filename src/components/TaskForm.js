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
        placeholder="Enter task..."
        className={styles.taskNameInput}
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
        type="datetime-local"
        className={styles.taskDeadlineInput}
        value={taskDeadline}
        onChange={handleTaskDeadlineChange}
      />
      <button onClick={addTask} className={styles.addTaskButton}>Add Task</button>
    </div>
  );
};

export default TaskForm;
