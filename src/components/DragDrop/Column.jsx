import React, { useState } from 'react';
import ColumnTitle from './ColumnTitle';
import TaskContainer from './TaskContainer';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";


const Column = ({ column }) => {

    console.log(column)
    const [editMode, setEditMode] = useState(false);


    const {
        setNodeRef,
        attributes,
        transition,
        isDragging,
        listeners,
        transform,
    } = useSortable({
        id: column.id,
        disabled: editMode,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    
    if (isDragging) {
        return (
            <div
                style={style}
                ref={setNodeRef}
                className="bg-columnBg opacity-40 border-2 border-blue-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
                // className="w-full break-inside-avoid mb-4 h-[500px] max-h-[500px] rounded-md flex flex-col bg-columnBg opacity-40 border-2 border-blue-500"
            ></div>
        );
    }

    
    return (
        <div
            style={style}
            ref={setNodeRef}
            // w-full break-inside-avoid mb-4
            // w-[350px]
            className="w-[350px] break-inside-avoid mb-4 h-[500px] max-h-[500px] rounded-md flex flex-col bg-columnBg"
        >

            <ColumnTitle
                colData={column}
                editMode={editMode}
                listeners={listeners}
                attributes={attributes}
                setEditMode={setEditMode}
            />

            <TaskContainer columnId={column.id} />

            {/* <AddTaskBtn columnId={column.id} /> */}
        </div>
    );
};

export default Column;