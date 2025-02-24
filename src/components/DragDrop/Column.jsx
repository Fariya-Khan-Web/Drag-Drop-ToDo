import React, { useState } from 'react';
import ColumnTitle from './ColumnTitle';
import TaskContainer from './TaskContainer';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import AddTaskBtn from './AddTaskBtn';


const Column = ({ column }) => {


    const {
        setNodeRef,
        attributes,
        transition,
        isDragging,
        listeners,
        transform,
    } = useSortable({
        id: column.id,
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
                className="bg-columnBg opacity-40 border-2 border-[#72383D]  md:h-[calc(80vh)] rounded-md flex flex-col"
               
            ></div>
        );
    }

    
    return (
        <div
            style={style}
            ref={setNodeRef}
            // w-full break-inside-avoid mb-4
            // w-[350px]
            className="bg-[#ddd] dark:bg-[#1d1b1b] break-inside-avoid my-2 h-[calc(40vh)] md:h-[calc(80vh)] rounded-md flex flex-col bg-columnBg"
        >

            <ColumnTitle
                colData={column}
                listeners={listeners}
                attributes={attributes}
            />

            <TaskContainer columnId={column.id} />

            <AddTaskBtn columnId={column.id} />
        </div>
    );
};

export default Column;