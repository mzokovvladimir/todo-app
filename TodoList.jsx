import { useState } from 'react';

function TodoList() {
  // Состояние для хранения задач
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  // Функция для добавления задачи
  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, taskInput]);
      setTaskInput(''); // Очистить поле ввода после добавления
    }
  };

  return (
    <div className="todo-container">
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
