import React from 'react'

class TaskContent extends React.Component {
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
        return (
            <div className={'content'}>
                <h1 className={'title'}>{this.props.title}</h1>
                <h2 className={'dueDate'}>{this.formatDate(this.props.dueDate)}</h2>
            </div>
        );
    }
}

export default TaskContent;