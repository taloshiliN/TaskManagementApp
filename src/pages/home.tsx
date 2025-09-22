import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/TaskList';
import TaskDialog from '../components/TaskDialog';
import AddTaskForm from '../components/AddTaskForm';
import type { Task } from '../hooks/useTasks';

const HomePage: React.FC = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (authLoading) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = async (title: string, description: string) => {
    setActionLoading(true);
    const success = await addTask(title, description);
    setActionLoading(false);
    if (success) {
      setIsAddFormOpen(false);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    setActionLoading(true);
    const success = await updateTask(updatedTask.id, {
      title: updatedTask.title,
      description: updatedTask.description
    });
    setActionLoading(false);
    if (success) {
      handleCloseDialog();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setActionLoading(true);
      const success = await deleteTask(taskId);
      setActionLoading(false);
      if (success) {
        handleCloseDialog();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.displayName}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Email: {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Add Task Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          {/* Tasks Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Tasks ({tasks.length})
              </h2>
            </div>
            <div className="p-6">
              <TaskList
                tasks={tasks}
                loading={tasksLoading}
                onTaskClick={handleTaskClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        task={selectedTask}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onEdit={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      {/* Add Task Form */}
      <AddTaskForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddTask}
        loading={actionLoading}
      />
    </div>
  );
};

export default HomePage;
