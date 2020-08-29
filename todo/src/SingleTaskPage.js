import React from 'react';
import { BrowserRouter as Router, Route, Link, useParams} from "react-router-dom";
import Task from './task';

export function SingleTaskPage(props) {
    const {id} = useParams();
    const task = props.activeTasks[id];
    return (
        <div id="singeTaskPage">
            <Link className={'homeLink'} to='/'>Back</Link>
            <Task 
                index={id}
                title={task.title}
                dueDate={task.dueDate} 
                status={task.complete}
                deleteTask={props.deleteTask}
                toggleTask={props.toggleTask}
                editTask={props.editTask}
            />
        </div>        
    );
};