import React from 'react';
 export class Sidebar extends React.Component {
    render() {
        
        let sourceUser;
        this.props.userInfo ? sourceUser=this.props.userInfo : sourceUser=null;
        
        return (
            <div id="sidebar">
                <div>
                    <form id="whoami">
                        <label>My Name</label>
                        <input 
                            id="currentUserField"
                            type="text" 
                            ref={this.props.newName} 
                            placeholder={sourceUser} 
                        />
                        <button onClick={this.props.updateName}>✓</button>
                    </form>
                </div>
                <OnlineUsers updateTargetUser={this.props.updateTargetUser} />
            </div>
        );
    }
}

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [
                {
                    id:3,
                    displayName: 'Linda Billingham',
                    isActive: true
                },{
                    id:4,
                    displayName: 'Not Linda',
                    isActive: true
                },{
                    id:5,
                    displayName: 'Bobby Drop Tables',
                    isActive: false
                },{
                    id:6,
                    displayName: 'Jimmy Bean Beans at your service',
                    isActive: false
                },{
                    id:7,
                    displayName: 'Bobby Drop Tables',
                    isActive: false
                }
            ]
        }
    }
    render() {
        // generate <li> tags for each online user
        const userList = this.state.users.map((user,index) => {
            return (
                <User 
                    key={index} 
                    name={user.displayName} 
                    isActive={user.isActive} 
                    updateTargetUser={this.props.updateTargetUser}
                />
            );
        });
        return (
            <div id="listofUsers">
                <label>Other Users</label>
                <ul>{userList}</ul>
            </div>
        );
    }
}

class User extends React.Component {
    render() {
        const user = this.props.name;
        const isActive = this.props.isActive;
        if (isActive) {
            return (
                <li onClick={() => this.props.updateTargetUser(user)} className={'active'}>
                    {user}
                </li>
            );
        } else {
            return (
                <li>{user}</li>
            );
        }
        
    }
}