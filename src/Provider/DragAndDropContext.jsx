import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { arrayMove } from "@dnd-kit/sortable";
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from './AuthProvider';
import { defaultCols, defaultTasks } from '../data/data';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


export const DragAndDrop = createContext();

const DragAndDropContext = ({ children }) => {

    const { user, loading, tasks, setTasks, fetchTasks } = useContext(AuthContext)
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [columns, setColumns] = useState(defaultCols);
    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    const [showModal, setShowModal] = useState(false)
    const [addTaskModal, setAddTaskModal] = useState(false)
    const [editTask, setEditTask] = useState()


    const columnsId = columns.map((col) => col._id);
    const tasksIds = tasks.map((task) => task._id);


    useEffect(() => {
        if (user?.email) {
            fetchTasks();
        }
    }, [user, editTask]);


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 70,
                tolerance: 30,
               
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 0, // Adjust delay for touch
                tolerance: 50,
               
            },
        })
    );

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

                    const updatedTask = { ...tasks[activeIndex], columnId: tasks[overIndex].columnId };
                    // Update the task in MongoDB
                    updateTaskColumnId(updatedTask);
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

                const updatedTask = { ...tasks[activeIndex], columnId: overId };

                // Update the task in MongoDB
                updateTaskColumnId(updatedTask);
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    const updateTaskColumnId = async (task) => {
        try {
            const response = await axios.put(`https://todo-drag-drop-rho.vercel.app/tasks/${task._id}`, {
                contentTitle: task.contentTitle,
                content: task.content,
                columnId: task.columnId
            });

            if (response.data.modifiedCount > 0) {
                fetchTasks()
                // console.log("Task column updated successfully!");
            } else {
                // console.warn("No changes were made to the task.");
            }

        } catch (error) {
            // console.error("Error updating task column:", error);
        }
    };


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

                try {
                    const res = await axios.delete(`https://todo-drag-drop-rho.vercel.app/tasks/${id}`);
                    if (res.data.acknowledged) {

                        const newTasks = tasks.filter((task) => task._id !== id);
                        setTasks(newTasks);
                        fetchTasks();

                        Swal.fire({
                            title: "Deleted!",
                            text: "Your task has been deleted.",
                            icon: "success"

                        });
                    }
                }
                catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete the task.",
                        icon: "error"
                    });
                }

            }
        });


    }

    const updateTaskModal = (task) => {
        setEditTask(task)
        setShowModal(true)
    }

    const onSubmit = async (data) => {

        if (editTask) {
            // Update task (PUT request)
            try {
                const response = await axios.put(`https://todo-drag-drop-rho.vercel.app/task/${editTask._id}`, {
                    contentTitle: data.contentTitle,
                    content: data.content,
                    columnId: data.columnId,
                    // timestamp: new Date().toISOString(),
                    // userEmail: user?.email,
                });

                fetchTasks()
                toast.success("Task updated successfully!");
                setShowModal(false);
                setEditTask(null);

            } catch (error) {
                toast.error("Failed to update task. Please try again.");
            }

        }
    };

    const Submit = async (data) => {

        const newtask = {
            contentTitle: data.contentTitle,
            content: data.content,
            columnId: data.columnId,
            timestamp: new Date(),
            due_date: data.due_date,
            user_email: user?.email,
        }

        try {
            const res = await axios.post(`https://todo-drag-drop-rho.vercel.app/tasks`, newtask);
            fetchTasks()
            toast.success("Task added successfully!");
            setAddTaskModal(false);
            fetchTasks()


        } catch (error) {
            toast.error("Failed to add task. Please try again.");
        }

        setAddTaskModal(false)
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
        deleteTask,
        updateTaskModal,
        addTaskModal,
        setAddTaskModal
    }

    if (loading) {
        return <div className='min-h-screen flex justify-center items-center'><span className="loading loading-ring loading-lg"></span></div>
    }

    return (
        <DragAndDrop.Provider value={DomTreeInfo}>
            {children}
            {
                showModal && (
                    <div className="modal modal-open">
                        <div className="modal-box dark:bg-[#322d29]">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                                {/* Task Title */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Task Title <span className="text-red-500">*</span></label>
                                    <input
                                        defaultValue={editTask?.contentTitle}
                                        type="text"
                                        {...register("contentTitle", {
                                            required: "Title is required",
                                            maxLength: { value: 40, message: "Title cannot exceed 50 characters" }
                                        })}
                                        className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none"
                                        placeholder="Enter task title"
                                    />
                                    {errors.contentTitle && <p className="text-red-500 text-sm mt-1">{errors.contentTitle.message}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        defaultValue={editTask?.content}
                                        {...register("content", {
                                            required: "Description is required",
                                            maxLength: { value: 150, message: "Description cannot exceed 200 characters" }
                                        })}
                                        className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none h-24 resize-none"
                                        placeholder="Enter task details"
                                    ></textarea>
                                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Category  <span className="text-red-500">*</span></label>
                                    <select
                                        defaultValue={editTask?.columnId}
                                        {...register("columnId", { required: true })}
                                        className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none"
                                    >
                                        <option value="" disabled>Category select</option>
                                        <option value="todo">To-Do</option>
                                        <option value="doing">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                                <div className="modal-action mt-2">
                                    <button className="btn bg-[#72383D] btn-sm border-none px-6 py-2 text-white">Save</button>
                                    <button
                                        onClick={() => {
                                            setShowModal(false)
                                            setEditTask(null)
                                        }}
                                        className="btn btn-sm px-6 py-2 border-none dark:bg-[#72383D]/30 text-white bg-[#c4bebb]">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                addTaskModal && (
                    <div className="modal modal-open dark:bg-[#322d29]">
                        <div className="modal-box dark:bg-[#322d29]">
                            <form onSubmit={handleSubmit(Submit)} className="space-y-2">
                                {/* Task Title */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Task Title <span className="text-red-500">*</span></label>
                                    <input

                                        type="text"
                                        {...register("contentTitle", {
                                            required: "Title is required",
                                            maxLength: { value: 50, message: "Title cannot exceed 50 characters" }
                                        })}
                                        className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none"
                                        placeholder="Enter task title"
                                    />
                                    {errors.contentTitle && <p className="text-red-500 text-sm mt-1">{errors.contentTitle.message}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                                    <textarea

                                        {...register("content", {
                                            required: "Description is required",
                                            maxLength: { value: 200, message: "Description cannot exceed 200 characters" }
                                        })}
                                        className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none h-24 resize-none"
                                        placeholder="Enter task details"
                                    ></textarea>
                                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                                </div>

                                {/* Category */}
                                <div className='grid gap-2 md:grid-cols-2'>

                                    <div>
                                        <label className="block text-gray-700 font-medium">Category  <span className="text-red-500">*</span></label>
                                        <select

                                            {...register("columnId", { required: true })}
                                            className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none"
                                        >
                                            <option value="" disabled>Category select</option>
                                            <option value="todo">To-Do</option>
                                            <option value="doing">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium">Category  <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 p-2 border dark:bg-[#322d29] rounded-md focus:ring-2 focus:ring-[#72383D] outline-none"
                                            {...register("due_date", {
                                                required: "Date is required"
                                            })} />


                                    </div>

                                </div>

                                <div className="modal-action mt-2">
                                    <button className="btn bg-[#72383D] border-none btn-sm px-6 py-2 text-white">Save</button>
                                    <button
                                        onClick={() => {

                                            setAddTaskModal(false)

                                        }}
                                        className="btn btn-sm px-6 py-2 border-none text-white bg-[#c4bebb]">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </DragAndDrop.Provider>
    );
};

export default DragAndDropContext;


// 🎧 use for consumer's | custom hook 🎧
export const useDragAndDropContext = () => useContext(DragAndDrop);