import React from 'react';
import ReactDOM from 'react-dom';
import TaskList from './taskList';
import NewTaskEntry from './input';
import './styles.css'

class App extends React.Component {
    constructor(props) {
        super(props);

        // refs for input fields
        this.taskInput = React.createRef();
        this.dateInput = React.createRef();

        // bind this to events
        this.deleteTask = this.deleteTask.bind(this);
        this.submitTask = this.submitTask.bind(this); 
        this.toggleTask = this.toggleTask.bind(this);

        // build initial state
        this.state = {
            tasks: [
                {title:'This test',dueDate:'2019-12-9',complete:false},
                {title:'Another thing',dueDate:'2019-1-23',complete:false}
            ]
        }
    }

    submitTask(event) {

        event.preventDefault(); // stop page from refreshing

        const dueDate=this.dateInput.current.value;
        const taskTitle=this.taskInput.current.value;

        if (taskTitle==='') return false; // don't continue if empty

        // build new task
        const newTask = {
            title:taskTitle,
            dueDate:dueDate,
            complete:false
        };
    
        // push new task to array and update state
        this.setState((state) => {
            state.tasks.push(newTask)
            return {tasks:state.tasks}
        });

        document.getElementById('newTaskEntry').reset(); // clear form
    }

    deleteTask(event,index) {
       
        event.preventDefault(); // stop page from refreshing

        // remove task from array and update state
        this.setState((state) => {
            state.tasks.splice(index,1);
            return {tasks:state.tasks}
        })
    }

    toggleTask(event,index) {

        event.preventDefault(); // stop page from refreshing

        const isCompleted = !this.state.tasks[index].complete; // toggle completed state

        // update completed value on task and update state
        this.setState((state) => {
            state.tasks[index].complete = isCompleted;
            return {tasks:state.tasks}
        });

    }

    render() {
        return (
            <div id="app">
                <NewTaskEntry 
                    submitTask={this.submitTask}
                    taskInput={this.taskInput} 
                    dateInput={this.dateInput}
                />
                <TaskList 
                    activeTasks={this.state.tasks} 
                    deleteTask={this.deleteTask}
                    toggleTask={this.toggleTask}
                />
            </div>
        );
    }
}

ReactDOM.render(<App />,document.getElementById('root'));