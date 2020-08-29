import React from 'react';
import TaskTitle from './TaskTitle';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

class Task extends React.Component {
    extractDateElements(date) {
        date=date.split('-');
        const year=date[0];
        const month=date[1];
        const day=date[2];
        return {year,month,day}
    }
    formatDate(date) {
        if (date==="") return "no due date";
        const datePieces = this.extractDateElements(date);
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthName[parseInt(datePieces.month)-1] + " " + datePieces.day + ", " + datePieces.year;
    }
    render() {
        // toggle text for completion buttone
        let completeButtonVal;
        this.props.status ? completeButtonVal = 'Undo' : completeButtonVal = 'Complete';

        return (
            <div className={'task ' + this.props.status}>
          
                <TaskTitle title={this.props.title} />

                <div className={'dueDate'}>{this.formatDate(this.props.dueDate)}</div>

                <button 
                    onClick={event => this.props.editTask(event,this.props.index)}
                    className={'edit'}>Edit</button>

                <button 
                    onClick={event => this.props.deleteTask(event,this.props.index)} 
                    className={'delete'}>Delete</button>

                <button 
                    onClick={event => this.props.toggleTask(event,this.props.index)} 
                    className={'complete'}>{completeButtonVal}</button>

                <button className={'dragger'}> = </button>
           
            </div>
        )
    }
}

export default Task;