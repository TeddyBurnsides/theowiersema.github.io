import React from 'react'

class TaskTitle extends React.Component {
    
    render() {
        return (
            <div className={'title'}>{this.props.title}</div>
        );
    }
}

export default TaskTitle;