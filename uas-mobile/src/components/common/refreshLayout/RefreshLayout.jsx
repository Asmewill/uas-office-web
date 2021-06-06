/**
 * Created by RaoMeng on 2018/12/1
 * Desc: antd刷新组件二次封装
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { PullToRefresh } from 'antd-mobile'
import PropTypes from 'prop-types'

export default class RefreshLayout extends Component {

  static propTypes = {
    direction: PropTypes.string,//刷新方向：up或down,默认up
    refreshing: PropTypes.bool.isRequired,//是否正在刷新
    style: PropTypes.object,//样式，有默认样式一般可以不传
    onRefresh: PropTypes.func.isRequired,//加载方法，必传
    damping: PropTypes.number,//加载距离，不用传
    distanceToRefresh: PropTypes.number,//可拉动距离，不用传
    height: PropTypes.number,//组件高度，一般不用传
  }

  static defaultProps = {
    direction: 'up',
    damping: 120,
    distanceToRefresh: 50,
  }

  constructor () {
    super()

    this.state = {
      height: document.documentElement.clientHeight,
    }
  }

  componentDidMount () {
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

  render () {
    const { height } = this.state
    const { direction, refreshing, style, onRefresh, damping, distanceToRefresh } = this.props

    return (
      <PullToRefresh
        direction={direction}
        refreshing={refreshing}
        ref={el => this.ptr = el}
        style={{
          height: height,
          overflow: 'auto',
          ...style,
        }}
        damping={damping}
        distanceToRefresh={distanceToRefresh}
        onRefresh={onRefresh}>
        {this.props.children}
      </PullToRefresh>
    )
  }
}
