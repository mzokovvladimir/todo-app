import {useState, useEffect} from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import addSound from "../public/sounds/add.mp3";
import deleteSound from "../public/sounds/delete.mp3";
import clearSound from "../public/sounds/clear.mp3";
import doneSound from "../public/sounds/done.mp3";

function App() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme;
    }, [theme]);

    const playSound = (sound) => {
        new Audio(sound).play();
    };

    const addTask = (event) => {
        event.preventDefault();
        const newTask = event.target.task.value.trim();
        if (newTask) {
            const newTaskObj = {
                id: Date.now().toString(),
                text: newTask,
                completed: false,
                date: new Date().toLocaleDateString(),
            };
            setTasks([...tasks, newTaskObj]);
            event.target.reset();
            playSound(addSound);
        }
    };

    const removeTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
        playSound(deleteSound);
    };

    const toggleComplete = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? {...task, completed: !task.completed} : task
            )
        );
        playSound(doneSound);
    };

    const editTask = (id, newText) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? {...task, text: newText} : task
            )
        );
    };

    const clearTasks = () => {
        setTasks([]);
        playSound(clearSound);
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newTasks = [...tasks];
        const [reorderedItem] = newTasks.splice(result.source.index, 1);
        newTasks.splice(result.destination.index, 0, reorderedItem);
        setTasks(newTasks);
    };

    return (
        <div className="app-container">
            <h1>To-Do List</h1>
            <button className="theme-btn" onClick={toggleTheme}>
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <form className="todo-form" onSubmit={addTask}>
                <input type="text" name="task" placeholder="Добавьте задачу..."/>
                <button type="submit">Добавить</button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <ul className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`todo-item ${task.completed ? "completed" : ""}`}
                                            >
                                                <div className="task-content">
                                                    <input
                                                        type="text"
                                                        value={task.text}
                                                        onChange={(e) => editTask(task.id, e.target.value)}
                                                        className="task-input"
                                                    />
                                                    <span className="task-date">{task.date}</span>
                                                </div>
                                                <button onClick={() => toggleComplete(task.id)}>✔</button>
                                                <button onClick={() => removeTask(task.id)}>✖</button>
                                            </li>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <p>Список пуст</p>
                            )}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            {tasks.length > 0 && (
                <button className="clear-btn" onClick={clearTasks}>
                    Очистить список
                </button>
            )}
        </div>
    );
}

export default App;
