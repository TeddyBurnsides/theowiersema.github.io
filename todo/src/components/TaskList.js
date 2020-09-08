import React from 'react';
import Task from './Task';
import {Link} from "react-router-dom";

class TaskList extends React.Component {

    noTasksMsg() {
        let count = 0;
        this.props.tasks.forEach(task => {
            if (task.active) count++;
        });
        if (count===0) return (
            <h3>No tasks yet!</h3>
        );
    }

    render () {

       

        const taskList = this.props.tasks.map((task,index) => {
            if (task.active) {
                return (
                    <Link key={index} to={'/task/' + index}>
                        <Task 
                            key={index}
                            index={index}
                            task={task}
                            deleteTask={this.props.deleteTask}
                            toggleTask={this.props.toggleTask}
                            editTask={this.props.editTask}
                            editModeOn={false}
                        />
                    </Link>
                );
            } else {
                return false;
            }
        });

        return (
            <div id="taskList">
                <div className={'wrapper'}>
                    {taskList}
                    {this.noTasksMsg()}
                </div> 
            </div>
        );
    }
}

export default TaskList;