import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDragAndDropContext } from "../../Provider/DragAndDropContext";
import { MdOutlineDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { format, compareAsc } from "date-fns";

const Task = ({ task }) => {
    const { deleteTask, updateTaskModal } = useDragAndDropContext()


    const {
        setNodeRef,
        attributes,
        transition,
        isDragging,
        listeners,
        transform,
    } = useSortable({
        id: task._id,
        data: {
            type: "Task",
            task,
        },
    });



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
                className="opacity-30 z-50 bg-mainBg p-2.5  min-h-[120px] items-center text-left rounded-xl border-2 border-[#72383D] cursor-grab relative"
            >


                <h4 className="font-semibold text-lg">
                    {task.contentTitle}
                </h4>



                <p className="my-auto  w-full">
                    {task.content}
                </p>
            </div>
        );
    }


    return (
        <div
            style={style}
            {...listeners}
            {...attributes}
            ref={setNodeRef}

            className="touch-none p-2.5 min-h-[120px] overflow-hidden overflow-y-scroll items-center  text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-[#72383D]/60 cursor-grab relative duration-300 task bg-[#322d29]/10 dark:bg-[#363230]/50"
        >
            <div className="flex justify-between">

                <h4 className="font-semibold text-lg">
                    {task.contentTitle}
                </h4>

                <div className="flex justify-end">

                    <button
                        onClick={() => {
                            updateTaskModal(task)
                        }}
                        className="stroke-white bg-columnBg p-2 rounded opacity-60 hover:opacity-100"
                    >
                        <RiEdit2Line className="text-xl text-[#72383D]" />
                    </button>
                    <button
                        onClick={() => deleteTask(task._id)}
                        className="stroke-white bg-columnBg p-2 rounded opacity-60 hover:opacity-100"
                    >
                        <MdOutlineDelete className="text-2xl text-[#72383D]" />
                    </button>
                </div>


            </div>

            <p className="my-auto  w-full">
                {task.content}
            </p>

            <p className={compareAsc(task.due_date, new Date()) == -1 ? "flex justify-end text-red-700" : " flex justify-end" }>
                {format(task.due_date, 'P')}
            </p>


        </div>
    )
}

export default Task