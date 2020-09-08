import React from 'react';

class TaskInput extends React.Component {
    // returns today's date in YYYY-MM-DD format
    today() {
        const now = new Date();
        const day = this.pad(now.getDate(),2); // always have two digits
        const year = now.getFullYear();
        const month = this.pad(now.getMonth()+1,2);  // always have two digits
        return year+"-"+month+"-"+day; // YYYY-MM-DD
    }
    pad(n,width,z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    render() {
        return (      
            <form id="newTaskEntry">
                <div className={'wrapper'}>
                    <input placeholder="Type new task..." type="text" ref={this.props.newTaskTitle} />
                    <input defaultValue={this.today()} type="date" ref={this.props.newTaskDate} />
                    <button onClick={event => this.props.submitTask(event)}>Add</button>
                    <div className={'clear'}></div>
                </div>
            </form>
        )
    }
}

export default TaskInput;