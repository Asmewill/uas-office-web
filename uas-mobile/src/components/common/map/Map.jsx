/**
 * Created by hujs on 2020/11/31
 * Desc: 百度地图
 */

import React, { Component } from 'react'
import './map.less'

export default class Map extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    const { BMap } = window
    let { longitude, latitude } = this.props
    var map = new BMap.Map('mymap') // 创建Map实例
    var point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 18) // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity('深圳') // 设置地图显示的城市
    map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
    var marker = new BMap.Marker(point)        // 创建标注
    map.addOverlay(marker)  //标点

  }

  componentWillUnmount () {

  }

  render () {

    return (
      <div className="map-box">
        <div className="map-content" id="mymap"></div>
      </div>
    )
  }

}
