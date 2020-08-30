import React from 'react';
import TaskContent from './TaskContent';

class Task extends React.Component {
    render() {
        // toggle text for completion buttone
        let completeButtonVal;
        this.props.status ? completeButtonVal = 'Mark In Progress' : completeButtonVal = 'Mark Completed';

        return (
            <div className={'task ' + this.props.status}>
          
                <TaskContent 
                    title={this.props.title} 
                    dueDate={this.props.dueDate}
                    editTask={this.props.editTask}
                    index={this.props.index}
                    newTaskTitle={this.props.newTaskTitle}
                    editModeOn={this.props.editModeOn}
                />

                <button 
                    onClick={event => this.props.deleteTask(event,this.props.index)} 
                    className={'delete'}>Delete</button>

                <button 
                    onClick={event => this.props.toggleTask(event,this.props.index)} 
                    className={'complete'}>{completeButtonVal}</button>
           
            </div>
        )
    }
}

export default Task;