import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {SingleTaskPage} from './SingleTaskPage';
import HomePage from './HomePage';
import './styles.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        // refs for input fields
        this.taskInput = React.createRef();
        this.dateInput = React.createRef();
        this.newTaskTitle = React.createRef();
        this.newDueDate = React.createRef();

        // bind this to events
        this.deleteTask = this.deleteTask.bind(this);
        this.submitTask = this.submitTask.bind(this); 
        this.toggleTask = this.toggleTask.bind(this);
        this.editTask = this.editTask.bind(this);

        // build initial state
        this.state = {
            tasks: [
                {title:'Take out the trash to the curb',dueDate:'2020-09-03',complete:false,active:true},
                {title:'Do the dishes in the kitchen',dueDate:'2019-01-23',complete:true,active:true},
                {title:'Mow grass',dueDate:'',complete:true,active:true},
                {title:'Deleted Task - this should not show up ever really ever again to be honest',dueDate:'2019-01-23',complete:false,active:true},
                {title:'Complete this site',dueDate:'2020-09-04',complete:false,active:false},
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
            complete:false,
            active:true
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
            state.tasks[index].active = false;
            return {tasks:state.tasks};
        });
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

       const newTaskTitle = this.newTaskTitle.current.value;
       const newDueDate = this.newDueDate.current.value;

        this.setState((state) => {
            state.tasks[index].title = newTaskTitle;
            state.tasks[index].dueDate = newDueDate;
            return {tasks:state.tasks};
        });
        
    }

    render() {     

        // add functions to array to pass as a spread prop
        const actions = {
            submitTask: this.submitTask,
            deleteTask: this.deleteTask,
            toggleTask: this.toggleTask,
            editTask: this.editTask,
        }

        // add refs to array to pass a spread prop
        const refs = {
            taskInput: this.taskInput,
            dateInput: this.dateInput,
            newTaskTitle: this.newTaskTitle,
            newDueDate: this.newDueDate,
        }

        return (        
            <Router>
                <Switch>
                    <Route 
                        path="/" 
                        exact
                        render={() => (
                            <HomePage {...actions} {...refs} activeTasks={this.state.tasks} />
                        )}
                    />
                    <Route
                        path="/task/:id"
                        render={() => (
                            <SingleTaskPage {...actions} {...refs} activeTasks={this.state.tasks} />
                        )}
                    />
                </Switch>
            </Router>
        ); // return ()
    } // render()
} // class

ReactDOM.render(<App />,document.getElementById('root'));