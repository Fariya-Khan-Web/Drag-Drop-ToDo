import { useContext } from "react";
import DragAndDrop from "./DragAndDrop";
import { useDragAndDropContext } from "../../Provider/DragAndDropContext";

const ColumnTitle = ({ colData, attributes, listeners, editMode, setEditMode }) => {

    const { deleteColumn, updateColumn } = useDragAndDropContext();

    return (
        <div
            {...listeners}
            {...attributes}
            onClick={() => setEditMode(true)}
            className="bg-mainBg text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBg border-4 flex items-center justify-between"
        >

            <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center bg-columnBg px-2 py-1 text-sm rounded-full">0</div>

                {
                    editMode
                        ? (
                            <input
                                autoFocus
                                value={colData.title}
                                className="bg-black focus:border-blue-500 border rounded outline-none px-2"
                                onChange={(e) => updateColumn(colData.id, e.target.value)}
                                onBlur={() => setEditMode(false)}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    setEditMode(false);
                                }}
                            />
                        ) : colData.title
                }
            </div>


            <div className="">
                <button
                    onClick={() => deleteColumn(colData.id)}
                    className="stroke-gray-500 hover:stroke-red-500 duration-300 rounded px-1 py-2"
                >
                    Delete
                </button>
            </div>

        </div >

    )
}

export default ColumnTitle