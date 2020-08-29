import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, useParams } from "react-router-dom";

import Task from './task';

import HomePage from './HomePage';
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
        this.editTask = this.editTask.bind(this);

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
            return {tasks:state.tasks};
        })
    }

    toggleTask(event,index) {

        event.preventDefault(); // stop page from refreshing

        const isCompleted = !this.state.tasks[index].complete; // toggle completed state

        // update completed value on task and update state
        this.setState((state) => {
            state.tasks[index].complete = isCompleted;
            return {tasks:state.tasks};
        });

    }

    editTask(event,index) {

        event.preventDefault(); // stop page from refreshing

        this.setState((state) => {
            state.tasks[index].title = "theodore";
            return {tasks:state.tasks};
        });
        
    }
    
    render() {     
        return (        
            <Router>
                <Route 
                    path="/" 
                    exact
                    render={() => (
                        <HomePage 
                            submitTask={this.submitTask}
                            taskInput={this.taskInput} 
                            dateInput={this.dateInput}
                            activeTasks={this.state.tasks} 
                            deleteTask={this.deleteTask}
                            toggleTask={this.toggleTask}
                            editTask={this.editTask}
                        />
                    )}
                />
                <Route
                    path="/task/:id"
                    render={() => (
                        <SingleTaskPage 
                            activeTasks={this.state.tasks} 
                            deleteTask={this.props.deleteTask}
                            toggleTask={this.toggleTask}
                            editTask={this.editTask}
                        />
                    )}
                />
            </Router>
        );
    }
}

const SingleTaskPage = (props) => {
    const {id} = useParams();
    const task = props.activeTasks[id];
    return (
        <div id="task">
            <Link to='/'>Back Home</Link>
            <Task 
                index={id}
                title={task.title}
                dueDate={task.dueDate} 
                status={task.complete}
                deleteTask={props.deleteTask}
                toggleTask={props.toggleTask}
                editTask={props.editTask}
            />
        </div>        
    );
};

ReactDOM.render(<App />,document.getElementById('root'));