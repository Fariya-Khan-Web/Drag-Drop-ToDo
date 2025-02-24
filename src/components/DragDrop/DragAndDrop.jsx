import React from 'react';
import DragAndDropContext from '../../Provider/DragAndDropContext';
import Container from './Container';

const DragAndDrop = () => {
    return (
        <DragAndDropContext>
            <Container/>
        </DragAndDropContext>
    );
};

export default DragAndDrop;