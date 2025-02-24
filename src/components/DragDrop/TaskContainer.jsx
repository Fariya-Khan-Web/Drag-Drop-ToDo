import React, { useContext } from 'react';
import Task from './Task';
import { SortableContext } from '@dnd-kit/sortable';
import DragAndDrop from './DragAndDrop';
import { useDragAndDropContext } from '../../Provider/DragAndDropContext';

const TaskContainer = ({columnId}) => {
    const { tasks, tasksIds } = useDragAndDropContext();

    const colTask = tasks.filter((task) => task.columnId === columnId);

    return (
        <div className="flex flex-grow flex-col gap-4 p-3 overflow-x-hidden overflow-y-auto ">
            <SortableContext items={tasksIds}>
                {
                    colTask?.map(task => <Task key={task._id} task={task} />)
                }
            </SortableContext>
        </div>
    )
};

export default TaskContainer;