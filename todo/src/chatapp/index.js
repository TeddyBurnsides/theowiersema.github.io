import React from 'react';
import ReactDOM from 'react-dom';
import {Sidebar} from './sidebar'
import './styles.css'

/* STRUCTURE

Blog
    Header
    Messages
        Message
        Message
        Message
    WriteMessage
    Sidebar
        OnlineUsers
            User
            User
            User

*/

class ChatApp extends React.Component {
    constructor(props) {
        super(props);

        // allow this for sendMsg()
        this.sendMsg = this.sendMsg.bind(this);
        // create ref for text field to get current value later
        this.textInput = React.createRef();
        // allow users to update the user they are chatting with
        this.updateName = this.updateName.bind(this)
        // ref for current user name
        this.newName = React.createRef();
        // allow updating target user
        this.updateTargetUser = this.updateTargetUser.bind(this);

        // build two conversations for testing
        
        let conversations = new Map();
        /*
        this.state = {
            currentConversationID:null,
            conversations:conversations,
            userInfo:null,
           }
        */
        let data={
            targetUser: 'lindabillings',
            sourceUser: 'theodore',
            messages: [
                {
                    content: 'This is decent sized post',
                    timestamp: '1/30/20 2:01pm',
                    authorID:'theodore',
                },{
                    content: 'adipiscing elit, et dolore magna aliqua',
                    timestamp: '1/30/20 2:10pm',
                    authorID:'lindabillings'
                },{
                    content: 'This is more content from yours truly',
                    timestamp: '1/30/20 2:15pm',
                    authorID:'theodore',
                },
            ]
        };
        conversations.set(100,data);
        data={
            targetUser:'jillybeans',
            sourceUser:'theodore',
            messages: [
                {
                    content: 'Random content',
                    timestamp: '1/30/20 2:20pm',
                    authorID:'theodore',
                },{
                    content: 'magna aliqua',
                    timestamp: '1/30/20 2:10pm',
                    authorID:'jillybeans'
                },{
                    content: 'Short and sweet',
                    timestamp: '1/30/20 2:15pm',
                    authorID:'theodore',
                },
            ]
        };
        conversations.set(101,data);

        // define existing conversations, and current conversation
        this.state = {
            currentConversationID:100,
            conversations:conversations,
        }
        
       
    
    }
    
    /*
    Send message typed into the input field
    */
    sendMsg(event) {

        // stop page from refreshing
        event.preventDefault();   
        
        // don't post message unless it contains content
        const content=this.textInput.current.value
        if (content==='') return false;

        // define conversation information
        const currentConvoId=this.state.currentConversationID
        const currentConversation=this.state.conversations.get(currentConvoId);

        // build new message
        const newMessage = {
            content:content,
            timestamp:new Date().toLocaleString(),
            authorID:currentConversation.sourceUser,
        }
        currentConversation.messages.push(newMessage);

        // update state with new post (HOW DOES THIS WORK!?)
        this.setState({});

        // clear input filed
        document.getElementById('chatForm').reset(); 
    }
    
    /*
    Update your own username
    */
    updateName(event) {

        // stop page from refreshing
        event.preventDefault();

        // don't update name if empty
        const newName=this.newName.current.value;
        if (newName === '') return false;

        // don't update if only spaces (and reset field)
        if (!newName.replace(/\s/g, '').length) {
            // clear input field
            document.getElementById('whoami').reset(); 
            // remove focus from field
            document.activeElement.blur();
            return false;
        }
        
        // update state
        this.setState({
            userInfo:newName,
        });

        // clear input field
        document.getElementById('whoami').reset(); 
        // remove focus from field
        document.activeElement.blur();
    }
    // update chat user
    updateTargetUser(user) {
        //this.setState({targetUser: user});

        this.setState(prevState => ({
            targetUser: {
                ...prevState.targetUser,
                displayName:user
            }
        }));
    } 
    render() {

        // set up some conversation variables
        if (1===1) {
            const conversationID=this.state.currentConversationID;
            const conversationData=this.state.conversations.get(conversationID);
            
            return (
                <div id="wrapper">
                    <Sidebar
                        conversationData={conversationData}
                        userInfo={this.state.userInfo}
                        newName={this.newName}
                        updateName={this.updateName}
                        updateTargetUser={this.updateTargetUser}
                    />
                    <div id="chatBox">
                        <Header 
                            conversationData={conversationData} 
                            userInfo={this.state.userInfo}
                        />
                        <Messages conversationData={conversationData} />
                        <WriteMessage 
                            conversationData={conversationData}
                            sendMsg={this.sendMsg} 
                            textInput={this.textInput} 
                        />
                    </div>
                    <div className={'clear'}></div>
                </div>
            );
        } else {
            return (
                <h1>No messages</h1>
            )
        }
    }
}

/*
Message List: contains all individual messages and auto scrolls to newest message
*/
class Messages extends React.Component {

    // After DOM has fully rendered with new post, scroll down to bottom
    componentDidUpdate(prevProps) {
        // only trigger if we're actually adding a new message
        console.log(prevProps.converationData);
        console.log(this.props.conversationData);
        //if (prevProps.conversationData !== this.props.conversationData) {
            this.msgEnd.scrollIntoView({behavior: 'smooth'});
        //}
        
    }

    render() {

        if (this.props.conversationData) {
            // build array of individual messages
            const messageList = this.props.conversationData.messages.map((msg,index) => {
                return (
                    <Message 
                        content={msg.content}
                        timestamp={msg.timestamp} 
                        key={index} 
                        author={msg.authorID}
                        sourceUser={this.props.conversationData.sourceUser}
                    />
                );
            });

            return (
                <div id="list">
                    {messageList}
                    <div id="msgEnd" ref={(el) => { this.msgEnd = el; }}></div>
                </div>
            );
        } else {
            return (
                <div id="list"></div>
            );
        }
    }
}

/*
Individual Message: builds information about each msg bubble and its meta information
*/
class Message extends React.Component {
    render() {

        // variables determine how we should style the msg boxes
        const author=this.props.author;
        const sourceUser=this.props.sourceUser;

        return (
            <div className={author===sourceUser ? 'postWrapper' : 'postWrapper targetUser'}>
                <div className={'post'}>
                    <div>{this.props.content}</div>
                    <br />
                    <small>{this.props.author} at {this.props.timestamp}</small>
                </div>
                <div className={'clear'}></div>
            </div>
        );
    }
}

/*
Chat Box Header: Displays name of user you are chatting with
*/
class Header extends React.Component {
    render() {
        // if a conversation is open show a different header
        if (this.props.conversationData) {
            const targetUser=this.props.conversationData.targetUser;
            return (
                <div id="header">
                    <h1>Conversation with <span>{targetUser}</span></h1>
                    <div className={'clear'}></div>
                </div>
            );
        } else if (this.props.userInfo == null) {
            return (
                <div id="header">
                    <h1>Enter your username to begin</h1>
                    <div className={'clear'}></div>
                </div>
            );
        } else {
            return (
                <div id="header">
                    <h1>Select a user to chat with</h1>
                    <div className={'clear'}></div>
                </div>
            );
        }
        
    }
}

/*
Creates input field for user to write new messages (send button hidden but functional)
*/
class WriteMessage extends React.Component {
    render() {
        if (this.props.conversationData) {
            return (
                <form id="chatForm">
                    <input id="msg" placeholder="Type message here..." type="text" ref={this.props.textInput} />
                    <button id="send" onClick={event => this.props.sendMsg(event)}>Send</button>
                </form>
            );
        } else {
            return (
                <form id="chatForm"></form>
            );
        }
    }
}



ReactDOM.render(<ChatApp />,document.getElementById('root'));