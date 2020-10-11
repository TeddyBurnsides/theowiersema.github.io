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
        //this.password = React.createRef();
       // this.username = React.createRef();
        // state holds things require page updates when changed
        this.state = {
            tasks:[], // contains all tasks
            user:app.currentUser, // info from the currently logged in user
            addingTask:false, // flag while we add task to server
            loadingTasks:false, // flag while we wait for tasks from server
            failedLogin:false // flag that login failed
        }
    }
    // fetch task list when reloading
    componentDidMount() {
        // if you're logged in
        if (this.state.user) {
            // start task loading animation
            this.setState({loadingTasks:true});
            // anonymous function to retrieve tasks from server when page loads
            (async () => {
                try {
                    const tasks = await mongoCol.find({user:this.state.user.id}); // find non-deleted tasks
                    this.setState({tasks:tasks})
                    // finish task loading animation
                    this.setState({loadingTasks:false});
                } catch {
                    return 'Failed to retrieve tasks';
                }
            })();
        }
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
                    complete:false,
                    user:this.state.user.id
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
        const logIn = async (event,username,password) => {
            // prevent page refresh
            event.preventDefault();
            // get username and password values (refs were passed in)
            username = username.current.value;
            password = password.current.value;
            // don't do anything if values are empty
            if (username===''||password==="") return false;
            // Create an anonymous credential
            const credentials = Realm.Credentials.emailPassword(username, password);
            let user = null;
            try {
              // Authenticate the user
              user = await app.logIn(credentials);
              // update state to trigger page refresh
              this.setState({user:user});
            } catch(err) {
               // this.setState({user:user});
              console.error("Failed to log in", err);
            }
            // handles failed login warning (Reset if login successful)
            this.setState({failedLogin:(user === null)});
            // load posts if login was successful
            if (user) {
                // trigger loading posts indicator
                this.setState({loadingTasks:true});
                // get posts from server
                (async () => {
                    try {
                        const tasks = await mongoCol.find({user:this.state.user.id}); // find non-deleted tasks
                        this.setState({tasks:tasks})
                        // finish task loading animation
                        this.setState({loadingTasks:false});
                    } catch {
                        return 'Failed to retrieve tasks';
                    }
                })();
            }
            
            
          }
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
                <LogIn
                    failedLogin={this.state.failedLogin}
                    username={this.username}
                    password={this.password}
                    logIn={logIn} 
                />
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
        // if still loading tasks
        if (this.props.loadingTasks) {
            return <p>Loading Tasks...</p>
        // if not loading, but no tasks retrieved
        } else if (taskList.length === 0) {
            return <p>No tasks</p>
        // if not loading, and we have tasks
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
                <input 
                    placeholder="Type here..."
                    type="text" 
                    ref={this.props.newTaskTitle} 
                />
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

class LogIn extends React.Component {
    constructor(props) {
        super();
        // refs are eventually passed into logIn() function
        this.username = React.createRef();
        this.password = React.createRef();
    }
    render() {
        let failedLoginMsg = '';
        if (this.props.failedLogin) {
            failedLoginMsg = 'Incorrect Credentials';
        }
        return (
            <form>
                <p>{failedLoginMsg}</p>
                <input 
                    ref={this.username}
                    type="text" 
                    placeholder="Email"
                    defaultValue="theo.ew@gmail.com" 
                />
                <input 
                    ref={this.password}
                    type="password" 
                    placeholder="Password" 
                    defaultValue="password"
                />
                <button onClick={(e) => this.props.logIn(e,this.username,this.password)}>Log In</button>
            </form>
            
        )
    }
}

class DeleteAllButton extends React.Component {
    render() {
        return <button onClick={() => this.props.deleteAllTasks()}>Delete All</button>
    }
}

ReactDOM.render(<App />,document.getElementById('root'));