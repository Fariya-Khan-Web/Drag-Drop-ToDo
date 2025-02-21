import { useState } from 'react';
import Navbar from './components/Navbar';
import './input.css';

import { DndContext } from '@dnd-kit/core';
import Draggable from './components/DragDrop/Draggable';
import Droppable from './components/DragDrop/Droppable';


function App() {

  // Define sections
  const sections = ['To-Do', 'In Progress', 'Complete'];
  // const [parent, setParent] = useState(null);
  const [tasks, setTasks] = useState({
    'To-Do': [{ id: 'task-1', title: 'Task 1' }],
    'In Progress': [{ id: 'task-2', title: 'Task 2' }],
    'Complete': [{ id: 'task-3', title: 'Task 3' }]
  });

  const draggableMarkup = (
    <Draggable id="draggable" className='bg-yellow-500'>
      Drag me
    </Draggable>
  );


  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const sourceContainer = findContainer(active.id);
    const destinationContainer = over.id;

    if (sourceContainer !== destinationContainer) {
      moveTask(active.id, sourceContainer, destinationContainer);
    }


    // setParent(over ? over.id : null);
  }


  // Function to move a task between containers
  function moveTask(taskId, from, to) {
    setTasks((prev) => {
      const taskToMove = prev[from].find((task) => task.id === taskId);
      return {
        ...prev,
        [from]: prev[from].filter((task) => task.id !== taskId),
        [to]: [...prev[to], taskToMove]
      };
    });
  }


  return (
    <>
      <div className='min-h-screen bg-[#efe9e1] text-[#322d29] text-3xl font-bold'>
        <Navbar />


        <DndContext onDragEnd={handleDragEnd} >
 
          <div className='container w-[94%] mx-auto py-14 grid md:grid-cols-3 gap-5 min-h-[90vh]'>

          {
            sections.map((section) => (
              
              <Droppable key={section} id={section} className=''>

                <h2 className="text-2xl font-bold mb-3">{section}</h2>
                <div className="space-y-3">
                  {tasks[section].map((task) => (
                    <Draggable key={task.id} id={task.id} className=" p-2 rounded shadow-md">
                      {task.title}
                    </Draggable>
                  ))}
                </div>

              </Droppable>
            ))
          }

          </div>

        </DndContext>


      </div>
    </>
  )
}

export default App
