import React from 'react';
import TaskContent from './TaskContent';
import { Link} from "react-router-dom";

class Task extends React.Component {
    completeButton() {
        let checkboxVal='';
        if (this.props.status===true) checkboxVal = '\u2713';
        if (this.props.editModeOn === false) {
            return (
                <button 
                    onClick={e => this.props.toggleTask(e,this.props.index)} 
                    className={'complete'}>
                        <span>{checkboxVal}</span>
                </button>
            );
        }
    }
    deleteButton() {
        if (this.props.editModeOn === true) {
            return (
                <button
                    onClick={e => this.props.deleteTask(e,this.props.index)} 
                    className={'delete'}>
                        <Link to='/'>Delete Task</Link>
                </button>
            );
        }
    }

    render() {   
        return (
            <div className={'task ' + this.props.status}>          
                <TaskContent 
                    editModeOn = {this.props.editModeOn}
                    title = {this.props.task.title}
                    editedTaskTitle = {this.props.editedTaskTitle}
                    dueDate = {this.props.task.dueDate}
                    editedTaskDate = {this.props.editedTaskDate}
                    editTask = {this.props.editTask}
                    index = {this.props.index}
                />
                {this.completeButton()}       
                {this.deleteButton()}
            </div>
        );
    }
}

export default Task;