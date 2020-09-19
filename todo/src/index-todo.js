import './styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TaskPage from './components/TaskPage';
import HomePage from './components/HomePage';



class App extends React.Component {
    constructor(props) {
        super(props);

        // refs for input fields
        this.newTaskTitle = React.createRef();
        this.newTaskDate = React.createRef();
        this.editedTaskTitle = React.createRef();
        this.editedTaskDate = React.createRef();

        // build initial state
        this.state = {
            tasks: [
                {title:'Take out the trash to the curb',dueDate:'2020-09-03',complete:false,active:true},
                {title:'Do the dishes in the kitchen',dueDate:'2019-01-23',complete:true,active:true},
                {title:'Mow grass',dueDate:'',complete:false,active:true},
                {title:'Deleted Task - this should not show up ever really ever again to be honest',dueDate:'2019-01-23',complete:true,active:true},
                {title:'Complete this site',dueDate:'2020-09-04',complete:false,active:false},
            ]
        }
    }

    render() {     

        // add functions to array to pass as a spread prop
        const actions = {
            submitTask: (event) => {

                event.preventDefault(); // stop page from refreshing
        
                // get values of input fields from refs
                const dueDate=this.newTaskDate.current.value;
                const taskTitle=this.newTaskTitle.current.value;
        
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
            },
            deleteTask: (event,index) => {
       
                event.preventDefault(); // stop page from refreshing
        
                // remove task from array and update state
                this.setState((state) => {
                    state.tasks[index].active = false;
                    return {tasks:state.tasks};
                });
            },
            toggleTask: (event,index) => {

                event.preventDefault(); // stop page from refreshing
        
                const isCompleted = !this.state.tasks[index].complete; // toggle completed state
        
                // update completed value on task and update state
                this.setState((state) => {
                    state.tasks[index].complete = isCompleted;
                    return {tasks:state.tasks};
                });
        
            },
            editTask: (event,index) => {

                event.preventDefault(); // stop page from refreshing
        
               const newTaskTitle = this.editedTaskTitle.current.value;
               const newDueDate = this.editedTaskDate.current.value;
        
                this.setState((state) => {
                    state.tasks[index].title = newTaskTitle;
                    state.tasks[index].dueDate = newDueDate;
                    return {tasks:state.tasks};
                });
                
            }
        }

        // add refs to array to pass a spread prop
        const refs = {
            newTaskTitle: this.newTaskTitle,
            newTaskDate: this.newTaskDate,
            editedTaskTitle: this.editedTaskTitle,
            editedTaskDate: this.editedTaskDate,
        }

        return (        
            <Router>
                <Switch>
                    <Route path="/" exact
                        render={() => (
                            <HomePage {...actions} {...refs} tasks={this.state.tasks} />
                        )}
                    />
                    <Route path="/task/:id"
                        render={() => (
                            <TaskPage {...actions} {...refs} tasks={this.state.tasks} />
                        )}
                    />
                </Switch>
            </Router>
        ); // return ()
    } // render()
} // App class

ReactDOM.render(<App />,document.getElementById('root'));