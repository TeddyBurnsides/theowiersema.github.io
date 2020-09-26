import React from 'react';
import ReactDOM from 'react-dom';
import * as Realm from 'realm-web';

const bson = require('bson');


// Connection
const app = new Realm.App({ id: "todo-app-mnupq", timeout: 10000 });
const mongoCol = app.services.mongodb('mongodb-atlas').db('data').collection('tasks');

class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
            user:app.currentUser,
            toggle:false,
        }
    }
    render() {
        const addTask = async () => {
            const newTask = {
                title: 'SOS',
                status: true
            }
            try {
                await mongoCol.insertOne(newTask);
                this.setState({toggle:!this.state.toggle})
            } catch {
                console.log('Adding task failed!');
            }
        }
        const logout = async () => {
            try {
                await app.currentUser.logOut().then(this.setState({user:''}));
            } catch {
                console.log('Unable to Log out');
            }
            
        }
        const deleteTask = async (id) => {
            try {
                const o_id = new bson.ObjectId(id);
                const found = await mongoCol.deleteOne({_id:o_id});
                console.log(found);
            } catch {
                console.log('Unable to delete Task.')
            }
        }
        const deleteAllTasks = async () => {
            try {
                const allTasks = {
                    status: true
                }
                await mongoCol.deleteMany(allTasks);
            } catch {
                console.log('Unable to delete all tasks!')
            }
        }
        const login = async () => {
            const user = await app.logIn(Realm.Credentials.anonymous());
            this.setState({user:user});
        };
        if (this.state.user) {
            return (
                <div>
                    <NewTaskButton addTask={addTask} />
                    <LogOutButton logout={logout} />
                    <DeleteAllButton deleteAllTasks={deleteAllTasks} />
                    <TaskList deleteTask={deleteTask} toggle={this.state.toggle} />
                    
                </div>  
            )
        } else {
            return (
                <LogInButton login={login} />
            )
        }
    }
}

class TaskList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tasks:[],
            toggle:props.toggle
        };
        
    }
    componentDidMount() {
        const getTasks = async () => {
            try {
                const tasks = await mongoCol.find();
                this.setState({tasks:tasks})
            } catch {
                return 'Failed to retrieve tasks';
            }
        }
        getTasks();
        
    }  
    componentDidUpdate(prevProps) {
        if (this.props.toggle !== prevProps.toggle) {
            this.setState({
                toggle:this.props.toggle
            })
            const getTasks = async () => {
                try {
                    const tasks = await mongoCol.find();
                    this.setState({tasks:tasks})
                } catch {
                    return 'Failed to retrieve tasks';
                }
            }
            getTasks();
        }
    }
    render() {    
        let taskList = this.state.tasks.map((task,index) => {
            return(
                <Task 
                    key={task._id} 
                    id ={task._id.toString()} 
                    title={task.title} 
                    deleteTask={this.props.deleteTask}
                />
            );
        }).reverse();
        if (taskList.length === 0) {
            return <p>Loading...</p>
        } else {
            return <ul>{taskList}</ul>
        }
    }
}

class Task extends React.Component {
    render() {
        return (
            <li>
                {this.props.title}
                <DeleteTaskButton 
                    id={this.props.id} 
                    deleteTask={this.props.deleteTask}
                />
            </li>
        );
    }
}

class DeleteTaskButton extends React.Component {
    render() {
        return <button onClick={() => this.props.deleteTask(this.props.id)}>Delete Task</button>
    }
}

class NewTaskButton extends React.Component {
    render() { 
        return <button onClick={() => this.props.addTask()}>Add Task</button>
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