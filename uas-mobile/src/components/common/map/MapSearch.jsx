/**
 * Created by RaoMeng on 2021/4/15
 * Desc: 地图-带搜索功能
 */

import React, { Component } from 'react'
import {
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
  OverviewMapControl,
} from 'react-bmap'
import './map.less'
import { SearchBar } from 'antd-mobile'
import { getLocalPosition } from '../../../utils/common/map.util'

export default class MapSearch extends Component {

  constructor () {
    super()

    this.state = {
      center: { lng: 113.887564, lat: 22.554923 },//初始化地址为海纳百川大厦B座
      searchList: [],
    }
  }

  componentDidMount () {
    document.title = '地图搜索'
    this.searchBar.focus()
    const { BMap } = window
    let that = this
    this.localSearch = new BMap.LocalSearch(this.map,
      {
        renderOptions: {
          map: this.map,
        },
        onSearchComplete: (results) => {
          if (results) {
            that.setState({
              searchList: results.Br,
            })
          } else {
            that.setState({
              searchList: [],
            })
          }
        },
      })
    this.localSearch.disableFirstResultSelection()

    getLocalPosition(this.map)
  }

  componentWillUnmount () {

  }

  render () {
    const {
      center,
      searchList,
    } = this.state

    const searchItems = []
    if (searchList) {
      searchList.forEach((item, index) => {
        searchItems.push(
          <div
            className='map-search-item'
            onClick={this.onItemClick.bind(this, index)}>
            <div className='map-search-item-name'>{item.title}</div>
            <div className='map-search-item-address'>{item.address}</div>
          </div>,
        )
      })
    }
    return (
      <div
        className='map-search-root'>
        <SearchBar
          ref={el => this.searchBar = el}
          onChange={this.onSearchChange}
          placeholder={'搜索'}/>
        <Map
          ref={ref => {
            if (ref) {
              this.map = ref.map
            }
          }}
          style={{ height: '240px' }}
          center={center}
          enableScrollWheelZoom
          enableDragging
          enableRotate
          enableScrollWheelZoom
          zoom="17"
        >
          <Marker position={center}/>
          <NavigationControl/>
          <ScaleControl/>
          <OverviewMapControl/>
        </Map>
        <div
          className='map-search-result-list'>
          {searchItems}
        </div>
      </div>
    )
  }

  /**
   * 地图搜索
   * @param value
   */
  onSearchChange = value => {
    if (value) {
      if (this.localSearch) {
        this.localSearch.search(value)
      }
    } else {
      this.localSearch.search('')
      getLocalPosition(this.map)
    }
  }

  /**
   * 搜索结果 选择事件回调
   * @param index
   */
  onItemClick = index => {
    const { searchList } = this.state
    const { onLocationSelect } = this.props
    onLocationSelect && onLocationSelect(searchList[index])
  }
}
