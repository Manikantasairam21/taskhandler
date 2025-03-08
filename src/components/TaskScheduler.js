// src/components/TaskScheduler.js

import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import CompletedTaskList from '../components/CompletedTaskList';

const TaskScheduler = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [taskPriority, setTaskPriority] = useState("Top");
    const [taskVal, setTaskDeadline] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterPriority, setFilterPriority] = useState("");

    const TASKS_STORAGE_KEY = "tasks";
    const COMPLETED_TASKS_STORAGE_KEY = "completedTasks";

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY));
        if (storedTasks) {
            setTasks(storedTasks);
        }

        const storedCompletedTasks = JSON.parse(localStorage.getItem(COMPLETED_TASKS_STORAGE_KEY));
        if (storedCompletedTasks) {
            setCompletedTasks(storedCompletedTasks);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem(COMPLETED_TASKS_STORAGE_KEY, JSON.stringify(completedTasks));
    }, [completedTasks]);

    const handleTaskNameChange = (e) => {
        6
        setTaskName(e.target.value);
    };

    const handleTaskPriorityChange = (e) => {
        setTaskPriority(e.target.value);
    };

    const handleTaskDeadlineChange = (e) => {
        setTaskDeadline(e.target.value);
    };

    const addTask = () => {
        if (taskName.trim() === "" || taskVal === "") {
            alert("Enter a task, Must not Empty!!!");
            return;
        }

        const selDate = new Date(taskVal);
        const currDate = new Date();

        if (selDate <= currDate) {
            alert("Can't go back in time.");
            return;
        }

        const newTask = {
            id: tasks.length + 1,
            task: taskName,
            priority: taskPriority,
            deadline: taskVal,
            done: false,
        };

        // Fetch existing tasks from local storage
        const existingTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];

        // Append the new task to existing tasks
        const updatedTasks = [...existingTasks, newTask];

        // Update tasks state
        setTasks(updatedTasks);

        // Update local storage with combined old and new tasks
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));

        setTaskName("");
        setTaskPriority("Top");
        setTaskDeadline("");
    };

    const handleEditTask = (id) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        setTaskName(taskToEdit.task);
        setTaskPriority(taskToEdit.priority);
        setTaskDeadline(taskToEdit.deadline);
        const updatedTasks = tasks.filter((t) => t.id !== id);
        setTasks(updatedTasks);
    };

    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter((t) => t.id !== id);
        setTasks(updatedTasks);
    };

    const markDone = (id) => {
        const updatedTasks = tasks.map((t) =>
            t.id === id ? { ...t, done: true } : t
        );
        setTasks(updatedTasks);

        const completedTask = tasks.find((t) => t.id === id);
        if (completedTask) {
            setCompletedTasks([...completedTasks, completedTask]);
        }
    };

    const filteredTasks = tasks
        .filter((t) => !t.done)
        .filter((t) =>
            t.task.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .filter((t) => (filterPriority ? t.priority === filterPriority : true));

    return (
        <div className={styles.App}>
            <Head>
                <title>Task Manager - Geeksforgeeks.org</title>
            </Head>
            <header className={styles.taskHeader}>
                <h1>Task Manager</h1>
            </header>
            <main>
                <TaskForm
                    taskName={taskName}
                    taskPriority={taskPriority}
                    taskDeadline={taskVal}
                    handleTaskNameChange={handleTaskNameChange}
                    handleTaskPriorityChange={handleTaskPriorityChange}
                    handleTaskDeadlineChange={handleTaskDeadlineChange}
                    addTask={addTask}
                />
                {/* Search and Filter Component */}
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
            </main>
        </div>
    );
};

export default TaskScheduler;
