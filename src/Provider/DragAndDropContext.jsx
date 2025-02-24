import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { defaultCols, defaultTasks } from '../data/data';
import { arrayMove } from "@dnd-kit/sortable";


export const DragAndDrop = createContext();

const DragAndDropContext = ({ children }) => {

    const [columns, setColumns] = useState(defaultCols);
    console.log(columns)
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    console.log(columnsId)

    const [tasks, setTasks] = useState(defaultTasks);
    const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);



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
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

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
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

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
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId;
                console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    const deleteTask = (id) => {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
    }

    const updateTask = (id, content) => {
        const newTasks = tasks.map((task) =>
            task.id === id ? { ...task, content } : task
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

    return (
        <DragAndDrop.Provider value={DomTreeInfo}>
            {children}
        </DragAndDrop.Provider>
    );
};

export default DragAndDropContext;


// 🎧 use for consumer's | custom hook 🎧
export const useDragAndDropContext = () => useContext(DragAndDrop);