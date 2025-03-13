import React from 'react';
import styles from '../styles/Home.module.css';

const TaskList = ({
    tasks,
    markDone,
    handleEditTask,
    handleDeleteTask
}) => {

    // Helper function to format the deadline date
    const formatDeadline = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    return (
        <div className={styles.taskList}>
            {tasks.length === 0 ? (
                <p>No tasks available.</p>
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
                        {Array.isArray(tasks) && tasks.map((t) => (
                            <tr key={t.id}>
                                <td>{t.task}</td>
                                <td>{t.priority}</td>
                                <td>{formatDeadline(t.deadline)}</td>
                                <td>
                                    {!t.done ? (
                                        <div>
                                            <button
                                                className={styles.markDoneButton}
                                                onClick={() => markDone(t.id)}
                                            >
                                                Done
                                            </button>
                                            <button
                                                className={styles.editTaskButton}
                                                onClick={() => handleEditTask(t.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.deleteTaskButton}
                                                onClick={() => handleDeleteTask(t.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
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
