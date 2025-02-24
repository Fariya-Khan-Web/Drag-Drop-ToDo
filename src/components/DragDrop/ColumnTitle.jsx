import { useContext } from "react";
import DragAndDrop from "./DragAndDrop";
import { useDragAndDropContext } from "../../Provider/DragAndDropContext";

const ColumnTitle = ({ colData, attributes, listeners }) => {

    const { deleteColumn, updateColumn } = useDragAndDropContext();

    return (
        <div
            {...listeners}
            {...attributes}

            className="text-md h-[60px] border-b cursor-grab p-3 px-5 text-xl font-bold flex items-center justify-between"
        >

            {colData.title}
 
        </div >

    )
}

export default ColumnTitle