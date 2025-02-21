import { useDroppable } from '@dnd-kit/core';
import React from 'react';

const Droppable = ({ id, children, className }) => {

    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });
   
    const style = {
        backgroundColor: isOver ? '#cecac8' : '#ddd',
        transition: 'background-color 0.2s ease',
      };


    return (
        <div ref={setNodeRef} style={style} className='p-4 rounded-md '>
            {children}
        </div>
    );
};

export default Droppable;