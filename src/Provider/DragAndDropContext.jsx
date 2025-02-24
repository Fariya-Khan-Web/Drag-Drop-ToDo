import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { arrayMove } from "@dnd-kit/sortable";
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from './AuthProvider';
import { defaultCols, defaultTasks } from '../data/data';
import axios from 'axios';
import Swal from 'sweetalert2';


export const DragAndDrop = createContext();

const DragAndDropContext = ({ children }) => {

    const { user, loading } = useContext(AuthContext)
    const email = user?.email;

    const [columns, setColumns] = useState(defaultCols);
    const [tasks, setTasks] = useState([]);
    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);


    const columnsId = columns.map((col) => col._id);
    const tasksIds = tasks.map((task) => task._id);



    useEffect(() => {
        fetch(`http://localhost:3000/tasks/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setTasks(data)
            })
    }, [email])


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function createTask(columnId) {
        const newTask = {
            id: crypto.randomUUID(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTasks([...tasks, newTask]);
    }

    const handleDragStart = (event) => {
        const { current } = event.active.data;

        if (current?.type === "Column") {
            setActiveColumn(current.colData);
            return;
        }

        if (current?.type === "Task") {
            setActiveTask(current.task);
            return;
        }
    }

    const handleDragEnd = (event) => {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;


        const activeId = active.id;
        const overId = over.id;


        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        // console.log("DRAG END");

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col._id === activeId);

            const overColumnIndex = columns.findIndex((col) => col._id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t._id === activeId);
                const overIndex = tasks.findIndex((t) => t._id === overId);

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    // Fix introduced after video recording
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t._id === activeId);

                tasks[activeIndex].columnId = overId;
                console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    const deleteTask = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#72383D",
            cancelButtonColor: "#cecac8",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log('want to delete')


                try {
                    const res = await axios.delete(`http://localhost:3000/tasks/${id}`);
                    if(res.data.acknowledged){
                    
                        const newTasks = tasks.filter((task) => task._id !== id);
                        setTasks(newTasks);
                    
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your task has been deleted.",
                            icon: "success"
                    
                        });
                    }
                }
                catch (error) {
                    console.error("Error deleting task:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete the task.",
                        icon: "error"
                    });
                }

            }
        });


    }

    const updateTask = (id, content) => {
        const newTasks = tasks.map((task) =>
            task._id === id ? { ...task, content } : task
        );

        setTasks(newTasks);
    }

    const DomTreeInfo = {
        columns,
        columnsId,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        activeColumn,
        activeTask,
        sensors,
        tasks,
        tasksIds,
        setTasks,
        createTask,
        deleteTask,
        updateTask,
    }

    if (loading) {
        return <div className='min-h-screen flex justify-center items-center'><span className="loading loading-ring loading-lg"></span></div>
    }

    return (
        <DragAndDrop.Provider value={DomTreeInfo}>
            {children}
        </DragAndDrop.Provider>
    );
};

export default DragAndDropContext;


// 🎧 use for consumer's | custom hook 🎧
export const useDragAndDropContext = () => useContext(DragAndDrop);