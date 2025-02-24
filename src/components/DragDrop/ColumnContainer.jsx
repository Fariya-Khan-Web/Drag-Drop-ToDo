import React, { useContext } from 'react';
import Column from './Column';
import DragAndDrop from './DragAndDrop';
import { useDragAndDropContext } from '../../Provider/DragAndDropContext';

const ColumnContainer = () => {

    const { columns } = useDragAndDropContext();
    console.log(columns)

    return (
        <div>
            <div className='grid md:grid-cols-3 gap-4 w-[94%] mx-auto max-w-screen-xl'>
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