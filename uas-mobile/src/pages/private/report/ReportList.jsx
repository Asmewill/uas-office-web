/**
 * Created by RaoMeng on 2020/12/9
 * Desc:报表列表
 */
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyList from '../../../components/common/currencyList/CurrencyList'
import { API } from '../../../configs/api.config'
import { Drawer } from 'antd-mobile'
import CurrencyListItem
  from '../../../components/common/currencyList/CurrencyListItem'
import './report.less'

class ReportList extends Component {

  constructor () {
    super()

    this.state = {
      detailOpen: false,
      detailData: [],
    }
  }

  componentDidMount () {
    this.title = this.props.match.params.title
    document.title = this.title || '单据列表'
  }

  componentWillUnmount () {

  }

  render () {
    const { detailOpen } = this.state

    const detailLayout = this.getDetailLayout()
    return (
      <div>
        <Drawer
          sidebar={detailLayout}
          onOpenChange={this.onFilterOpen}
          open={detailOpen}
          position={'bottom'}
          onOpenChange={this.onOpenChange}
        />
        <CurrencyList
          rowCount={5}
          listUrl={API.REPORT_GETREPORTLIST}
          searchUrl={API.REPORT_GETORDERSEARCHFORM}
          handlePrompt={this.handlePrompt.bind(this)}
          onItemClick={this.onItemClick.bind(this)}
          filterAble
          params={{
            caller: this.props.match.params.caller,
            id: this.props.match.params.id,
          }}
          addAble={false}
        >
          <div></div>
        </CurrencyList>
      </div>
    )
  }

  /**
   * 详情布局
   */
  getDetailLayout = () => {
    const { detailData } = this.state
    return (
      <div
        className='report-detail-root'>
        <div className='report-detail-title'>
          报表详情
        </div>
        <div
          ref={el => {this.dl = el}}
          className='report-detail-content'>
          <CurrencyListItem
            rowData={detailData}/>
        </div>
      </div>
    )
  }

  /**
   * 列表点击事件
   */
  onItemClick = (rowData) => {
    if (rowData.rowList && rowData.rowList.length > 5) {
      ReactDOM.findDOMNode(this.dl).scrollTop = 0
      this.setState({
        detailOpen: true,
        detailData: rowData,
      })
    }
  }

  onOpenChange = () => {
    this.setState({ detailOpen: !this.state.detailOpen })
  }

  handlePrompt = (location) => {
    if (this.state.detailOpen) {
      this.setState({
        detailOpen: !this.state.detailOpen,
      })
      return false
    } else {
      return true
    }
  }
}

let mapStateToProps = (state) => ({
  listState: state.listState,
})

export default connect(mapStateToProps)(ReportList)
