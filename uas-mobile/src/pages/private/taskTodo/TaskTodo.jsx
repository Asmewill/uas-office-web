/**
 * Created by hujs on 2020/12/02
 * Desc: 待办列表
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import './task-todo.less'
import TaskTodoItem from '../../../components/private/tasktodo/TaskTodoItem'
import { isObjEmpty } from '../../../utils/common/common.util'
import { message } from 'antd'
import { Toast, SearchBar, PullToRefresh } from 'antd-mobile'
import { fetchPostObj, fetchGet } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'

class TaskTodo extends Component {

  constructor () {
    super()

    this.state = {
      data: undefined,
      searchValue: '',
      refreshing: false,
      height: document.documentElement.clientHeight,
    }
  }

  componentDidMount () {
    document.title = '待办任务'
    this.getListData()
    setTimeout(() => {
      if (this.props.height) {
        this.setState({
          height: this.props.height,
        })
      } else {
        const hei = this.state.height -
          ReactDOM.findDOMNode(this.ptr).getBoundingClientRect().top
        this.setState({
          height: hei,
        })
      }
    }, 0)
  }

  componentWillUnmount () {

  }

  render () {
    let { data, height, searchValue } = this.state

    return (
      <div className="task-todo-page">
        <SearchBar placeholder='搜索'
                   onSubmit={value => this.onSubmit(value)}
                   onCancel={this.onCancel}
                   onChange={this.onSearchChange}
                   value={searchValue}
        />

        <PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.refreshFunc}
          className='report-func-root'
          ref={el => this.ptr = el}
          style={{
            height: height,
            overflow: 'auto',
          }}
        >
          <TaskTodoItem rowList={data}/>
        </PullToRefresh>

      </div>
    )
  }

  getListData = () => {
    Toast.loading('正在获取数据', 0)
    fetchGet(API.APPCOMMON_TASKTODO)
      .then(response => {
        Toast.hide()
        this.setState({
          data: response.data.list,
          searchData: response.data.list,
          refreshing: false,
        })
      }).catch(error => {
      Toast.hide()
      this.setState({
        refreshing: false,
      })
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('待办事项获取失败')
      }
    })
  }

  //下拉刷新
  refreshFunc = () => {
    this.setState({
      refreshing: true,
    })
    this.getListData()
  }

  //回车搜索事件
  onSubmit = (val) => {
    let { searchData } = this.state
    let dataSource = []
    searchData.forEach((item, index) => {
      if (item.RA_TASKNAME.indexOf(val) > -1) {
        dataSource.push(item)
      }
    })
    this.setState({
      data: dataSource,
    })
  }

  onSearchChange = (val) => {
    this.setState({
      searchValue: val,
    })
  }

  onCancel = () => {
    this.getListData()
    this.setState({
      searchValue: '',
    })
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(TaskTodo)
