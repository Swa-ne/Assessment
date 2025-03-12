import React from 'react';
import ListFormBar from './ListFormBar';

const Sidebar = () => {
    return (
        <div className='w-1/3 flex flex-col justify-around rounded-lg p-6 overflow-hidden'>
            <header className='h-20 flex flex-col justify-center items-center mb-6'>
                <h1>LOGO</h1>
                <span>abc company</span>
            </header>
            <div className='flex-1 flex flex-col justify-center'>
                <h3 className='mb-8'>Complete the information</h3>
                <ListFormBar />
            </div>
        </div>
    );
};

export default Sidebar;
