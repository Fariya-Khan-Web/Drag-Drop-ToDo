import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import React, { useContext } from 'react';
import '../../input.css';
import ColumnContainer from './ColumnContainer';
import { useDragAndDropContext } from '../../Provider/DragAndDropContext';

const Container = () => {

    const { columns, columnsId, sensors, handleDragStart, handleDragEnd, handleDragOver } = useDragAndDropContext();

    return (
        <div className=''>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}>
                <div className='flex gap-4 m-auto'>
                    <SortableContext items={columnsId}>
                        <ColumnContainer />
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
};

export default Container;