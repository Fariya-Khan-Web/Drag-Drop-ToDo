import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext, useState } from "react";
import DragAndDrop from "./DragAndDrop";
import { useDragAndDropContext } from "../../Provider/DragAndDropContext";
import { MdOutlineDelete } from "react-icons/md";

const Task = ({ task }) => {
    const { deleteTask, updateTask } = useDragAndDropContext()

    const [isMouseOver, setIsMouseOver] = useState(false); // for display delete btn
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        setNodeRef,
        attributes,
        transition,
        isDragging,
        listeners,
        transform,
    } = useSortable({
        id: task.id,
        disabled: isEditMode,
        data: {
            type: "Task",
            task,
        },
    });

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
        setIsMouseOver(false);
    };

    const handleKeyDown = (e) => {
        // enter + shift key for close the textArea edit mode...
        if (e.key === "Enter" && e.shiftKey) {
            toggleEditMode();
        }
    }

    const handleOnChange = (e) => {
        updateTask(task.id, e.target.value)
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        // for dragging overlay effect...
        return (
            <div
                style={style}
                ref={setNodeRef}
                className="opacity-30 bg-mainBg p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-blue-500 cursor-grab relative"
            />
        );
    }

    if (isEditMode) {
        return (
            <div
                style={style}
                {...listeners}
                {...attributes}
                ref={setNodeRef}
                className="bg-mainBg p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative"
            >
                <textarea
                    className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
                    autoFocus
                    value={task.content}
                    onBlur={toggleEditMode}
                    onChange={handleOnChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Task content here"
                />
            </div>
        );
    }

    return (
        <div
            style={style}
            {...listeners}
            {...attributes}
            ref={setNodeRef}
            className="bg-mainBg p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative duration-300 task"
            onMouseLeave={() => setIsMouseOver(false)}
            onMouseEnter={() => setIsMouseOver(true)}
            onClick={toggleEditMode}
        >

            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                {task.content}
            </p>

            {
                // task delete btn...
                isMouseOver && (
                    <button
                        onClick={() => deleteTask(task.id)}
                        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBg p-2 rounded opacity-60 hover:opacity-100"
                    >
                        <MdOutlineDelete className="text-2xl text-[#72383D]" />
                    </button>
                )
            }
        </div>
    )
}

export default Task