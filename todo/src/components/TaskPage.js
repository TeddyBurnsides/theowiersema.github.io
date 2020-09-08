import React from 'react';
import {Link, useParams} from "react-router-dom";
import Task from './Task';

const TaskPage = props => {
    const {id} = useParams();
    const task = props.tasks[id];
    return (
        <div id="singleTaskPage">
            <div className={'wrapper'}>
                <Link className={'homeLink'} to='/'>&larr;</Link>
                <Task 
                    index={id}
                    task={task}
                    deleteTask={props.deleteTask}
                    editTask={props.editTask}
                    editedTaskTitle={props.editedTaskTitle}
                    editedTaskDate={props.editedTaskDate}
                    editModeOn={true}
                />
            </div>
        </div>        
    );
};

export default TaskPage;