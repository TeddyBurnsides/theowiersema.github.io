import React from 'react';
import Task from './task';

class TaskList extends React.Component {
    render () {
        const taskList = this.props.activeTasks.map((task,index) => {
            return (
                <Task 
                    key={index}
                    index={index}
                    title={task.title}
                    dueDate={task.dueDate} 
                    status={task.complete}
                    deleteTask={this.props.deleteTask}
                    toggleTask={this.props.toggleTask}
                />
            );
        });

        return (
            <div id="taskList">
                {taskList}
            </div>
        );
    }
}

export default TaskList;