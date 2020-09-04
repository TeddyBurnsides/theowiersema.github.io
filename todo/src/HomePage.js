import React from 'react';
import NewTaskEntry from './input';
import TaskList from './taskList';

class HomePage extends React.Component {
    render() {
        return (
            <div id="home">
                
                    <NewTaskEntry 
                        submitTask={this.props.submitTask}
                        taskInput={this.props.taskInput} 
                        dateInput={this.props.dateInput}
                    />
                    <TaskList 
                        activeTasks={this.props.activeTasks} 
                        deleteTask={this.props.deleteTask}
                        toggleTask={this.props.toggleTask}
                        editTask={this.props.editTask}
                    />
                
            </div>
        );
    }; 
}

export default HomePage;