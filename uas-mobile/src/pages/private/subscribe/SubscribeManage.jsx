/**
 * Created by RaoMeng on 2020/11/11
 * Desc: 订阅管理
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Swiper from 'swiper/js/swiper.min'
import 'swiper/css/swiper.min.css'
import './subscribe.less'
import { saveListState } from '../../../redux/actions/listState'
import SubscribeNot from './SubscribeNot'
import SubscribeAlready from './SubscribeAlready'

class SubscribeManage extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = '订阅管理'
    this.initSwiper()
  }

  initSwiper () {
    let that = this
    const { listState } = this.props
    this.mySwiper = new Swiper('.swiper-container', {
      autoplay: false,
      loop: false,
      noSwiping: true,
      initialSlide: listState.tabIndex,
      on: {
        slideChangeTransitionEnd: function () {
          saveListState({
            tabIndex: this.activeIndex,
          })
          if (this.activeIndex == 0) {
            // that.refreshTodoList()
          } else {
            // that.refreshDoneList()
          }
        },
      },
    })
  }

  componentWillUnmount () {

  }

  render () {
    const { listState: { tabIndex } } = this.props

    return (
      <div className='subscribe-manage-root'>
        <div className='subscribe-manage-tab'>
          <div className={tabIndex === 0 ?
            'subscribe-manage-item-select' : 'subscribe-manage-item-normal'}
               onClick={this.onNotTabClick}>未订阅
          </div>
          <div className={tabIndex === 1 ?
            'subscribe-manage-item-select' : 'subscribe-manage-item-normal'}
               onClick={this.onAlreadyTabClick}>已订阅
          </div>
        </div>
        <div className="swiper-container"
             ref={el => {
               this.contain = el
             }}>
          <div className="swiper-wrapper">
            <div className="swiper-slide swiper-no-swiping">
              <SubscribeNot/>
            </div>
            <div className="swiper-slide swiper-no-swiping">
              <SubscribeAlready/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * 未订阅标签点击事件
   */
  onNotTabClick = () => {
    const { listState: { tabIndex } } = this.props

    if (tabIndex === 0) {

    } else {
      saveListState({
        tabIndex: 0,
      })
      this.mySwiper.slideTo(0, 300, false)
    }
  }

  /**
   * 已订阅标签点击事件
   */
  onAlreadyTabClick = () => {
    const { listState: { tabIndex } } = this.props

    if (tabIndex === 1) {

    } else {
      saveListState({
        tabIndex: 1,
      })
      this.mySwiper.slideTo(1, 300, false)
    }
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
})

export default connect(mapStateToProps)(SubscribeManage)
