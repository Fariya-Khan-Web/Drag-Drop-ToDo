import { useContext, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import './input.css';

import { AuthContext } from './Provider/AuthProvider';
import DragAndDrop from './components/DragDrop/DragAndDrop';


function App() {

  const { user, tasks, fetchTasks, showModal, setShowModal } = useContext(AuthContext)


  // Define sections
  const sections = ['ToDo', 'InProgress', 'Done'];


  return (
    <div className='bg-[#efe9e1] dark:bg-[#14120f] text-[#322d29] dark:text-[#d6d1cd]'>
      <Navbar />
      <div className='min-h-[calc(100vh-70px)] flex justify-center items-center'>
        <DragAndDrop /> 
      </div>
    </div>
  )
}

export default App