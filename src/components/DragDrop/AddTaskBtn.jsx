
import { useDragAndDropContext } from "../../Provider/DragAndDropContext";

const AddTaskBtn = ({ columnId }) => {
    const { createTask } = useDragAndDropContext();

    return (
        <button
            className="btn-ghost flex gap-2 items-center rounded-md p-4 hover:bg-mainBg hover:text-[#72383D] active:bg-[#72383D]/40"
            onClick={() => createTask(columnId)}
        >
            + Add task
        </button>
    )
}

export default AddTaskBtn