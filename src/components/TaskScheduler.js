import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import CompletedTaskList from '../components/CompletedTaskList';

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskPriority, setTaskPriority] = useState("Top");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("task_data");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("task_data", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        const taskTime = new Date(task.deadline);
        const timeDiff = taskTime - now;
        if (!task.done && timeDiff > 0 && timeDiff < 60 * 1000) {
          alert(`Reminder: '${task.task}' is due soon!`);
        }
      });
    }, 30000);
    return () => clearInterval(checkReminders);
  }, [tasks]);

  const addTask = () => {
    if (taskName.trim() === "" || taskDeadline === "") {
      alert("Enter a task, must not be empty!");
      return;
    }
    const selDate = new Date(taskDeadline);
    const currDate = new Date();
    if (selDate <= currDate) {
      alert("Can't go back in time.");
      return;
    }
    const newTask = {
      _id: Date.now().toString(),
      task: taskName,
      priority: taskPriority,
      deadline: taskDeadline,
      done: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskPriority("Top");
    setTaskDeadline("");
  };

  const handleEditTask = (taskToEdit) => {
    setTaskName(taskToEdit.task);
    setTaskPriority(taskToEdit.priority);
    setTaskDeadline(taskToEdit.deadline);
    setTasks(tasks.filter(t => t._id !== taskToEdit._id));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t._id !== id));
  };

  const markDone = (id) => {
    const completedTask = tasks.find((t) => t._id === id);
    if (completedTask) {
      completedTask.done = true;
      setTasks(tasks.filter((t) => t._id !== id).concat(completedTask));
    }
  };

  const deleteCompletedTasks = () => {
    setTasks(tasks.filter(t => !t.done));
  };

  const filteredTasks = tasks.filter(t =>
    t.task.toLowerCase().includes(searchKeyword.toLowerCase()) &&
    (!filterPriority || t.priority === filterPriority) &&
    !t.done
  );

  const completedTasks = tasks.filter(t => t.done);

  return (
    <div className={styles.App}>
      <div className={styles.containerBox}>
        <Head><title>Task Manager</title></Head>
        <header className={styles.taskHeader}>
          <h1>Task Manager</h1>
        </header>
        <main>
          <TaskForm
            taskName={taskName}
            taskPriority={taskPriority}
            taskDeadline={taskDeadline}
            handleTaskNameChange={(e) => setTaskName(e.target.value)}
            handleTaskPriorityChange={(e) => setTaskPriority(e.target.value)}
            handleTaskDeadlineChange={(e) => setTaskDeadline(e.target.value)}
            addTask={addTask}
          />
          <div className={styles.searchFilter}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search tasks"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <select
              className={styles.filterPrioritySelect}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All</option>
              <option value="Top">High Priority</option>
              <option value="Middle">Medium Priority</option>
              <option value="Low">Not Important</option>
            </select>
          </div>
          <h2 className={styles.heading}>Tasks</h2>
          <TaskList
            tasks={filteredTasks}
            markDone={markDone}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
          />
          <CompletedTaskList completedTasks={completedTasks} />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className={styles.deleteCompletedButton} onClick={deleteCompletedTasks}>
              Delete Completed Tasks
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskScheduler;
