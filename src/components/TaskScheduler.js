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
    const [taskDeadline, setTaskDeadline] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterPriority, setFilterPriority] = useState("");



    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/task?searchKeyword=${searchKeyword}&filterPriority=${filterPriority}`);
            const data = await res.json();
            console.log("Fetched tasks:", data); // Log the fetched data
            if (Array.isArray(data)) {
                setTasks(data); // Ensure data is an array before setting state
            } else {
                setTasks([]); // Set empty array if data is not an array
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]); // Handle the case where the fetch fails
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [searchKeyword, filterPriority]);
    // Refetch when search or filter changes

    const addTask = async () => {
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
            task: taskName,
            priority: taskPriority,
            deadline: taskDeadline,
        };

        try {
            const res = await fetch("/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (res.ok) {
                setTaskName("");
                setTaskPriority("Top");
                setTaskDeadline("");
                fetchTasks(); // Refetch tasks after adding a new one
            } else {
                console.error("Failed to add task");
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = (id) => {
        const taskToEdit = tasks.find((t) => t._id === id);
        setTaskName(taskToEdit.task);
        setTaskPriority(taskToEdit.priority);
        setTaskDeadline(taskToEdit.deadline);
        const updatedTasks = tasks.filter((t) => t._id !== id);
        setTasks(updatedTasks);
    };

    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter((t) => t._id !== id);
        setTasks(updatedTasks);
    };

    const markDone = (id) => {
        const updatedTasks = tasks.map((t) =>
            t._id === id ? { ...t, done: true } : t
        );
        setTasks(updatedTasks);

        const completedTask = tasks.find((t) => t._id === id);
        if (completedTask) {
            setCompletedTasks([...completedTasks, completedTask]);
        }
    };

    return (
        <div className={styles.App}>
            <Head>
                <title>Task Manager</title>
            </Head>
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
                    tasks={tasks}
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
