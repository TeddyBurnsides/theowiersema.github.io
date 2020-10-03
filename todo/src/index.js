import React from 'react';
import ReactDOM from 'react-dom';
import * as Realm from 'realm-web';
import bson from 'bson'; // for ObjectID translation

// Connection
const app = new Realm.App({ id: "todo-app-mnupq", timeout: 10000 });
const mongoCol = app.services.mongodb('mongodb-atlas').db('data').collection('tasks');

/*
    MAIN WRAPPER
*/
class App extends React.Component {
    constructor(props) {
        super();
        // refs for input fields
        this.newTaskTitle = React.createRef();
        // state holds things require page updates when changed
        this.state = {
            tasks:[],
            user:app.currentUser,
            addingTask:false,
            loadingTasks:false
        }
    }
    componentDidMount() {
        // start task loading animation
        this.setState({loadingTasks:true});
        // anonymous function to retrieve tasks from server when page loads
        (async () => {
            try {
                const tasks = await mongoCol.find({status:true}); // find non-deleted tasks
                this.setState({tasks:tasks})
                // finish task loading animation
                this.setState({loadingTasks:false});
            } catch {
                return 'Failed to retrieve tasks';
            }
        })();
        
    }
    render() {
        /*
            ADD NEW TASK
        */
        const addTask = async (event) => {
            // prevent page from refreshing
            event.preventDefault(); 
            // starting loading animation
            this.setState({addingTask:true});
            // get value of input field
            const taskTitle = this.newTaskTitle.current.value; 
            // don't continue if empty
            if (taskTitle==='') return false; 
            // clear input fields in form
            document.getElementById('newTaskEntry').reset();
            // server operations
            try {
                // add new tasks to server 
                const newID = await mongoCol.insertOne({
                    title:taskTitle,
                    status:true,
                    complete:false
                });
                // update state with new task (for real time updates on page)
                this.setState((state) => {
                    state.tasks.push({
                        _id: new bson.ObjectId(newID.insertedId.id), // extract actual ID
                        title: taskTitle,
                        status: true,
                        complete: false
                    });
                    return {tasks:state.tasks}
                });
                // clear loading animation
                this.setState({addingTask:false});
            } catch {
                console.log('Adding task failed!');
            }
        }
        /*
            LOG OUT
        */
        const logout = async () => {
            try {
                await app.currentUser.logOut().then(this.setState({
                    user:''
                }));
            } catch {
                console.log('Unable to Log out');
            }
        }
        /*
            Complete and Uncomplete Task
        */
        const completeTask = async (id,status) => {
            try {
                // get index of task we're removing
                const index = this.state.tasks.findIndex((el) => el._id.toString() === id);
                // set state
                this.setState((state) => {
                    state.tasks[index].complete=!status;
                    return {tasks:state.tasks}
                });
                // update task on server
                await mongoCol.updateOne(
                    {_id: new bson.ObjectId(id)},
                    {$set: {'complete': !status}} // toggle true/false flag
                );
            } catch {
                console.log('Unable to complete task');
            }
        }
        /*
            DELETE SINGLE TASK
        */  
        const deleteTask = async (id) => {
            try {
                // get index of task we're removing
                const index = this.state.tasks.findIndex((el) => el._id.toString() === id);
                // update state
                this.setState((state) => {
                    state.tasks.splice(index,1);
                    return {tasks:state.tasks}
                });
                // remove tasks on server
                await mongoCol.deleteOne(
                    {_id: new bson.ObjectId(id)}
                );
            } catch {
                console.log('Unable to delete Task.')
            }
        }
        /*
            DELETE ALL TASKS 
        */
        const deleteAllTasks = async () => {
            try {
                await mongoCol.deleteMany({status:true});
            } catch {
                console.log('Unable to delete all tasks!')
            }
        }
        /*
            LOG IN
        */  
        const login = async () => {
            const user = await app.logIn(Realm.Credentials.anonymous());
            this.setState({user:user});
        };
        /*
            IF LOGGED IN
        */  
        if (this.state.user) {
            return (
                <div>
                    <NewTaskEntry 
                        newTaskTitle={this.newTaskTitle} 
                        addTask={addTask} 
                        addingTask={this.state.addingTask}
                    />
                    <TaskList 
                        tasks={this.state.tasks}
                        deleteTask={deleteTask}
                        completeTask={completeTask}
                        loadingTasks={this.state.loadingTasks}
                    />    
                    <LogOutButton logout={logout} />
                    <DeleteAllButton deleteAllTasks={deleteAllTasks} />  
                </div>  
            )
        /*
            IF LOGGED OUT
        */
        } else {
            return (
                <LogInButton login={login} />
            )
        }
    }
}

class TaskList extends React.Component {
    render() {    
        let taskList = this.props.tasks.map((task,index) => {
            return(
                <Task 
                    key={task._id} 
                    task={task}
                    deleteTask={this.props.deleteTask}
                    completeTask={this.props.completeTask}
                />
            );
        }).reverse(); // puts most recent task on top
        // handle "loading"
        if (this.props.loadingTasks) {
            return <p>Loading Tasks...</p>
        } else if (taskList.length === 0) {
            return <p>No tasks</p>
        } else {
            return <ul>{taskList}</ul>
        }
    }
}

class Task extends React.Component {
    render() {
        return (
            <li>
                {this.props.task.title}
                <CompleteTaskButton 
                    complete={this.props.task.complete} 
                    id={this.props.task._id.toString()} 
                    completeTask={this.props.completeTask}
                />
                <DeleteTaskButton 
                    id={this.props.task._id.toString()} 
                    deleteTask={this.props.deleteTask}
                />
            </li>
        );
    }
}
class CompleteTaskButton extends React.Component {
    render() {
        let buttonText = 'Complete';
        if (this.props.complete) buttonText='Uncomplete';
        return (    
            <button onClick={() => this.props.completeTask(this.props.id,this.props.complete)}>{buttonText}</button>
        )
    }
}
class DeleteTaskButton extends React.Component {
    render() {
        return <button onClick={() => this.props.deleteTask(this.props.id)}>Delete</button>
    }
}

class NewTaskEntry extends React.Component {
    render() { 
        return (
            <form id="newTaskEntry">
                <input type="text" ref={this.props.newTaskTitle} />
                <button onClick={(e) => this.props.addTask(e)}>Add Task</button>
                <Loader addingTask={this.props.addingTask} />
            </form>       
        );
    }
}

class Loader extends React.Component {
    render() {
        if (this.props.addingTask) {
            return <i>Adding Task..</i>
        } else {
            return ('')
        }
    }
}

class LogOutButton extends React.Component {
    render() {
        return <button onClick={() => this.props.logout()}>Log Out</button>
    }
}

class LogInButton extends React.Component {
    render() {
        return <button onClick={() => this.props.login()}>Log In</button>
    }
}

class DeleteAllButton extends React.Component {
    render() {
        return <button onClick={() => this.props.deleteAllTasks()}>Delete All</button>
    }
}

ReactDOM.render(<App />,document.getElementById('root'));