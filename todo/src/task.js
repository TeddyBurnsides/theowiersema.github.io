import React from 'react';
import TaskContent from './TaskContent';

class Task extends React.Component {
    render() {
        // toggle text for completion buttone
        let completeButtonVal;
        this.props.status ? completeButtonVal = 'Undo' : completeButtonVal = 'Complete';

        return (
            <div className={'task ' + this.props.status}>
          
                <TaskContent 
                    title={this.props.title} 
                    dueDate={this.props.dueDate}
                />

                <button 
                    onClick={event => this.props.editTask(event,this.props.index)}
                    className={'edit'}>Edit</button>

                <button 
                    onClick={event => this.props.deleteTask(event,this.props.index)} 
                    className={'delete'}>Delete</button>

                <button 
                    onClick={event => this.props.toggleTask(event,this.props.index)} 
                    className={'complete'}>{completeButtonVal}</button>

                <button className={'dragger'}> = </button>
           
            </div>
        )
    }
}

export default Task;