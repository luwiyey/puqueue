'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListTodo, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export function TaskListWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  
  // Load tasks from local storage on initial render
  useEffect(() => {
    try {
        const storedTasks = localStorage.getItem('studentTasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('studentTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ListTodo className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">My Tasks</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button onClick={handleAddTask} size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Task</span>
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-2">
              {tasks.length > 0 ? (
                  tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 group p-2 rounded-md hover:bg-muted/50">
                          <Checkbox
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                          />
                          <Label
                              htmlFor={`task-${task.id}`}
                              className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                              {task.text}
                          </Label>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100"
                              onClick={() => removeTask(task.id)}
                          >
                              <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                      </div>
                  ))
              ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add one above!</p>
              )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
