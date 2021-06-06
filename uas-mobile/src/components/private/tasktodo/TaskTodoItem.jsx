/**
 * Created by Hujs on 2020/1204
 * Desc: 待办事项item
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isObjEmpty } from '../../../utils/common/common.util'
import TaskTodoRow from './TaskTodoRow'
import { Empty } from 'antd'

class TaskTodoItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { rowList } = this.props
    const rowItems = []
    if (!isObjEmpty(rowList)) {
      rowList.forEach((item, index) => {
        rowItems.push(<TaskTodoRow rowObj={item} key={index}/>)
      })
    } else if (rowList != undefined && rowList.length == 0) {
      rowItems.push(
        this.getNoneElement(),
      )
    }

    return (
      <div style={{ background: '#f5f5f9' }}>
        {
          rowItems
        }
      </div>
    )
  }

  getNoneElement = () => {
    return (
      <Empty key='empty-box' image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    )
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(TaskTodoItem)
