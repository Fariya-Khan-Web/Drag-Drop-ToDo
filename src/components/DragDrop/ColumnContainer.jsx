import React, { useContext } from 'react';
import Column from './Column';
import DragAndDrop from './DragAndDrop';
import { useDragAndDropContext } from '../../Provider/DragAndDropContext';

const ColumnContainer = () => {

    const { columns } = useDragAndDropContext();
    console.log(columns)

    return (
        <div>
            <div className='flex gap-4'>
                {
                    columns.map((col) => (
                        <Column key={col.id} column={col} />
                    ))

                }

            </div>
        </div>
    );
};

export default ColumnContainer;