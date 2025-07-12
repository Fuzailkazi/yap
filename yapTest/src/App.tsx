import React, { useEffect, useState } from 'react';
import './index.css'; // Tailwind CSS
import { debounce } from 'lodash';

type Task = {
  id: number;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
};

const statuses: Task['status'][] = ['Todo', 'In Progress', 'Done'];

const getTasksFromStorage = (): Task[] => {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(getTasksFromStorage);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      status: 'Todo',
    };
    setTasks((prev) => [...prev, task]);
    setNewTask('');
  };

  const moveRight = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const nextStatus =
            statuses[statuses.indexOf(task.status) + 1] || task.status;
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleFilter = debounce((text: string) => {
    setFilter(text);
  }, 500);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Task Board</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>

        <input
          type="text"
          placeholder="Filter tasks..."
          onChange={(e) => handleFilter(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {statuses.map((status) => (
          <div key={status}>
            <h2 className="text-xl font-semibold mb-2">{status}</h2>
            <div className="space-y-2">
              {filteredTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-3 shadow rounded flex justify-between items-center"
                  >
                    <span>{task.title}</span>
                    {status !== 'Done' && (
                      <button
                        onClick={() => moveRight(task.id)}
                        className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      >
                        Move Right →
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
