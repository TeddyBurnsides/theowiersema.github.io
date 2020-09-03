import React from 'react';
import Task from './task';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

class TaskList extends React.Component {
    render () {
        const taskList = this.props.activeTasks.map((task,index) => {
            if (task.active == true) {
                return (
                    <Link key={index} to={'/task/' + index}>
                        <Task 
                            key={index}
                            index={index}
                            title={task.title}
                            dueDate={task.dueDate} 
                            status={task.complete}
                            deleteTask={this.props.deleteTask}
                            toggleTask={this.props.toggleTask}
                            editTask={this.props.editTask}
                            editModeOn={false}
                        />
                    </Link>
                );
            }
        });

        return (
            <div id="taskList">
                {taskList}
            </div>
        );
    }
}

export default TaskList;