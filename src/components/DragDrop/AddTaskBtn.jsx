
import { useDragAndDropContext } from "../../Provider/DragAndDropContext";

const AddTaskBtn = ({ columnId }) => {
    const { createTask, addTaskModal, setAddTaskModal } = useDragAndDropContext();

    return (
        <button
            className="btn-ghost font-bold rounded-md p-4 hover:bg-mainBg hover:text-[#72383D] active:bg-[#72383D]/40"
            onClick={() => {
                setAddTaskModal(true)
            }}
        >
            + Add task
        </button>
    )
}

export default AddTaskBtn