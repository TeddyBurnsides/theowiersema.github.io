import React from 'react';

class NewTaskEntry extends React.Component {
    render() {
        return (
            <form id="newTaskEntry">
                <input placeholder="Type new task..." type="text" ref={this.props.taskInput} />
                <input type="date" ref={this.props.dateInput} />
                <button onClick={event => this.props.submitTask(event)}>Add</button>
            </form>
        )
    }
}

export default NewTaskEntry;