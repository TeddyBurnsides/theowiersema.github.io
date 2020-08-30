import React from 'react';

class NewTaskEntry extends React.Component {
    // returns today's date in YYYY-MM-DD format
    today() {
        const now = new Date();
        const day = now.getDate();
        const year = now.getFullYear();
        const month = this.pad(now.getMonth()+1,2); 
        console.log(month+"-"+day+"-"+year)
        return year+"-"+month+"-"+day;
    }
    pad(n,width,z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    render() {
        return (
            <form id="newTaskEntry">
                <input placeholder="Type new task..." type="text" ref={this.props.taskInput} />
                <input defaultValue={this.today()} type="date" ref={this.props.dateInput} />
                <button onClick={event => this.props.submitTask(event)}>Add</button>
                <div className={'clear'}></div>
            </form>
        )
    }
}

export default NewTaskEntry;