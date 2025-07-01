import styles from "../styles/Home.module.css";

const TaskList = ({ tasks, markDone, handleEditTask, handleDeleteTask }) => {
  const formatDeadline = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className={styles.taskList}>
      {tasks.length === 0 ? (
        <p className={styles.noTasksMessage}>No tasks available.</p>
      ) : (
        <table className={styles.taskTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t._id}>
                <td>{t.task}</td>
                <td>{t.priority}</td>
                <td>{formatDeadline(t.deadline)}</td>
                <td>
                  {!t.done ? (
                    <>
                      <button className={styles.markDoneButton} onClick={() => markDone(t._id)}>Done</button>
                      <button className={styles.editTaskButton} onClick={() => handleEditTask(t)}>Edit</button>
                      <button className={styles.deleteTaskButton} onClick={() => handleDeleteTask(t._id)}>Delete</button>
                    </>
                  ) : (
                    <span>Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
