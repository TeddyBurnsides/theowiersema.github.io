import React from 'react';
import ReactDOM from 'react-dom';
import * as Realm from 'realm-web';
import bson from 'bson'; // for ObjectID translation
// Connection
const app = new Realm.App({ id: "todo-app-mnupq", timeout: 10000 });
const mongoCol = app.services.mongodb('mongodb-atlas').db('data').collection('tasks');

// Main Wrapper
class App extends React.Component {
    constructor() {
        super();
        // state holds things require page updates when changed
        this.state = {
            tasks:[], // contains all tasks
            user:app.currentUser, // info from the currently logged in user
            addingTask:false, // flag while we add task to server
            loadingTasks:false, // flag while we wait for tasks from server
            signUpBanner: { // sign up warnings/success
                show:false,
                msg:''
            },
            logInBanner: { // log in warnings
                show:false,
                msg:''
            }
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
        const addTask = async (event,taskTitle) => {
            // prevent page from refreshing
            event.preventDefault(); 
            // starting loading animation
            this.setState({addingTask:true});
            // get value of input field
            taskTitle = taskTitle.current.value; 
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
        const logout = async () => {
            try {
                await app.currentUser.logOut().then(this.setState({
                    user:''
                }));
            } catch {
                console.log('Unable to Log out');
            }
        }
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
        const saveEditedTask = async (id,newTitle) => {
            try {                
                // get index of task we're removing
                const index = this.state.tasks.findIndex((el) => el._id.toString() === id);
                // update state 
                this.setState((state) => {
                    state.tasks[index].title=newTitle;
                    return {tasks:state.tasks}
                });
                // update server
                await mongoCol.updateOne(
                    {_id: new bson.ObjectId(id)},
                    {$set: {'title': newTitle}} // toggle true/false flag
                );
            } catch {
                console.log('Unable to update task.')
            }
        }
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
        const logIn = async (event,username,password) => {
            // prevent page refresh
            event.preventDefault();
            // validate inputs else showing loading indicator
            if (isInvalidUsername(username) || isInvalidPassword(password)) {
                this.setState({logInBanner: {show:true,msg:'Invalid username or password'}});
                return false;
            } else {
                this.setState({logInBanner: {show:true,msg:'Logging in...'}});
            }
            // Create an anonymous credential
            const credentials = Realm.Credentials.emailPassword(username, password);
            let user = null;
            try {
              // Authenticate the user
              user = await app.logIn(credentials);
              // update state to trigger page refresh
              this.setState({user:user});
              // reset any warnings messages
              this.setState({logInBanner:{show:false},signUpBanner:{show:false}})
            } catch {
                // trigger warning banner
                this.setState({logInBanner: {show:true,msg:'Login Failed'}});
            }
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
            } else {
                // if no user, then login failed
                this.setState({logInBanner: {show:true,msg:'Login Failed'}});
            }
        }
        const signUp = async (event,username,password) => {
            // stop page refresh
            event.preventDefault();
            // validate input else showing in progress indicator
            if (isInvalidPassword(password) || isInvalidUsername(username)) {
                this.setState({signUpBanner: {show:true,msg:'Invalid username or password'}});
                return false;
            } else {
                // in progress banner
                this.setState({signUpBanner: {show:true,msg:'Signing up...'}});
            }
            // server request to create user
            try {
                await app.emailPasswordAuth.registerUser(username,password);
                // show success banner
                this.setState({signUpBanner: {show:true,msg:'Successfully signed up! Please log in.'}});
            } catch {
                // show failure banner
                this.setState({signUpBanner: {show:true,msg:'Sign up failed.'}});
            }
        }
        const isInvalidUsername = (username) => {
            if (username !== '') return false; // is valid
            return true; // is not valid
        }
        const isInvalidPassword = (password) => {
            if (password.length >= 6) return false; // is valid
            return true; // is not valid
        }
        // if logged in
        if (this.state.user) {
            return (
                <div>
                    <NewTaskEntry addTask={addTask} addingTask={this.state.addingTask} />
                    <TaskList 
                        tasks={this.state.tasks}
                        deleteTask={deleteTask}
                        completeTask={completeTask}
                        loadingTasks={this.state.loadingTasks}
                        saveEditedTask={saveEditedTask}
                    />    
                <button onClick={() => logout()}>Log Out</button>
                </div>  
            );
        // if not logged in
        } else {
            return (
                <div>
                    <LogIn 
                        logInBanner={this.state.logInBanner} 
                        logIn={logIn} 
                    />
                    <SignUp 
                        signUp={signUp} 
                        signUpBanner={this.state.signUpBanner}
                    />
                </div>
                
            );
        }
    }
}
// Full task list (composed of many Task components)
class TaskList extends React.Component {
    render() {    
        let taskList = this.props.tasks.map((task,index) => {
            return(
                <Task 
                    key={task._id}
                    task={task}
                    deleteTask={this.props.deleteTask}
                    completeTask={this.props.completeTask}
                    saveEditedTask={this.props.saveEditedTask}
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
// Individual Task
class Task extends React.Component {
    constructor(props) {
        super();
        this.newTitle = React.createRef();
        this.state = {
            editMode:false
        }
    }
    render() {
        // simplify task ID
        const id=this.props.task._id.toString();
        // enable or disble editing mode
        const toggleEditMode = () => {
            this.setState({editMode:!this.state.editMode})
        }
        // wrapper that allows us to call server routine and update local state
        const saveEditedTaskWrapper = async (event,id,newTitle) => {
            // prevent page refresh
            event.preventDefault();
            // get value from ref
            newTitle = newTitle.current.value;
            // call server function in parent component (allows state to be updated)
            this.props.saveEditedTask(id,newTitle);
            // disable editing mode
            toggleEditMode();
        }
        if (this.state.editMode) {
            return (
                <li>
                    <form>
                        <input 
                            type="text"
                            defaultValue={this.props.task.title}
                            ref={this.newTitle}
                        />
                        <button onClick={(e) => saveEditedTaskWrapper(e,id,this.newTitle)}>Save</button>
                    </form>
                    <button onClick={() => this.props.deleteTask(id)}>Delete</button>
                </li>    
            );
        } else {
            return (
                <li>
                    {this.props.task.title}
                    <CompleteTaskButton 
                        complete={this.props.task.complete} 
                        id={id} 
                        completeTask={this.props.completeTask}
                    />
                    <button onClick={() => toggleEditMode()}>Edit</button>
                </li>
            );
        }  
    }
}
// Togglable task completion button
class CompleteTaskButton extends React.Component {
    render() {
        let buttonText = 'Complete';
        if (this.props.complete) buttonText='Uncomplete';
        return (    
            <button onClick={() => this.props.completeTask(this.props.id,this.props.complete)}>{buttonText}</button>
        )
    }
}
// new task entry form
class NewTaskEntry extends React.Component {
    constructor(props) {
        super();
        this.newTaskTitle = React.createRef();
    }
    render() { 
        return (
            <form id="newTaskEntry">
                <input 
                    placeholder="Type here..."
                    type="text" 
                    ref={this.newTaskTitle} 
                />
                <button onClick={(e) => this.props.addTask(e,this.newTaskTitle)}>Add Task</button>
                <Loader waitFlag={this.props.addingTask} msg='Adding Task...' />
            </form>
        );
    }
}
// Generic component to dsplay message while waiting for response from server
class Loader extends React.Component {
    render() {
        return (this.props.waitFlag) ? this.props.msg : false;
    }
}
// Log in screen
class LogIn extends React.Component {
    constructor(props) {
        super();
        // refs are eventually passed into logIn() function
        this.username = React.createRef();
        this.password = React.createRef();
    }
    render() {
        return (
            <form>
                <h1>Log In</h1>
                <p><Loader waitFlag={this.props.logInBanner.show} msg={this.props.logInBanner.msg} /></p>
                <input 
                    ref={this.username}
                    type="text" 
                    placeholder="Email"
                />
                <input 
                    ref={this.password}
                    type="password" 
                    placeholder="Password"
                />
                <button onClick={(e) => this.props.logIn(e,this.username.current.value,this.password.current.value)}>Log In</button>
            </form>
            
        )
    }
}

class SignUp extends React.Component {
    constructor(props) {
        super();
        // refs are eventually passed into signUp() function
        this.username = React.createRef();
        this.password = React.createRef();
    }
    render() {
        return (
            <form>
                <h1>Sign Up</h1>
                <p><Loader waitFlag={this.props.signUpBanner.show} msg={this.props.signUpBanner.msg} /></p>
                <input 
                    type="text"
                    placeholder="username"
                    ref={this.username}
                />
                <input 
                    type="password"
                    placeholder="password"
                    ref={this.password}
                />
                <button onClick={(e) => this.props.signUp(e,this.username.current.value,this.password.current.value)}>Sign Up</button>
            </form>
        )
    }
}

ReactDOM.render(<App />,document.getElementById('root'));