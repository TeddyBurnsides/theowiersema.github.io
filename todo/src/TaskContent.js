import React from 'react'
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

class TaskContent extends React.Component {
    // today in YYYY-MM-DD
    today(dayOffset) {
        if (dayOffset == null) dayOffset = 0;
        const now = new Date();
        const day = this.pad(now.getDate()+dayOffset,2); // always have two digits
        const year = now.getFullYear();
        const month = this.pad(now.getMonth()+1,2);  // always have two digits
        return year+"-"+month+"-"+day; // YYYY-MM-DD
    }
    // returns object
    extractDateElements(date) {
        date=date.split('-');
        const year=date[0];
        const month=date[1];
        const day=date[2];
        return {year,month,day}
    }
    // December 9, 2019
    prettifyDate(date) { // date is in format YYYY-MM-DD or YYYY-M-D
        if (date==="") return false;
        if (date == this.today()) return 'Today';
        if (date == this.today(1)) return 'Tomorrow';
        const datePieces = this.extractDateElements(date);
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthName[parseInt(datePieces.month)-1].substring(0,3) + " " + datePieces.day;
    }
    // YYYY-MM-DD
    standardizeDate(date) {
        const datePieces = this.extractDateElements(date);
        return this.pad(datePieces.year,4) + '-' + this.pad(datePieces.month,2) + '-' + this.pad(datePieces.day,2)
    }
    pad(n,width,z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    toEditOrNotToEdit() {
        const editModeOn=this.props.editModeOn;
        // when single task is open
        if (editModeOn) {
            return (
                <form>
                    <input type="text" defaultValue={this.props.title} ref={this.props.newTaskTitle} />   
                    <input type="date" defaultValue={this.standardizeDate(this.props.dueDate)} ref={this.props.newDueDate} />
                    <button className={'edit'} onClick={event => this.props.editTask(event,this.props.index)}>
                        <Link to='/'>Save</Link>
                    </button>
                    <div className={'clear'}></div>
                </form>
            );
        // displayed in task list
        } else {
            return (
                <div>
                    <h1 className={'title'}><span>{this.props.title}</span></h1>
                    <h2 className={'dueDate'}>{this.prettifyDate(this.props.dueDate)}</h2>
                </div>
                
            );
        }
    };

    render() {
        return (
            <div className={'content'}>
                {this.toEditOrNotToEdit()}
            </div>
        );
    }
}

export default TaskContent;