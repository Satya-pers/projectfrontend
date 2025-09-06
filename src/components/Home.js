import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const taskRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const priorityRef = useRef(null);
  const [editingTask, setEditingTask] = useState(null);
  const notificationTimeouts = useRef({});
  const [isHovered, setIsHovered] = useState(false);

  
  const loggedInUserEmail =
    location.state?.id || localStorage.getItem("userEmail");

  useEffect(() => {
    if (location.state?.id) {
      localStorage.setItem("userEmail", location.state.id);
    }
  }, [location.state]);

  
  const fetchTasks = useCallback(async () => {
    if (!loggedInUserEmail) return;
    try {
      const response = await axios.get(
        `https://project-backend-7xq9.onrender.com/tasks/user/${loggedInUserEmail}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [loggedInUserEmail]);

  useEffect(() => {
    if (loggedInUserEmail) {
      fetchTasks();
    }
  }, [loggedInUserEmail, fetchTasks]);

  
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") alert("Please allow notifications");
      });
    }
  }, []);

  useEffect(() => {
    Object.values(notificationTimeouts.current).forEach(clearTimeout);
    notificationTimeouts.current = {};

    tasks.forEach((task) => {
      const scheduleTime = new Date(task.dateTime);
      const currentTime = new Date();
      const timeDifference = scheduleTime - currentTime;

      if (timeDifference > 0) {
        const timeoutId = setTimeout(() => {
          document.getElementById("notificationSound").play();
          if (Notification.permission === "granted") {
            new Notification(`Time for ${task.task} Task`, {
              requireInteraction: true,
            });
          }
        }, timeDifference);
        notificationTimeouts.current[task._id] = timeoutId;
      }
    });

    return () =>
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
  }, [tasks]);

  const scheduleReminder = async () => {
    const title = taskRef.current.value;
    const date = dateRef.current.value;
    const time = timeRef.current.value;
    const priority = priorityRef.current.value;
    const localDate  = new Date(`${date}T${time}`);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    if (!title || !date || !time) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post("https://project-backend-7xq9.onrender.com/tasks/create-task", {
        task: title,
        dateTime:utcDate,
        priority,
        userEmail: loggedInUserEmail,
      });

      fetchTasks();    //after create fetch tasks

      taskRef.current.value = "";
      dateRef.current.value = "";
      timeRef.current.value = "";
      priorityRef.current.value = "Medium";
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://project-backend-7xq9.onrender.com/tasks/delete-task/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (id) => {
    try {
      const response = await axios.get(
        `https://project-backend-7xq9.onrender.com/tasks/update-task/${id}`
      );
      const task = response.data;
      taskRef.current.value = task.task;
      const dt = new Date(task.dateTime);
      dateRef.current.value = dt.toISOString().split("T")[0];
      timeRef.current.value = dt.toISOString().split("T")[1].slice(0,5); 
      priorityRef.current.value = task.priority;
      setEditingTask(task);
    } catch (error) {
      console.error("Error fetching task for edit:", error);
    }
  };

  const updateTask = async () => {
    const title = taskRef.current.value;
    const date = dateRef.current.value;
    const time = timeRef.current.value;
    const dateTime = new Date(`${date}T${time}`);
    const priority = priorityRef.current.value;

    if (!title || !date || !time) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.put(
        `https://project-backend-7xq9.onrender.com/tasks/update-task/${editingTask._id}`,
        { task: title, dateTime, priority }
      );
      fetchTasks(); //after update fetch tasks

      setEditingTask(null);
      taskRef.current.value = "";
      dateRef.current.value = "";
      timeRef.current.value = "";
      priorityRef.current.value = "Medium";
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand text-light">
            Welcome to To-do List Website
          </span>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  onClick={() => navigate("/task")}
                  className="nav-link active text-white"
                >
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="nav-link active text-white"
                >
                  About us
                </button>
                {isHovered && (
                  <div className="hover-data">
                    <p>
                      Our To-Do List website allows users to manage tasks
                      efficiently. Users can create, edit, and delete tasks, set
                      reminders, assign priority levels to tasks, and receive
                      notifications for upcoming activities. It’s designed to help
                      users stay organized, focus on what matters most, and ensure
                      they never miss important tasks.
                    </p>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <button
                  onClick={() => {
                    localStorage.removeItem("userEmail");
                    navigate("/");
                  }}
                  className="nav-link active text-white"
                >
                  Logout <img id="img" src="logout.png" alt="" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <form>
        <div className="container" id="form">
          <label className="form-label" id="label">Task:</label>
          <input
            className="form-control mx-auto"
            type="text"
            ref={taskRef}
            id="input"
          />

          <label className="form-label" id="label">Date:</label>
          <input
            className="form-control mx-auto"
            type="date"
            ref={dateRef}
            id="input"
          />

          <label className="form-label" id="label">Time:</label>
          <input
            className="form-control mx-auto"
            type="time"
            ref={timeRef}
            id="input"
          />

          <label className="form-label drop-down" id="label">Priority:</label>
          <select
            className="form-select mx-auto"
            ref={priorityRef}
            id="input"
            defaultValue="Medium"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            type="button"
            className="btn btn-success my-3 d-block mx-auto"
            onClick={scheduleReminder}
            id="schedulebutton"
          >
            Schedule Reminder
          </button>
          {editingTask && (
            <button
              type="button"
              className="btn btn-warning d-block mx-auto"
              onClick={updateTask}
            >
              Update Task
            </button>
          )}
        </div>
      </form>

      <audio id="notificationSound">
        <source src="notification_ding.mp3" type="audio/mpeg" />
      </audio>

      <table className="table table-bordered table-secondary table-striped">
        <thead>
          <tr>
            <th>Task</th>
            <th>Date & Time</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.task}</td>
              <td>{new Date(task.dateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
              <td>{task.priority}</td>
              <td>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="btn btn-danger mx-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => editTask(task._id)}
                  className="btn btn-success mx-2"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
