import { useDraggable } from '@dnd-kit/core';
import React from 'react';

const Draggable = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      } : undefined;


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className='p-3 bg-[#322d29]/10 rounded'>
            {children}
        </div>
    );
};

export default Draggable;