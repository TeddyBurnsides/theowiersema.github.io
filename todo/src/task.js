import React from 'react';
import TaskContent from './TaskContent';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

class Task extends React.Component {
    deleteButton() {
        if (this.props.editModeOn) {
            return (  
                <button
                    onClick={event => this.props.deleteTask(event,this.props.index)} 
                    className={'delete'}>
                        <Link to='/'>Delete Task</Link>
                </button>     
            );
        }
    };
    render() {
        
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

                {this.deleteButton()}

                <button 
                    onClick={event => this.props.toggleTask(event,this.props.index)} 
                    className={'complete'}>&#10003;</button>
           
            </div>
        )
    }
}

export default Task;