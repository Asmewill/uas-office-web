/**
 * Created by Hujs on 2020/1204
 * Desc: 待办事项row
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './task-todo-item.less'

class TaskTodoRow extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { rowObj: { RA_TASKNAME, PRJNAME, STATUS, STATDATE, RA_ID, RA_TYPE, RECORDER } } = this.props
    return (
      <div className="tasktodo-list-item-root" onClick={this.onItemClick.bind(this, RA_ID, RA_TYPE)}>
        <div className="task-des-item">
          <div className="task-item-caption">任务详情</div>
          <div className="task-item-value">{RA_TASKNAME}</div>
        </div>
        <div className="task-des-item">
          <div className="task-item-caption">发起人</div>
          <div className="task-item-value">{RECORDER}</div>
        </div>
        {
          RA_TYPE == 'projecttask' ?
            (
              <div className="task-des-item">
                <div className="task-item-caption">项目名称</div>
                <div className="task-item-value">{PRJNAME}</div>
              </div>
            ) : (
              null
            )
        }
        <div className="task-des-item">
          <div className="task-item-caption">发起时间</div>
          <div className="task-item-value">{STATDATE}</div>
        </div>
        <div className="task-des-item">
          <div className="task-item-caption">单据状态</div>
          <div className="task-item-value">{STATUS}</div>
        </div>
      </div>
    )
  }

  onItemClick = (ra_id, type) => {
    if (type == 'billtask') {
      this.props.history.push('/dailyTask/' + type + '/' + ra_id)
    } else if (type == 'projecttask') {
      this.props.history.push('/projectTask/' + type + '/' + ra_id)
    }

  }

}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(withRouter(TaskTodoRow))
