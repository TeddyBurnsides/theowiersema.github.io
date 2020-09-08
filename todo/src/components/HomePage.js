import React from 'react';
import TaskInput from './TaskInput';
import TaskList from './TaskList';

class HomePage extends React.Component {
    render() {

        const refs = {
            newTaskTitle: this.props.newTaskTitle,
            newTaskDate: this.props.newTaskDate
        }

        return (
            <div id="home"> 
                <TaskInput {...refs} submitTask={this.props.submitTask} />
                <TaskList tasks={this.props.tasks} toggleTask={this.props.toggleTask} />                
            </div>
        );
    }; 
}

export default HomePage;