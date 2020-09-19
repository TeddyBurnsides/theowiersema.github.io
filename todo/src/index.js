import React from 'react';
import ReactDOM from 'react-dom';
import * as Realm from "realm-web";

// Connection
const app = new Realm.App({ id: "todo-app-mnupq", timeout: 10000 });
const mongo = app.services.mongodb('mongodb-atlas');
const mongoCol = mongo.db('data').collection('tasks');

const App = () => {
    const addTask = async () => {
        const newTask = {
            title: 'Testing my boy',
            status: true
        }
        try {
            await mongoCol.insertOne(newTask);
            this.setState({toggle:!this.state.toggle})
        } catch {
            console.log('Adding task failed!');
        }
    }
    const [user, setUser] = React.useState(app.currentUser);
    if (user) {
        return (
            <div>
                <Admin user={user} setUser={setUser} />
                <Tasks />
            </div>  
        )
    } else {
        return (
            <LoginButton setUser={setUser} />
        )
    }
}

class Tasks extends React.Component {
    constructor(props) {
        super();
        this.state = {tasks:[]};
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
    render() {
        const taskList = this.state.tasks.map((task,index) => {
            return(
                <Task key={index} title={task.title} />
            );
        });
        return (
            <ul>{taskList}</ul>
        );
    }
}

class Task extends React.Component {
    render() {
        return (
            <li>{this.props.title}</li>
        );
    }
}

class Admin extends React.Component {
    constructor(props) {
        super();
        this.state = {toggle:false};
    }
    render() {
        const logout = async () => {
            try {
                await app.currentUser.logOut().then(this.props.setUser());
            } catch {
                console.log('Unable to Log out');
            }
            
        }
        const addTask = async () => {
            const newTask = {
                title: 'Testing my boy',
                status: true
            }
            try {
                await mongoCol.insertOne(newTask);
                this.setState({toggle:!this.state.toggle})
            } catch {
                console.log('Adding task failed!');
            }
        }
    
    return (
        <div>
            <h1>{this.props.user.id}</h1>
            <button onClick={() => addTask()}>Add Task</button>
            <button onClick={() => this.logout}>Log Out</button>
        </div>
    )
}
}

const LoginButton = ({setUser}) => {
    const loginAnonymous = async () => {
        const user = await app.logIn(Realm.Credentials.anonymous());
        setUser(user);
    };
    return <button onClick={loginAnonymous}>Log In</button>
}

ReactDOM.render(<App />,document.getElementById('root'));