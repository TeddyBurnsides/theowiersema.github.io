import React from 'react';
import TaskContent from './TaskContent';
import { Link} from "react-router-dom";

class Task extends React.Component {
    completeButton(complete,editModeOn) {
        if (editModeOn === false) {
            let checkboxVal='';
            if (complete===true) checkboxVal = '\u2713';
            return (
                <button 
                    onClick={e => this.props.toggleTask(e,this.props.index)} 
                    className={'complete'}>
                        <span>{checkboxVal}</span>
                </button>
            );
        }
    }
    deleteButton(editModeOn) {
        if (editModeOn) {
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
            <div className={'task ' + this.props.task.complete}>          
                <TaskContent 
                    editModeOn = {this.props.editModeOn}
                    title = {this.props.task.title}
                    editedTaskTitle = {this.props.editedTaskTitle}
                    dueDate = {this.props.task.dueDate}
                    editedTaskDate = {this.props.editedTaskDate}
                    editTask = {this.props.editTask}
                    index = {this.props.index}
                />
                {this.completeButton(this.props.task.complete,this.props.editModeOn)}       
                {this.deleteButton(this.props.editModeOn)}
            </div>
        );
    }
}

export default Task;