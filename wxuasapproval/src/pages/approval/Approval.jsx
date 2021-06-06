import React, { Component } from 'react'
import './approval.css'
import '../../index.css'
import { Icon, TextArea } from 'semantic-ui-react'
import PointsItem from '@/components/pointsItem/PointsItem'
import TableItem from '@/components/tableItem/TableItem'
import ApprovalNode from '@/components/approvalNode/ApprovalNode'
import { Avatar, message, Popover, Spin } from 'antd'
import ApprovalBean from '../../model/ApprovalBean'
import ApprovalRecordBean from '@/model/ApprovalRecordBean'
import { ListView, Modal, SearchBar, Toast, List } from 'antd-mobile'
import { fetchGet, fetchPost } from '../../utils/fetchRequest'
import { connect } from 'react-redux'
import {
  getArrayValue,
  getBracketStr,
  getIntValue,
  getObjValue,
  getParenthesesStr,
  getStrValue,
  getTimeValue,
  isEmptyObject,
  isObjEmpty,
  isObjNull,
  MapToJson,
  strMapToObj,
  strContain,
} from '@/utils/common'
// import FileViewer from 'react-file-viewer'
// import Cookies from 'js-cookie'
import EnclosureItem from '../../components/enclosureItem/EnclosureItem'
import { clearSendState, saveReceiveState } from '../../redux/actions/homeState'
import EmployeeItem from '../../components/employeeItem/EmployeeItem'
import LocalData from '../../model/LocalData'

const operation = Modal.operation
const alert = Modal.alert
//==============================================================================================
let mType//0或undefined：待审批； 1：已审批； 2：我发起的；
let mMaster, mSessionId, mEmcode, mNodeId, mCachePoints
let mApprovalRecord = new ApprovalRecordBean()
let mTitleApproval = new ApprovalBean()
let mParams = []
let mFormStore = new Map()

let mHineApprovals = []//隐藏字段
let mShowApprovals = []//显示字段
let mHistoryNodes = []//历史审批
let mMainList = []//主表
let mDetailList = []//从表
let mSetuptasList = []//历史审批要点
let mEnclosureList = []//附件
let mNodeList = []//审批节点
let mPointsList = []//要点

let mModalList = []//组织架构、放大镜

let mBaseUrl
const SELECT_APPROVAL = 'select_approval'

const defaultApprovalState = {
  approvalContent: '',
  fastList: [
    '赞',
    'OK',
    '加油',
    '好的',
    '请及时完成',
  ],
  fastModalOpen: false,
  approvalIndex: 0,
  loading: true,
  finished: false,
  finishSuccess: true,
  finishMsg: '审批流程结束',

  disagreeAble: true,//不同意按钮是否显示
  agreeAble: true,//同意按钮是否显示
  takeoverAble: false,//接管按钮是否显示
  changeAble: false,//变更处理人按钮是否显示
  optionAble: false,//底部审批操作布局是否显示
  nodesTagAble: false,//审批节点切换是否显示
  revokeAble: false,//撤回按钮是否显示

  approvalStatus: 0,//审批状态 0：待审批；1：审批通过；2：审批不通过：3：异常结束
  approvalAble: false,

  titleApproval: {
    caption: '',
  },
  historyNodes: [],//历史审批
  mainList: [],//主表
  detailList: [],//从表
  setuptasList: [],//历史审批要点
  enclosureList: [],//附件
  nodeList: [],//审批节点
  pointsList: [],//要点

  changeModalOpen: false,//变更处理人弹框是否显示
  changeDataSource: new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }),//变更处理人列表
  selectModel: {},//被选中的item
}

class Approval extends Component {

  constructor () {
    super()

    this.state = defaultApprovalState
  }

  componentDidMount () {
    document.title = '审批单据'
    this.initData()
    let paramsStr = this.props.match.params.paramsStr
    if (isObjEmpty(paramsStr)) {
      let storage = window.localStorage
      paramsStr = storage.getItem('paramJson')
    }
    console.log('paramsStr', paramsStr)
    if (!isObjEmpty(paramsStr)) {
      try {
        let paramsJson = JSON.parse(decodeURIComponent(paramsStr))

        paramsJson.baseUrl
          ? (mBaseUrl = decodeURIComponent(paramsJson.baseUrl))
          : (mBaseUrl = window.location.origin
          + (process.env.REACT_APP_ROUTER_BASE_NAME || ''))
        mMaster = paramsJson.master
        mNodeId = paramsJson.nodeId
        mType = paramsJson.type

        this.getCurrentNode()
        // this.loginErp()
      } catch (e) {
        this.setState({
          loading: false,
        })
        message.error('参数获取失败')
      }
    } else {
      this.setState({
        loading: false,
      })
      message.error('参数获取失败')
    }
  }

  componentWillUnmount () {
    Toast.hide()
    this.moreOperation && this.moreOperation.close()
    this.revokeAlert && this.revokeAlert.close()
  }

  initData = () => {
    mCachePoints = ''
    mApprovalRecord = new ApprovalRecordBean()
    mTitleApproval = new ApprovalBean()
    mParams = []
    mFormStore = new Map()
    mHineApprovals = []//隐藏字段
    mShowApprovals = []//显示字段
    mHistoryNodes = []//历史审批
    mMainList = []//主表
    mDetailList = []//从表
    mSetuptasList = []//历史审批要点
    mEnclosureList = []//附件
    mNodeList = []//审批节点
    mPointsList = []//要点
    mModalList = []
  }

  getSessionId () {
    const c_name = 'JSESSIONID'
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + '=')
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        let c_end = document.cookie.indexOf(';', c_start)
        if (c_end == -1) {
          c_end = document.cookie.length
        }
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
  }

  render () {
    const {
      loading,
      finished,
      finishMsg,
      finishSuccess,
      approvalContent,
      fastList,
      fastModalOpen,
      approvalIndex,
      disagreeAble,//不同意按钮是否显示
      agreeAble,//同意按钮是否显示
      takeoverAble,//接管按钮是否显示
      changeAble,//变更处理人按钮是否显示
      revokeAble,//撤回按钮是否显示
      optionAble,
      titleApproval,
      nodesTagAble,
      historyNodes,//历史审批
      mainList,//主表
      detailList,//从表
      setuptasList,//历史审批要点
      enclosureList,//附件
      nodeList,//审批节点
      pointsList,//要点
      approvalStatus,//审批状态
      approvalAble,

      changeModalOpen,//变更处理人弹框是否显示
      changeDataSource,//变更处理人列表
      selectModel,
    } = this.state

    //审批常用语
    let fastItems = []
    for (let i = 0; i < fastList.length; i++) {
      fastItems.push(<div key={'fast' + i} className='fastItem' onClick={
        this.fastSelect.bind(this, i)
      }>{fastList[i]}</div>)
    }

    let tableItems = []
    //主表字段
    for (let i = 0; i < mainList.length; i++) {
      tableItems.push(<TableItem key={'main' + i} approval={mainList[i]}
                                 index={i}
                                 approvalAble={approvalAble}
                                 onDbfindClick={this.onDbfindClick.bind(this)}
                                 valueListener={this.childStateListener.bind(
                                   this)}/>)
    }

    //从表字段
    if (!isObjEmpty(detailList)) {
      tableItems.push(<div className='gray-line'
                           style={{ height: '6px' }}></div>)
      for (let i = 0; i < detailList.length; i++) {
        let detailObject = detailList[i]
        if (detailObject.type == ApprovalBean.TAG) {
          tableItems.push(<div
            className='tableTitle'>{detailObject.caption}</div>)
        } else {
          tableItems.push(<TableItem key={'detail' + i} approval={detailList[i]}
                                     index={i}
                                     approvalAble={approvalAble}
                                     onDbfindClick={this.onDbfindClick.bind(
                                       this)}
                                     valueListener={this.childStateListener.bind(
                                       this)}/>)
        }
      }
    }

    //历史审批要点
    if (!isObjEmpty(setuptasList)) {
      tableItems.push(<div className='gray-line'
                           style={{ height: '6px' }}></div>)
      for (let i = 0; i < setuptasList.length; i++) {
        let detailObject = setuptasList[i]
        if (detailObject.type == ApprovalBean.TAG) {
          tableItems.push(<div
            className='tableTitle'>{detailObject.caption}</div>)
        } else {
          tableItems.push(<TableItem key={'setup' + i}
                                     approval={setuptasList[i]} index={i}
                                     approvalAble={approvalAble}
                                     valueListener={this.childStateListener.bind(
                                       this)}></TableItem>)
        }
      }
    }

    //附件列表
    let enclosureItems = []
    if (!isObjEmpty(enclosureList)) {
      for (let i = 0; i < enclosureList.length; i++) {
        let enclosureObject = enclosureList[i]
        if (enclosureObject.type == ApprovalBean.TAG) {
          enclosureItems.push(<div
            className='tableTitle'>{enclosureObject.caption}</div>)
        } else {
          enclosureItems.push(<EnclosureItem key={'enclosure' + i}
                                             approval={enclosureObject}
                                             index={i}
                                             onEnclosureSelect={
                                               this.onEnclosureSelect.bind(this)
                                             }/>)
        }
      }
    }

    //审批要点
    let pointItems = []
    for (let i = 0; i < pointsList.length; i++) {
      let pointsObject = pointsList[i]
      if (pointsObject.type == ApprovalBean.TAG) {
        pointItems.push(<div
          className='tableTitle'>{pointsObject.caption}</div>)
      } else {
        pointItems.push(<PointsItem key={'points' + i} approval={pointsList[i]}
                                    index={i}
                                    approvalAble={approvalAble}
                                    valueListener={this.childStateListener.bind(
                                      this)}></PointsItem>)
      }
    }

    //审批节点
    let approvalPoint = []

    approvalPoint.push(<div key='node_tag' className={nodesTagAble
      ? 'approval_tab_parent'
      : 'displayNone'}>
      <div className={approvalIndex == 0 ?
        'approval_tab_selected' : 'approval_tab_normal'}
           onClick={this.approvalTabSelect1}>审批节点
      </div>
      <div
        style={{ background: '#cccccc', width: '1px', height: '20px' }}></div>
      <div className={approvalIndex == 1 ?
        'approval_tab_selected' : 'approval_tab_normal'}
           onClick={this.approvalTabSelect2}>审批历史
      </div>
    </div>)

    if (nodesTagAble) {
      for (let i = 0; i < nodeList.length; i++) {
        approvalPoint.push(<div
          className={approvalIndex == 0 ? '' : 'displayNone'}>
          <ApprovalNode key={'nodes' + i} isFirst={i == 0}
                        isLast={i == nodeList.length - 1}
                        approval={nodeList[i]}></ApprovalNode>
        </div>)
      }
      for (let i = 0; i < historyNodes.length; i++) {
        approvalPoint.push(<div
          className={approvalIndex == 1 ? '' : 'displayNone'}>
          <ApprovalNode key={'history' + i} isFirst={i == 0}
                        isLast={i == historyNodes.length - 1}
                        approval={historyNodes[i]}></ApprovalNode>
        </div>)
      }
    } else {
      for (let i = 0; i < nodeList.length; i++) {
        approvalPoint.push(<ApprovalNode key={'nodes' + i} isFirst={i == 0}
                                         isLast={i == nodeList.length - 1}
                                         approval={nodeList[i]}></ApprovalNode>)
      }
    }

    return <div style={{ width: '100%', height: '100%' }}>
      <div className='finishedLayout'
           style={{ display: finished ? 'flex' : 'none' }}>
        <Icon name={finishSuccess ? 'check circle' : 'warning circle'}
              size='huge'
              color={finishSuccess ? 'green' : 'red'}/>
        <span style={{
          marginTop: '10px',
          color: finishSuccess ? 'green' : 'red',
        }}>{finishMsg}</span>
      </div>

      <Spin size="large"
            style={{ display: finished ? 'none' : (loading ? 'flex' : 'none') }}
            tip='数据请求中...'>
      </Spin>

      <div className='approval-detail-root'
           style={{ display: finished ? 'none' : (loading ? 'none' : 'flex') }}>
        <div className='content'>
          <div className='headerLayout'>
            <Avatar size={42} src={require('@/images/default_header.png')}/>
            <div className='headerText'>
              <div>{titleApproval.caption}</div>
              <div style={{
                fontSize: '12px',
                color: '#333333',
                marginTop: '4px',
              }}>{titleApproval.masterName}</div>
            </div>
            {
              approvalStatus === 0 ? null
                : approvalStatus == 1 ?
                <Avatar
                  size={54} style={{ marginRight: 10 }}
                  src={require('@/images/approved.png')}/>
                : approvalStatus == 2 ?
                  <Avatar
                    size={54} style={{ marginRight: 10 }}
                    src={require('@/images/unapproved.png')}/>
                  : approvalStatus == 3 ?
                    <Avatar
                      size={54} style={{ marginRight: 10 }}
                      src={require('@/images/endapproved.png')}/> : null
            }
          </div>
          <div className='gray-line' style={{ height: '1px' }}></div>
          {tableItems}
          {enclosureItems.length > 0
            ? <div className='gray-line'
                   style={{ height: '6px' }}></div>
            : ''}
          {enclosureItems}
          {pointItems.length > 0 ? <div className='gray-line'
                                        style={{ height: '6px' }}></div> : ''}
          {pointItems}
          <div className='gray-line' style={{ height: '6px' }}></div>
          {approvalPoint}
        </div>
        {
          (approvalAble == true) ? (
              //待审批，且可操作
              <div className={optionAble ? 'bottomMenu' : 'displayNone'}>
                <div className='gray-line' style={{ height: '2px' }}></div>
                <div className='editLayout'>
                  <Icon disabled name='edit'/>
                  <TextArea className='editInput'
                            value={approvalContent}
                            placeholder='请输入审批意见...'
                            onChange={this.approvalEdit}/>
                  <Popover title='常用语' trigger='click'
                           content={fastItems}
                           visible={fastModalOpen}
                           onVisibleChange={this.handleFastVisiable}>
                    <div className='fastWords' onClick={this.fastClick}>常</div>
                  </Popover>
                </div>
                <div className='gray-line' style={{ height: '6px' }}></div>
                <div className='menuParent'>
                  <div className={takeoverAble ? 'menuItem' : 'displayNone'}
                       onClick={this.approvalTakeover}>接管
                  </div>
                  <div className={takeoverAble ? '' : 'displayNone'}
                       style={{
                         background: '#cccccc',
                         width: '1px',
                         height: '24px',
                       }}></div>

                  <div className={agreeAble ? 'menuItem' : 'displayNone'}
                       onClick={this.approvalAgree}>同意
                  </div>
                  <div className={agreeAble ? '' : 'displayNone'}
                       style={{
                         background: '#cccccc',
                         width: '1px',
                         height: '24px',
                       }}></div>

                  <div className={disagreeAble ? 'menuItem' : 'displayNone'}
                       onClick={this.approvalDisagree}>不同意
                  </div>
                  <div className={disagreeAble ? '' : 'displayNone'}
                       style={{
                         background: '#cccccc',
                         width: '1px',
                         height: '24px',
                       }}></div>

                  <div
                    className={approvalStatus === 0 ? 'menuItem' : 'displayNone'}
                    onClick={this.moreMenu}>更多
                  </div>
                </div>
              </div>)
            : ((mType == 2) ? (
                //mType=2 我发起的单据 操作菜单
                <div className={optionAble ? 'bottomMenu' : 'displayNone'}>
                  <div className='gray-line' style={{ height: '2px' }}></div>
                  <div className='menuParent'>
                    <div className={approvalStatus === 0
                      ? 'menuItem'
                      : 'displayNone'}
                         onClick={this.urgeToApproval}>催办
                    </div>
                    <div className={approvalStatus === 0 ? '' : 'displayNone'}
                         style={{
                           background: '#cccccc',
                           width: '1px',
                           height: '24px',
                         }}></div>

                    <div className={revokeAble ? 'menuItem' : 'displayNone'}
                         onClick={this.revokeApproval}>撤回
                    </div>
                    <div className={revokeAble ? '' : 'displayNone'}
                         style={{
                           background: '#cccccc',
                           width: '1px',
                           height: '24px',
                         }}></div>

                    <div
                      className={'menuItem'}
                      onClick={this.loadNextMine}>下一条
                    </div>
                  </div>
                </div>
              ) : (
                (mType == 1) ? (
                  //【我的审批】-【已审批】
                  <div className={optionAble ? 'bottomMenu' : 'displayNone'}>
                    <div className='gray-line' style={{ height: '2px' }}></div>
                    <div className='menuParent'>
                      <div
                        className={'menuItem'}
                        onClick={this.loadNextMine}>下一条
                      </div>
                    </div>
                  </div>
                ) : ''
              )
            )
        }
        {/*变更处理人、放大镜弹出框*/}
        {this.getChangeModal()}
      </div>
    </div>
  }

  /**
   * 弹出【更多】操作弹框
   */
  moreMenu = () => {
    const { takeoverAble } = this.state
    let actions = []

    if (!takeoverAble) {
      actions.push({ text: '变更处理人', onPress: this.approvalChange })
    }
    actions.push({ text: '下一条', onPress: this.loadNextProcess })
    this.moreOperation = operation(actions)
  }

  /*变更处理人、放大镜弹框*/
  getChangeModal () {
    const {
      changeModalOpen,//变更处理人弹框是否显示
      changeDataSource,//变更处理人列表
      selectModel,//选中的item
    } = this.state
    return <Modal visible={changeModalOpen}
                  animationType={'slide-up'}
                  onClose={() => {
                    this.setState({
                      changeModalOpen: false,
                      selectModel: {},
                    })
                    if (selectModel.type == SELECT_APPROVAL
                      && this.state.approvalStatus == 1) {
                      this.loadNextProcess()
                    }
                  }}
                  title={selectModel.caption}
                  popup
    >
      <SearchBar
        placeholder={'搜索人员'}
        maxLength={12}
        onChange={value => {
          if (isObjEmpty(value)) {
            this.setState({
              changeDataSource: changeDataSource.cloneWithRows(
                mModalList),
            })
          } else {
            let searchList = []
            if (!isObjEmpty(mModalList)) {
              mModalList.forEach(item => {
                if (!isObjNull(item)
                  && (
                    strContain(item.values, value)
                    || strContain(item.value, value)
                    || strContain(item.display, value)
                    || strContain(item.name, value)
                    || strContain(item.EM_CODE, value)
                    || strContain(item.EM_NAME, value)
                    || strContain(item.EM_POSITION, value)
                    || strContain(item.EM_DEFAULTORNAME, value)
                    || strContain(item.EM_DEPART, value)
                    || strContain(item.EM_MOBILE, value)
                    || strContain(item.EM_EMAIL, value)
                    || strContain(item.COMPANY, value)
                  )) {
                  searchList.push(item)
                }
              })
            }
            this.setState({
              changeDataSource: changeDataSource.cloneWithRows(
                searchList),
            })
          }
        }}
        onClear={value => {
          this.setState({
            changeDataSource: changeDataSource.cloneWithRows(
              mModalList),
          })
        }}
        /*onCancel={value => {
          this.setState({
            changeDataSource: changeDataSource.cloneWithRows(
              mModalList),
          })
        }}*/
      />
      <ListView
        dataSource={this.state.changeDataSource}
        initialListSize={30}
        renderRow={(rowData, sectionID, rowID) => {
          switch (selectModel.type) {
            case SELECT_APPROVAL:
              return <List.Item
                key={rowID}
                wrap
                onClick={this.onChangeSelect.bind(this,
                  rowData)}>
                <EmployeeItem employee={rowData}/>
              </List.Item>
            default:
              return <List.Item
                key={rowID}
                wrap
                onClick={this.onDbfindSelect.bind(this,
                  selectModel,
                  rowData)}>{rowData.value}</List.Item>
          }
        }}
        style={{
          height: '72vh',
          overflow: 'auto',
        }}
        pageSize={20}
        // onScroll={() => {}}
        // scrollRenderAheadDistance={500}
        // onEndReachedThreshold={10}
      />
    </Modal>
  }

  initPageState = () => {
    this.initData()
    this.setState(defaultApprovalState)
  }

  /**
   * 放大镜选项选中
   */
  onDbfindSelect = (selectModel, rowData) => {
    const {
      mainList,//主表
      detailList,//从表
    } = this.state
    let selectData = rowData
    let dataObj = selectData.obj
    let isForm = (selectModel.type === ApprovalBean.MAIN)
    if (isForm == true) {
      mainList.forEach((showModel, index) => {
        if (showModel.valuesKey in dataObj) {
          showModel.values = dataObj[showModel.valuesKey]
        }
      })
    } else {
      detailList.forEach((showModel, index) => {
        if (showModel.valuesKey in dataObj) {
          showModel.values = dataObj[showModel.valuesKey]
        }
      })
    }
    this.setState({
      mainList,
      detailList,
      changeModalOpen: false,
      selectModel: {},
    })
  }

  onDbfindClick = (type, index) => {
    let {
      mainList,//主表
      detailList,//从表
    } = this.state
    let selectModel = {}
    switch (type) {
      case ApprovalBean.MAIN:
        selectModel = mainList[index]
        break
      case ApprovalBean.DETAIL:
        selectModel = detailList[index]
        break
    }
    selectModel.type = type
    selectModel.index = index
    this.setState({ selectModel })
    //DBFind选择
    this.getDbfindList(selectModel)
  }

  /**
   * 放大镜类型
   * @param billModel
   * @param billGroup
   */
  getDbfindList (selectModel) {
    let fieldKey = selectModel.valuesKey
    let isForm = (selectModel.type === ApprovalBean.MAIN)
    // let corekey = selectModel.corekey
    let gridCaller = selectModel.gCaller

    let condition = '1=1'

    let params = {
      which: isForm == true ? 'form' : 'grid',
      caller: isForm == true
        ? (selectModel.caller)
        : gridCaller,
      field: fieldKey,
      condition: condition,
      page: 1,
      pageSize: 1000,
    }
    if (isForm == false) {
      params.gridField = fieldKey
      params.gridCaller = (selectModel.caller)
    }
    fetchGet(mBaseUrl + '/uapproval/common/dbfind.action',
      params).then(response => {
      Toast.hide()
      let dbfinds = response.dbfinds || response.gridDbfinds
      if (isObjEmpty(dbfinds)) {
        message.warn('选项数据为空')
        return
      }
      let dataStr = response.data
      let dataList = JSON.parse(dataStr)
      if (isObjEmpty(dataList)) {
        message.warn('选项数据为空')
        return
      }
      let fieldKeyLike = ''
      let configMap = {}
      dbfinds.forEach((config, index) => {
        //显示值对应字段名
        let dbGridField = config.dbGridField || config.ds_dbfindfield
        //实际字段名
        let field = config.field || config.ds_gridfield
        if (!isObjEmpty(dbGridField) && !isObjEmpty(field)) {
          if (field == fieldKey) {
            fieldKeyLike = dbGridField
          }
          configMap[dbGridField] = field
        }
      })
      let dbList = []
      dataList.forEach((item, index) => {
        let localData = new LocalData()
        localData.name = item[fieldKeyLike]
        let jsonMap = {}
        for (let key in configMap) {
          jsonMap[configMap[key]] = item[key]
        }
        localData.value = this.getShowValue(jsonMap)
        localData.obj = jsonMap
        dbList.push(localData)
      })
      mModalList = dbList
      if (dbList.length === 0) {
        message.error('选项数据为空')
      } else {
        this.setState({
          changeDataSource: this.state.changeDataSource.cloneWithRows(
            mModalList),
          changeModalOpen: true,
        })
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('选项获取失败')
      }
    })
  }

  getShowValue = (jsonMap) => {
    let showValue = ''
    for (let key in jsonMap) {
      if (!isObjEmpty(jsonMap[key])) {
        showValue += jsonMap[key] + ','
      }
    }
    showValue = showValue.substr(0, showValue.length - 1)
    return showValue
  }

  childStateListener = (type, index, value, isDbfind) => {
    let {
      mainList,//主表
      detailList,//从表
      pointsList,//要点
    } = this.state
    console.log(type + '-' + index + '-' + value + '-' + isDbfind)
    switch (type) {
      case ApprovalBean.MAIN:
        mainList[index].values = value
        this.setState({
          mainList: mainList,
        })
        break
      case ApprovalBean.DETAIL:
        detailList[index].values = value
        this.setState({
          detailList: detailList,
        })
        break
      case ApprovalBean.POINTS:
        pointsList[index].values = value
        this.setState({
          pointsList: pointsList,
        })
        break
    }
  }

  /**
   * 获取下一条我发起的/已审批单据
   */
  loadNextMine = () => {
    Toast.loading('正在获取下一条单据', 0)
    let type = 'alreadyDo'
    if (mType == 1) {
      type = 'alreadyDo'
    } else if (mType == 2) {
      type = 'alreadyLaunch'
    }
    fetchPost(mBaseUrl + '/uapproval/common/getNextApprovalProcess.action', {
      taskId: mNodeId,
      master: mMaster,
      type: type,
      _noc: 1,
    }).then(response => {
      Toast.hide()
      let nextNode = getIntValue(response, 'nodeId')
      if (nextNode > 0) {
        mNodeId = nextNode
        this.toNextNode()
      } else {
        message.warn('没有下一条单据')
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('单据获取失败')
      }
    })
  }

  /**
   * 催办
   */
  urgeToApproval = () => {
    Toast.loading('正在催办', 0)
    fetchPost(mBaseUrl + '/uapproval/common/urgeDeal.action', {
      caller: mApprovalRecord.caller,
      id: mApprovalRecord.id,
    }).then(response => {
      Toast.hide()
      message.success('催办成功')
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('催办失败')
      }
    })
  }

  /**
   * 撤回单据
   */
  revokeApproval = () => {
    this.revokeAlert = alert('提示', '单据将反提交，确认撤回？', [
      { text: '取消', onPress: () => {} },
      {
        text: '确定', onPress: () => {
          Toast.loading('正在撤回单据', 0)
          fetchPost(mBaseUrl + '/uapproval/common/cancelAprroval.action', {
            caller: mApprovalRecord.caller,
            id: mApprovalRecord.id,
          }).then(response => {
            Toast.hide()
            message.success('单据撤回成功')
            this.props.history.replace('/approvalAdd/'
              + mApprovalRecord.caller
              + '/' + mMaster
              + '/' + mApprovalRecord.id)
            clearSendState({
              searchKey: this.props.homeState.sendState
                ? ''
                : this.props.homeState.sendState.searchKey,
            })()
          }).catch(error => {
            Toast.hide()
            if (typeof error === 'string') {
              message.error(error)
            } else {
              message.error('单据撤回失败')
            }
          })
        },
      },
    ])

  }

  /**
   * 附件被选择
   * @param index
   */
  onEnclosureSelect = (index) => {
    const { enclosureList } = this.state
    if (!isObjEmpty(enclosureList) && enclosureList.length > index) {
      let enclosure = enclosureList[index]
      console.log('path', enclosure.idKey)
      Toast.loading('附件加载中...', 0)
      fetch(enclosure.idKey, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        }),
      }).then(response => {
        if (response.status == 200) {
          Toast.hide()
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = enclosure.idKey
          document.body.appendChild(link)
          link.click()

          // 释放的 URL 对象以及移除 a 标签
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        } else {
          throw '附件加载失败'
        }
      }).catch(error => {
        Toast.hide()
        message.error('附件加载失败')
      })
    }
  }

  /*loginErp = () => {
    fetchPost(
      mBaseUrl + 'mobile/login.action'
      , {
        'username': mPhone,
        'password': mPassword,
        'master': mMaster,
      }).then((response) => {
      console.log('login', response)
      if (response.success) {
        mSessionId = response.sessionId
        document.cookie = 'JSESSIONID=' + mSessionId
        mEmcode = response.erpaccount

        this.getCurrentNode()
      } else {
        message.error(response.reason)
        this.setState({
          loading: false,
        })
      }
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
      })
    })
  }*/

  //获取当前节点
  getCurrentNode = () => {
    fetchGet(mBaseUrl + '/common/getCurrentNode.action', {
      'jp_nodeId': mNodeId,
      'master': mMaster,
      '_noc': 1,
      // 'sessionId': mSessionId,
      // 'sessionUser': mEmcode,
    }).then((response) => {
      try {
        let result = response
        let infoObject = result.info

        if (isEmptyObject(infoObject)) {
          this.setState({
            loading: false,
          })
          return
        }
        mEmcode = infoObject.currentemcode//当前登录人
        mApprovalRecord.masterName = infoObject.masterName
        mApprovalRecord.processInstanceId = infoObject.InstanceId
        mApprovalRecord.isForknode = (getIntValue(infoObject, 'forknode') ===
          0)
        let currentnode = getObjValue(infoObject, 'currentnode')
        if (!isObjNull(currentnode)) {
          let recordName = getStrValue(currentnode, 'jp_launcherName')
          let jp_nodeDealMan = getStrValue(currentnode, 'jp_nodeDealMan')
          mApprovalRecord.currentNodeMan = jp_nodeDealMan
          if (isObjEmpty(jp_nodeDealMan)) {
            this.setState({
              disagreeAble: false,
              agreeAble: false,
              takeoverAble: true,
            })
          } else {
            this.setState({
              agreeAble: true,
              takeoverAble: false,
            })
          }
          let launcherCode = getStrValue(currentnode, 'jp_launcherId')
          let nodeName = getStrValue(currentnode, 'jp_nodeName')
          let keyValue = getStrValue(currentnode, 'jp_keyValue')
          let jp_name = getStrValue(currentnode, 'jp_name')
          mApprovalRecord.title = jp_name
          mApprovalRecord.callerName = jp_name

          let statusStr = getStrValue(currentnode, 'jp_status')
          mApprovalRecord.status = statusStr
          if (!isObjEmpty(statusStr)) {
            if (statusStr.indexOf('已审批') != -1) {
              this.setState({
                approvalStatus: 1,
              })
            } else if (statusStr.indexOf('未通过') != -1) {
              this.setState({
                approvalStatus: 2,
              })
            } else if (statusStr.indexOf('已结束') != -1) {
              this.setState({
                approvalStatus: 3,
              })
            } else {
              this.setState({
                approvalStatus: 0,
                approvalAble: ((mType === undefined || mType == 0) &&
                  ((isObjEmpty(mApprovalRecord.currentNodeMan)
                    || mEmcode == mApprovalRecord.currentNodeMan)))
                  ? true
                  : false,
              })
            }
          }

          let caller = getStrValue(currentnode, 'jp_caller')

          if (!isObjNull(keyValue)) {
            mApprovalRecord.id = keyValue
          }

          if (!isObjNull(mApprovalRecord.title)) {
            if (!isObjNull(recordName)) {
              mApprovalRecord.title = recordName + '  ' +
                mApprovalRecord.title
            }
          }

          if (!isObjNull(caller)) {
            mApprovalRecord.caller = caller
          }

          if (!isObjNull(nodeName)) {
            mApprovalRecord.nodeName = nodeName
          }

          if (isObjNull(mApprovalRecord.imid)) {
            mApprovalRecord.imid = ''
          }
        }

        let button = infoObject.button
        if (!isObjNull(currentnode)) {
          mApprovalRecord.needInputKeys = getStrValue(button,
            'jt_neccessaryfield')
        }
        this.handerTitle(0)
        //获取明细表
        this.getformandgriddata()
      } catch (e) {

      }
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      // console.log('current', error)
      this.setState({
        loading: false,
      })
    })
  }

  getformandgriddata = () => {
    fetchPost(mBaseUrl + '/uapproval/common/getformandgriddata.action',
      {
        'caller': mApprovalRecord.caller,
        'master': mMaster,
        'id': mApprovalRecord.id,
        'isprocess': 1,
        'config': 1,
      }, {
        // 'Cookie': 'JSESSIONID=' + mSessionId
      }).then((response) => {
      let result = response
      let datas = result.datas
      if (!isObjNull(datas)) {
        //单据是否允许【撤回】
        this.setState({
          revokeAble: datas.allowcancel,
        })
        //主表数据
        let formdatas = datas.formdata
        let formconfigs = datas.formconfigs

        if (!isObjNull(formconfigs)) {
          let formdata = isObjNull(formdatas) ? '' : formdatas[0]
          let changeData = formdatas.length <= 1 ? '' : formdatas[1]

          let mainApproval = this.analysisFormdata(changeData['change-new'],
            formdata,
            formconfigs, mApprovalRecord.caller, true, true)

          mMainList = mMainList.concat(mainApproval)
        }

        //从表数据
        let griddatas = datas.griddata
        let gridconfigs = datas.gridconfigs
        if (!isObjNull(gridconfigs) && gridconfigs.length > 0) {
          if (isObjNull(griddatas) || griddatas.length == 0) {
            this.analysisFormdata(null, null, gridconfigs,
              mApprovalRecord.caller, false, true)
          } else {
            for (let i = 0; i < griddatas.length; i++) {
              let detailedApproval = this.analysisFormdata(null, griddatas[i],
                gridconfigs, mApprovalRecord.caller, false, i == 0)
              if (!isObjNull(detailedApproval) && detailedApproval.length >
                0) {
                let approval = new ApprovalBean(ApprovalBean.TAG)
                if (!isObjEmpty(mApprovalRecord.currentNodeMan)
                  && mApprovalRecord.caller.toUpperCase() == 'INQUIRY'
                  && mEmcode == mApprovalRecord.currentNodeMan) {
                  approval.values = '初始化'
                }
                approval.caption = (i == 0
                  ? (mApprovalRecord.getCallerName() +
                    '  明细')
                  : '')
                detailedApproval.splice(0, 0, approval)
                mDetailList = mDetailList.concat(detailedApproval)
              }
            }
          }
        }

        //多从表
        let othergrids = datas.othergrids
        if (!isObjEmpty(othergrids)) {
          let o = null
          let caller = null
          let otherGriddata = null
          let otherGridconfigs = null
          let name = null
          for (let i = 0; i < othergrids.length; i++) {
            o = othergrids[i]
            name = getStrValue(o, 'name')
            caller = getStrValue(o, 'caller')
            otherGriddata = getArrayValue(o, 'griddata')
            otherGridconfigs = getArrayValue(o, 'gridconfigs')

            if (!isObjEmpty(otherGriddata) && !isObjEmpty(otherGridconfigs)) {
              for (let j = 0; j < otherGriddata.length; j++) {
                //获取到单个明细表单
                let detailedApproval = this.analysisFormdata(null,
                  otherGriddata[j],
                  otherGridconfigs, caller, false, false)
                if (!isObjEmpty(detailedApproval)) {
                  let approval = new ApprovalBean(ApprovalBean.TAG)
                  approval.caption = (j == 0 ? (name + '  明细') : '')
                  detailedApproval.splice(0, 0, approval)

                  mDetailList = mDetailList.concat(detailedApproval)
                }
              }
            }
          }
        }

        this.setState({
          mainList: mMainList,
          detailList: mDetailList,
        })
        this.getCustomSetupOfTask()
      } else {
        message.error('未获取到明细表数据')
      }
    }).catch((error) => {
        if (typeof error === 'string') {
          message.error(error)
        } else {
          message.error('请求异常')
        }
        this.setState({
          loading: false,
        })
      },
    )
  }

  //获取审批要点
  getCustomSetupOfTask = () => {
    fetchGet(mBaseUrl + '/common/getCustomSetupOfTask.action',
      {
        '_noc': 1,
        'master': mMaster,
        'nodeId': mNodeId,
        // 'sessionId': mSessionId,
        // 'sessionUser': mEmcode,
      }, {
        // 'Cookie': 'JSESSIONID=' + mSessionId
      }).then((response) => {
      this.setState({
        optionAble: true,
      })
      let result = response
      let isApprove = getIntValue(result, 'isApprove')
      if (isApprove == 1) {
        this.setState({
          disagreeAble: false,
        })
      }

      let arrayCS = getArrayValue(result, 'cs')
      if (!isObjEmpty(arrayCS)) {
        let data = getStrValue(result, 'data')
        let datas = []
        if (!isObjEmpty(data)) {
          datas = data.split(';')
        }
        let pointsList = []
        for (let i = 0; i < arrayCS.length; i++) {
          let itemData = this.getItemBySetupTask(arrayCS[i], datas)
          if (!isObjNull(itemData)) {
            pointsList.push(itemData)
          }
        }

        if (!isObjEmpty(pointsList)) {
          let points = new ApprovalBean(ApprovalBean.TAG)
          points.caption = '审批要点'
          pointsList.splice(0, 0, points)

          mPointsList = pointsList
          this.setState({
            pointsList: pointsList,
          })
        }
      }

      this.getAllHistoryNodes()
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
      })
    })
  }

  //获取历史审批要点
  getAllHistoryNodes = () => {
    fetchGet(mBaseUrl + '/common/getAllHistoryNodes.action', {
      'master': mMaster,
      'processInstanceId': mApprovalRecord.processInstanceId,
      '_noc': 1,
      // 'sessionId': mSessionId,
      // 'sessionUser': mEmcode,
    }, {
      // 'Cookie': 'JSESSIONID=' + mSessionId
    }).then((response) => {
      let historyNode = response
      this.getCurrentJnodes(historyNode)
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
      })
    })
  }

  //获取历史节点数据
  getCurrentJnodes = (historyNodeJson) => {
    fetchGet(mBaseUrl + '/common/getCurrentJnodes.action',
      {
        'caller': mApprovalRecord.caller,
        'keyValue': mApprovalRecord.id,
        '_noc': 1,
        'master': mMaster,
        // 'sessionId': mSessionId,
        // 'sessionUser': mEmcode,
      }, {
        // 'Cookie': 'JSESSIONID=' + mSessionId
      }).then((response) => {
      let result = response

      let showNode = true
      let nodes = getArrayValue(result, 'nodes')
      let processs = getArrayValue(result, 'processs')
      let datas = getArrayValue(result, 'data')

      let approvals = this.getNodDatas(datas)
      if (!isObjEmpty(historyNodeJson)) {
        // let historyNode = historyNodeJson.historyNode
        // if (!isObjEmpty(historyNode)) {
        mHistoryNodes = this.handlerHistorySetuptask(historyNodeJson)
        // }
      }

      if (isObjEmpty(approvals) && !isObjEmpty(mHistoryNodes)) {
        showNode = false
        approvals = mHistoryNodes
      }

      if (showNode && !isObjEmpty(processs)) {
        approvals = this.mergeNode(1, processs, approvals, false)
      }

      if (showNode && !isObjEmpty(nodes)) {
        approvals = this.mergeNode(2, nodes, approvals, true)
      }

      let hanNotApproval = false
      /**
       * 已审批
       * 未通过
       * 已结束
       * 待审批
       */
      for (let i = 0; i < approvals.length; i++) {
        let approval = approvals[i]
        let idKey = approval.idKey
        if (!idKey.startWith('已审批') && !idKey.startWith('未通过')
          && !idKey.startWith('不同意') && !idKey.startWith('已结束')) {
          hanNotApproval = true
          if (idKey.startWith('待审批')) {
            approval.values = ''
          }
        } else if (idKey.startWith('未通过') && i == 0) {
          mApprovalRecord.status = '未通过'
        }
        let emcode = null
        if (strContain(approval.dfType, ',')) {
          let emcodes = approval.dfType.split(',')
          if (!isObjEmpty(emcodes[0])) {
            emcode = emcodes[0]
          }
        } else {
          emcode = approval.dfType
        }
        if (!isObjEmpty(emcode)) {
          let imid = this.getImByCode(emcode)
          approval.id = imid
        }
      }
      let reId = -1
      if (showNode) {
        if (mApprovalRecord.status == '未通过'
          || mApprovalRecord.status == '已结束'
          || mApprovalRecord.status == '已审批') {
          showNode = false
          approvals = mHistoryNodes
        }
      }
      if (mApprovalRecord.status == '未通过') {
        reId = '@/images/unapproved.png'
      } else if (!hanNotApproval && false) {
        reId = '@/images/approved.png'
      }
      this.handerTitle(reId)
      mNodeList = approvals
      if (!isObjEmpty(approvals) && !isObjEmpty(mHistoryNodes) && showNode) {
        // let nodeTag = new ApprovalBean(ApprovalBean.NODES_TAG)
        // approvals.splice(0, 0, nodeTag)
        this.setState({
          nodesTagAble: true,
        })
      } else {
        this.setState({
          nodesTagAble: false,
        })
      }
      this.setState({
        nodeList: mNodeList,
        historyNodes: mHistoryNodes,
        loading: false,
      })
    }).catch((error) => {
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
      })
    })
  }

  mergeNode = (type, array, approvals, isLog) => {
    for (let i = 0; i < array.length; i++) {
      let o = array[i]
      let name//节点名称
      let launchTime//时间
      let status//状态
      let nodeDealCode//处理人编号
      let nodeDealName//执行人
      let nodeDescription//执行操作
      if (type == 1) {
        name = getStrValue(o, 'jp_nodeName')
        launchTime = getTimeValue(o, 'jp_launchTime')
        status = getStrValue(o, 'jp_status')
        nodeDealCode = getStrValue(o, 'jp_nodeDealMan')
        nodeDealName = getStrValue(o, 'jp_nodeDealManName')
        nodeDescription = getStrValue(o, 'jn_nodeDescription')
      } else if (type == 2) {
        name = getStrValue(o, 'jn_name')
        launchTime = getTimeValue(o, 'jn_dealTime')
        status = getStrValue(o, 'jn_dealResult')
        nodeDealCode = getStrValue(o, 'jn_dealManId')
        nodeDealName = getStrValue(o, 'jn_dealManName')
        nodeDescription = getStrValue(o, 'jn_nodeDescription')
      }
      let hanEnd = false
      status = this.setNodeStatus(status)
      for (let j = approvals.length - 1; j >= 0; j--) {
        let approval = approvals[j]
        if (hanEnd && status != '待审批') {
          continue
        }
        if (approval.valuesKey == mApprovalRecord.nodeName) {
          hanEnd = true
        }
        if (name == approval.valuesKey) {
          //为当前节点
          if (!isLog) {
            approval.dfType = nodeDealCode
            approval.caption = nodeDealName
            if (status == '待审批') {
              if (mEmcode == nodeDealCode) {
                approval.idKey = status
              } else {
                approval.idKey = ''
              }
            } else {
              approval.idKey = status
            }
          } else {
            if (launchTime > 0) {
              let launchDate = new Date()
              launchDate.setTime(launchTime)
              approval.values = launchDate.format('MM-dd')
              approval.dbFind = launchDate.format('hh:mm')
            }

            if (approval.dfType == nodeDealCode) {
              if (status == '不同意') {
                approval.idKey = '未通过'
              } else if (status == '同意') {
                approval.idKey = '已审批'
              }
              if (!hanEnd && !isObjEmpty(nodeDescription)) {
                approval.idKey = approval.idKey + '(' + nodeDescription + ')'
              }
            }

          }
          break
        }
      }
    }
    return approvals
  }

  handlerHistorySetuptask = (object) => {
    let nodeApprovals = []
    if (isObjEmpty(object)) {
      return nodeApprovals
    }
    let nodes = getArrayValue(object, 'nodes')
    if (!isObjEmpty(nodes)) {
      let setuptasks = []
      let node = null
      let itemSetuptask = null
      for (let i = nodes.length - 1; i >= 0; i--) {
        node = nodes[i]
        itemSetuptask = this.getSetuptask(node)
        if (!isObjEmpty(itemSetuptask)) {
          setuptasks = setuptasks.concat(itemSetuptask)
        }
        nodeApprovals.push(this.getNodeApproval(node))
      }
      if (!isObjEmpty(setuptasks)) {
        mSetuptasList = setuptasks

        this.setState({
          setuptasList: mSetuptasList,
        })
      }
    }
    return nodeApprovals
  }

  getNodeApproval = (object) => {
    let nodeName = getStrValue(object, 'jn_name')//当前结点名称
    let emCode = getStrValue(object, 'jn_dealManId')//节点处理人编号
    let manName = getStrValue(object, 'jn_dealManName')//处理人名字
    let dealTime = getStrValue(object, 'jn_dealTime')//审批时间
    let result = getStrValue(object, 'jn_dealResult')//审批结果
    let attach = getStrValue(object, 'jn_attach')//选择类型
    let description = getStrValue(object, 'jn_nodeDescription')//审批意见

    let approval = new ApprovalBean(ApprovalBean.NODES)
    approval.neerInput = (attach == 'T')
    approval.mustInput = (result == '同意')

    result = this.setNodeStatus(result)
    approval.caption = manName
    approval.dfType = emCode
    if (!isObjEmpty(dealTime)) {
      let time = Date.parse(new Date(dealTime))
      if (time > 0) {
        let newDate = new Date()
        newDate.setTime(time)
        approval.values = newDate.format('MM-dd hh:mm')
      }
    }
    let resultBuilder = ''
    if (!isObjEmpty(result)) {
      resultBuilder += result
    }
    if (!isObjEmpty(description)) {
      resultBuilder += ('(' + description.replace('\\n', '\n') + ')')
    }
    approval.idKey = resultBuilder
    approval.valuesKey = nodeName
    if (!isObjEmpty(emCode)) {
      let imid = this.getImByCode(emCode)
      approval.id = imid
    }

    return approval
  }

  getImByCode = (emcode) => {
    return 0
  }

  setNodeStatus = (status) => {
    if (status == '同意') {
      status = '已审批'
    } else if (status == '不同意' || status == '不通过') {
      status = '未通过'
    } else if (status == '结束流程') {
      status = '已结束'
    }
    return status
  }

  getSetuptask = (node) => {
    let name = getStrValue(node, 'jn_dealManName')
    let approval = new ApprovalBean(ApprovalBean.TAG)
    approval.caption = name + '的审批记录'
    let jn_operatedDescription = getStrValue(node, 'jn_operatedDescription')
    let itemSetuptasks = this.getSetuptaskByData(jn_operatedDescription)
    if (!isObjEmpty(itemSetuptasks)) {
      itemSetuptasks.splice(0, 0, approval)
    }
    return itemSetuptasks
  }

  getSetuptaskByData = (data) => {
    let itemSetuptasks = []
    if (isObjEmpty(data)) {
      return itemSetuptasks
    }
    let datas = data.split(';')
    if (isObjEmpty(datas)) {
      return itemSetuptasks
    }
    let approval = null
    for (let i = 0; i < datas.length; i++) {
      let description = datas[i]
      if (strContain(description, '(')) {
        let caption = description.substring(0, description.indexOf('('))
        let values = getParenthesesStr(description)
        if (!isObjEmpty(caption) && !isObjEmpty(values)) {
          approval = new ApprovalBean(ApprovalBean.SETUPTASK)
          approval.neerInput = false
          approval.caption = caption
          approval.values = values

          itemSetuptasks.push(approval)
        }
      }
    }

    return itemSetuptasks
  }

  getNodDatas = (datas) => {
    let approvals = []
    if (isObjEmpty(datas)) {
      return approvals
    }
    for (let i = datas.length - 1; i >= 0; i--) {
      let object = datas[i]
      let nodeName = getStrValue(object, 'JP_NODENAME')
      let emCode = getStrValue(object, 'JP_NODEDEALMAN')
      let manName = getStrValue(object, 'JP_NODEDEALMANNAME')

      let approval = new ApprovalBean(ApprovalBean.NODES)
      approval.caption = isObjEmpty(manName) ? nodeName : manName
      approval.dfType = emCode
      approval.valuesKey = nodeName

      approvals.push(approval)
    }

    return approvals
  }

  getItemBySetupTask = (cs, datas) => {
    if (!isObjEmpty(cs)) {
      let approval = new ApprovalBean(ApprovalBean.POINTS)
      let css = cs.split('\^')
      if (!isObjEmpty(css[0])) {
        approval.caption = css[0]
        let tag = css[1]
        if (!isObjEmpty(tag)) {
          let tags = tag.split('\$')
          approval.dfType = tags[0]
          let neer = tags[1]
          let data = getBracketStr(neer)
          if (isObjEmpty(data)) {
            data = '是;否'
          }
          let combostore = data.split(';')
          if (!isObjEmpty(combostore)) {
            combostore.forEach((item) => {
              if (!isObjEmpty(item)) {
                approval.datas.push(new ApprovalBean.Data(item, item))
              }
            })
          }
          if (!isObjEmpty(neer)) {
            approval.mustInput = neer.startWith('Y')
            if (strContain(neer, '@A')) {
              approval.dfType = '@A'
            } else if (strContain(neer, '@')) {
              let rets = neer.split('@')
              if (!isObjEmpty(rets) && rets.length > 1) {
                approval.dfType = '@' + rets[1]
              }
            }
          }
        }
        if (!isObjEmpty(datas)) {
          datas.forEach((data) => {
            if (data.startWith(approval.caption)) {
              let values = getBracketStr(data)
              if (!isObjEmpty(values)
                && values !== 'null'
                && values !== '(null)'
                && values !== '(null') {
                approval.values = values
              }
            }
          })
        }

        approval.neerInput = true
        if (!approval.neerInput && isObjEmpty(approval.values)) {
          return null
        }
        return approval
      }
    } else {
      return null
    }
  }

  analysisFormdata = (changeData, data, configs, caller, isMain, addHint) => {
    let approvalList = []

    let idTag = ''
    let id = 0
    let merged = ''
    for (let i = 0; i < configs.length; i++) {
      let config = configs[i]
      if (isObjNull(config)) {
        continue
      }
      let approval = new ApprovalBean(
        isMain ? ApprovalBean.MAIN : ApprovalBean.DETAIL)

      let caption, valueKey, combostore, type, dbFind, isdefault, appwidth
      if (isMain) {
        caption = config.FD_CAPTION
        valueKey = config.FD_FIELD
        combostore = config.COMBOSTORE
        type = config.FD_TYPE
        dbFind = config.FD_DBFIND
        isdefault = config.MFD_ISDEFAULT
        appwidth = config.FD_APPWIDTH
      } else {
        caption = config.DG_CAPTION
        valueKey = config.DG_FIELD
        combostore = config.COMBOSTORE
        type = config.DG_TYPE
        dbFind = config.DG_TYPE
        isdefault = config.MDG_ISDEFAULT
        appwidth = config.DG_APPWIDTH
      }
      approval.dbFind = dbFind
      approval.dfType = type
      approval.caption = caption
      approval.valuesKey = valueKey

      let showAble = ((!isObjNull(data)) && data.hasOwnProperty(valueKey))
      let values = getStrValue(data, valueKey)
      let newValues = getStrValue(changeData, valueKey)

      if (showAble && !isObjEmpty(newValues) && !(newValues === values)) {
        approval.oldValues = values
      } else {
        newValues = values
      }

      if (!isMain) {
        let findTionName = config.DG_FINDFUNCTIONNAME
        let renderer = config.DG_RENDERER
        approval.renderer = renderer
        if ((!isObjNull(findTionName)) && strContain(findTionName, '|')) {
          let hhitem = findTionName.indexOf('|')

          let gCaller = findTionName.substring(0, hhitem)
          let coreKey = findTionName.substring(hhitem + 1)
          approval.gCaller = gCaller
          approval.coreKey = coreKey
        }

        if ((!isObjNull(renderer)) && strContain(renderer, 'formula:')) {
          try {
            renderer = renderer.substring('formula:'.length)
            renderer = this.getOperator(renderer, data)
            if (strContain(renderer, '字段需要设置为app显示')) {
              newValues = renderer
            } else {
              //暂时不做double类型处理
              newValues = renderer
              try {
                let mathResult = eval(renderer)
                newValues = mathResult.toFixed(2)
              } catch (e) {

              }
            }

          } catch (e) {
            this.setState({
              loading: false,
            })
          }
        }
      }

      if (approval.dfType == 'PF') {
        //附件
        let enclosure = new ApprovalBean(ApprovalBean.ENCLOSURE)
        let path = isObjNull(newValues) ? values : newValues
        enclosure.idKey = this.getImagePathUrl(path)
        let splits = path.split('\\.')
        let suffix = 'jpg'
        if (!isObjEmpty(splits)) {
          suffix = splits[splits.length - 1]
        }
        enclosure.caption = caption + '.' + suffix
        let enclosures = []
        enclosures.push(enclosure)
        this.addEnclosure(enclosures)

        continue
      }

      if (approval.dfType == 'FF' ||
        (approval.renderer == 'detailAttach') ||
        ((mApprovalRecord.title == '公章用印申请流程') && (caption == '附件'))) {
        //附件
        if (isMain) {
          this.loadFilePaths(newValues)
        } else {
          let attachs = newValues.split(';')
          if (!isObjNull(attachs) && attachs.length > 1) {
            let attachName = attachs[0]
            let attach = attachs[1]
            try {
              let enclosure = new ApprovalBean(ApprovalBean.ENCLOSURE)
              enclosure.id = attach
              enclosure.idKey = this.getImageIdUrl(attach)
              enclosure.caption = attachName

              this.addEnclosure([enclosure])
            } catch (e) {

            }
          }
        }
        continue
      }

      if ((!isObjNull(caption)) && (caption == 'ID' || caption == 'id')) {
        idTag = valueKey
        id = getIntValue(data, valueKey)
      }

      if (approval.dfType == 'H'
        || isdefault != -1
        || appwidth == 0
        || (!isMain && getIntValue(config, 'DG_WIDTH') === 0)) {
        continue
      }

      if (!isObjEmpty(caption)) {
        if (showAble) {
          approval.values = newValues
          if (addHint) {
            mShowApprovals.push(approval)
          }
        } else if (addHint) {
          mHineApprovals.push(approval)
        }
      }

      if (isObjEmpty(valueKey) || isObjEmpty(caption)
        || (merged.length > 0 && strContain(merged, ',' + valueKey + ','))) {
        continue
      }

      if (!isObjNull(combostore) && combostore.length > 0) {
        for (let j = 0; j < combostore.length; j++) {
          let comboObj = combostore[j]
          let value = getStrValue(comboObj, 'DLC_VALUE')
          let display = getStrValue(comboObj, 'DLC_DISPLAY')

          if (!isObjEmpty(value) || !isObjEmpty(display)) {
            approval.datas.push(new ApprovalBean.Data(display, value))
          }
        }
      }

      let mergeAble = (appwidth == 1 || approval.dfType == 'MT')
      approval.mustInput = true
      if (!isObjEmpty(mApprovalRecord.needInputKeys)
        && strContain(',' + mApprovalRecord.needInputKeys + ',',
          ',' + valueKey + ',')) {
        approval.neerInput = true
        if (approval.datas.length <= 0) {
          if (approval.dfType == 'YN' || approval.dfType == 'C') {
            approval.datas.push(
              new ApprovalBean.Data('-1', ApprovalBean.VALUES_YES))
            approval.datas.push(
              new ApprovalBean.Data('0', ApprovalBean.VALUES_NO))
          } else if (approval.dfType == 'B') {
            approval.datas.push(
              new ApprovalBean.Data('1', ApprovalBean.VALUES_YES))
            approval.datas.push(
              new ApprovalBean.Data('0', ApprovalBean.VALUES_NO))
          }
        }
      }

      approval.data2Values()
      if ((!approval.neerInput && isObjEmpty(approval.values)) || !showAble
        || approval.values == 'null' || approval.values == '(null)') {
        continue
      }
      if (mergeAble && !approval.isDBFind() && !approval.neerInput) {
        let valueTagKey
        if (isMain) {
          valueTagKey = getStrValue(config, 'FD_LOGICTYPE')
        } else {
          valueTagKey = getStrValue(config, 'DG_LOGICTYPE')
        }

        if (!isObjEmpty(valueTagKey)) {
          let valueTag = getStrValue(data, valueTagKey)
          if (!isObjEmpty(valueTag)) {
            merged = merged + ',' + valueTagKey + ','
            approval.values = approval.values + '/' + valueTag
          }
        }
      }
      approval.caller = caller

      approvalList.push(approval)
    }

    for (let i = 0; i < approvalList.length; i++) {
      let approvalItem = approvalList[i]
      approvalItem.id = id
      approvalItem.idKey = idTag
    }

    return approvalList
  }

  getImagePathUrl = (path) => {
    return mBaseUrl + '/common/download.action?path=' + path
      // + '&sessionId=' + '094F0F24379928148A56D37EA83632AE'
      // + '&sessionUser=' + 'U0757'
      + '&master=' + mMaster
  }

  getImageIdUrl = (id) => {
    return mBaseUrl + '/common/downloadbyId.action?id=' + id
      // + '&sessionId=' + '094F0F24379928148A56D37EA83632AE'
      // + '&sessionUser=' + 'U0757'
      + '&master=' + mMaster
  }

  addEnclosure = (enclosures) => {
    if (!isObjNull(enclosures)) {
      if (mEnclosureList.length <= 0) {
        let tag = new ApprovalBean(ApprovalBean.TAG)
        tag.caption = '附件'
        mEnclosureList.push(tag)
      }

      mEnclosureList = mEnclosureList.concat(enclosures)

      this.setState({
        enclosureList: mEnclosureList,
      })
    }
  }

  loadFilePaths = (attachs) => {
    if (isObjEmpty(attachs) || attachs == 'null') {
      return
    }
    fetchPost(mBaseUrl + '/common/getFilePaths.action', {
      field: 'fb_attach',
      master: mMaster,
      id: attachs,
    }).then(response => {
      let files = response.files
      let enclosures = []
      if (!isObjEmpty(files)) {
        for (let i = 0; i < files.length; i++) {
          let enclosureObj = files[i]
          if (isObjEmpty(enclosureObj)) {
            continue
          }
          let enclosure = new ApprovalBean(ApprovalBean.ENCLOSURE)
          enclosure.id = enclosureObj.fp_id
          enclosure.idKey = this.getImageIdUrl(enclosureObj.fp_id)
          enclosure.caption = enclosureObj.fp_name

          enclosures.push(enclosure)
        }
      }
      if (!isObjEmpty(enclosures)) {
        this.addEnclosure(enclosures)
      }
    }).catch(error => {

    })
  }

  getOperator = (renderer, data) => {
    let result = renderer
    let splitArray = renderer.split(/[^a-z^A-Z^_]/)

    splitArray.forEach((item) => {
      if (!isObjNull(item)) {
        let value = data[item]
        if (isObjNull(value)) {
          return item + '字段需要设置为app显示'
        } else {
          let reg = new RegExp(item, 'g')
          result = result.replace(reg, value)
        }
      }
    })
    return result
  }

  //设置头部内容
  handerTitle = (reId) => {
    let approval = new ApprovalBean(ApprovalBean.TITLE)
    if (!isObjNull(mApprovalRecord.title)) {
      approval.caption = mApprovalRecord.title
    }
    if (!isObjNull(mApprovalRecord.masterName)) {
      approval.masterName = mApprovalRecord.masterName
    }
    if (!isObjEmpty(mApprovalRecord.imid)) {
      approval.idKey = mApprovalRecord.imid
    }
    if (reId > 0) {
      approval.id = reId
    }
    mTitleApproval = approval

    this.setState({
      titleApproval: mTitleApproval,
    })
  }

  handleFastVisiable = (visible) => {
    this.setState({
      fastModalOpen: visible,
    })
  }

  approvalTabSelect1 = () => {
    this.setState({
      approvalIndex: 0,
    })
  }

  approvalTabSelect2 = () => {
    this.setState({
      approvalIndex: 1,
    })
  }

  /**
   * 变更处理人
   */
  approvalChange = () => {
    Toast.loading('人员资料获取中', 0)
    fetchGet(mBaseUrl + '/mobile/getAllHrorgEmps.action', {
      master: mMaster,
    }).then(response => {
      Toast.hide()
      mModalList = response.employees
      this.setState({
        changeModalOpen: true,
        selectModel: {
          type: SELECT_APPROVAL,
          caption: '指定处理人',
        },
        changeDataSource: this.state.changeDataSource.cloneWithRows(
          mModalList),
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('组织架构获取失败')
      }
    })
  }

  //接管单据
  approvalTakeover = () => {
    Toast.loading('正在接管单据', 0)
    fetchPost(mBaseUrl + '/common/takeOverTask.action', {
      em_code: mEmcode,
      nodeId: mNodeId,
      master: mMaster,
      needreturn: true,
    }, {
      // 'Cookie': 'JSESSIONID=' + mSessionId
    }).then(response => {
      Toast.hide()
      message.success('接管成功')
      this.initPageState()
      this.getCurrentNode()
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
    })
  }

  //同意点击事件
  approvalAgree = () => {
    // this.setState({
    //   loading: true,
    // })
    Toast.loading('正在审批...', 0)
    this.loadProcessUpdate()
  }

  //不同意审批
  approvalDisagree = () => {
    // this.setState({
    //   loading: true,
    // })
    Toast.loading('正在审批...', 0)
    fetchPost(mBaseUrl + '/common/review.action', {
      'taskId': mNodeId,
      'nodeName': mApprovalRecord.nodeName,
      'nodeLog': this.state.approvalContent,
      'master': mMaster,
      'result': false,
      'backTaskName': 'RECORDER',
      'attachs': '',
      '_noc': 1,
      'holdtime': 4311,
      // 'sessionId': mSessionId,
      // 'sessionUser': mEmcode,
    }, {
      // 'Cookie': 'JSESSIONID=' + mSessionId
    }).then(response => {
      message.success('单据不同意成功')
      Toast.hide()
      this.setState({
        loading: false,
        // finished: true,
        // finishMsg: '单据不同意成功',
        // finishSuccess: true,
        approvalStatus: 2,
      })
      if (mType == 0) {
        let { homeState: { receiveState: { tabIndex, itemIndex, listData, todoCount } } } = this.props
        if (tabIndex == 0 && !isObjEmpty(listData) && listData.length >
          itemIndex) {
          listData.splice(itemIndex, 1)
          saveReceiveState({
            listData,
            todoCount: todoCount > 0 ? todoCount - 1 : 0,
          })()
        }
      }
      this.loadNextProcess()
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
        // finished: true,
        // finishMsg: error.toString(),
        // finishSuccess: false
      })
    })
  }

  loadProcessUpdate = () => {
    mCachePoints = ''
    if (!this.inputAllPoints()) {
      Toast.hide()
      this.setState({
        loading: false,
      })
      return
    }

    mParams = []
    mFormStore = new Map()
    if (!this.inputAllInput()) {
      Toast.hide()
      this.setState({
        loading: false,
      })
      return
    }

    if (mFormStore.size <= 1 && isObjEmpty(mParams)) {
      this.approvalAgreeRequest()
      return
    }
    let formStoreJson = MapToJson(mFormStore)
    let paramsJson = strMapToObj(mParams)
    fetchGet(mBaseUrl + '/common/processUpdate.action', {
      'caller': mApprovalRecord.caller,
      'master': mMaster,
      'processInstanceId': mApprovalRecord.processInstanceId,
      'formStore': formStoreJson,
      'param': paramsJson,
    }, {
      // 'Cookie': 'JSESSIONID=' + mSessionId
    }).then(response => {
      this.approvalAgreeRequest()
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
      })
    })
  }

  //同意审批
  approvalAgreeRequest = () => {
    const { approvalContent } = this.state
    if (isObjNull(mCachePoints)) {
      mCachePoints = ''
    }
    let points = mCachePoints.replaceAll('@', '').
      replaceAll('\\@', '').
      replaceAll('\\\\@', '')

    fetchPost(mBaseUrl + '/common/review.action', {
      'taskId': mNodeId,
      'nodeName': mApprovalRecord.nodeName,
      'nodeLog': approvalContent,
      'result': true,
      'master': mMaster,
      'attachs': '',
      '_center': '0',
      '_noc': 1,
      'holdtime': 4311,
      'customDes': points,
      // 'sessionId': mSessionId,
      // 'sessionUser': mEmcode,
    }, {
      // 'Cookie': 'JSESSIONID=' + mSessionId
    }).then(response => {
      Toast.hide()
      message.success('单据审批成功')
      this.setState({
        loading: false,
        approvalStatus: 1,
      })
      if (mType == 0) {
        let { homeState: { receiveState: { tabIndex, itemIndex, listData, todoCount } } } = this.props
        if (tabIndex == 0 && !isObjEmpty(listData) && listData.length >
          itemIndex) {
          listData.splice(itemIndex, 1)
          saveReceiveState({
            listData,
            todoCount: todoCount > 0 ? todoCount - 1 : 0,
          })()
        }
      }
      this.judgeApprovers()
      // this.loadNextProcess()
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('请求异常')
      }
      this.setState({
        loading: false,
      })
    })
  }

  /**
   * 获取下一节点审批人
   */
  judgeApprovers = () => {
    Toast.loading('正在获取下一节点审批人', 0)
    fetchPost(mBaseUrl + '/uapproval/common/getMultiNodeAssigns.action', {
      caller: mApprovalRecord.caller,
      id: mApprovalRecord.id,
      master: mMaster,
    }).then(response => {
      Toast.hide()
      this.handlerNextStepoInstance(response)
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('下一节点审批人获取异常')
      }
      this.loadNextProcess()
    })
  }

  /**
   * 处理下一节点审批人数据
   */
  handlerNextStepoInstance = (response) => {
    if (!isObjEmpty(response.assigns)) {
      let assignArray = response.assigns
      let assignObj = assignArray[0]
      let nodeid = assignObj ? (assignObj.JP_NODEID || '') : ''
      let candidates = assignObj ? (assignObj.JP_CANDIDATES || []) : []
      if (!isObjEmpty(nodeid) && !isObjEmpty(candidates)) {
        let candidateList = []
        candidates.forEach(item => {
          let candidate = item
          candidate.nodeId = nodeid

          candidateList.push(candidate)
        })
        mModalList = candidateList
        this.setState({
          changeModalOpen: true,
          selectModel: {
            type: SELECT_APPROVAL,
            caption: '指定处理人',
          },
          changeDataSource: this.state.changeDataSource.cloneWithRows(
            mModalList),
        })
      } else {
        this.loadNextProcess()
      }
    } else {
      this.loadNextProcess()
    }
  }

  /**
   * 变更处理人
   * @param rowData
   */
  onChangeSelect = rowData => {
    if (!isObjNull(rowData)) {
      let selectChange = rowData

      Toast.loading('处理人指定中', 0)
      let params, url
      let isApproval = !isObjNull(selectChange.nodeId)
      if (isApproval) {
        url = '/common/takeOverTask.action'
        let deal = {
          em_code: selectChange.EM_CODE,
          nodeId: selectChange.nodeId,
        }
        params = {
          _noc: '1',
          master: mMaster,
          params: JSON.stringify(deal),
        }
      } else {
        url = '/common/setAssignee.action'
        params = {
          taskId: mNodeId,
          master: mMaster,
          assigneeId: selectChange.EM_CODE,
          processInstanceId: mApprovalRecord.processInstanceId,
          description: this.state.approvalContent,
          _center: 0,
          _noc: 1,
        }
      }
      fetchPost(mBaseUrl + url, params).
        then(response => {
          Toast.hide()
          if (isApproval) {
            this.loadNextProcess()
          } else if (response.result == true) {
            let nextnode = response.nextnode
            if (!isObjEmpty(nextnode) && nextnode != -1) {
              mNodeId = nextnode
              message.success('处理人指定成功')
              this.toNextNode()
            } else {
              message.success('处理人指定成功')
              this.setState({
                approvalStatus: 4,
              })
              if (mType == 0) {
                let { homeState: { receiveState: { tabIndex, itemIndex, listData, todoCount } } } = this.props
                if (tabIndex == 0 && !isObjEmpty(listData) &&
                  listData.length >
                  itemIndex) {
                  listData.splice(itemIndex, 1)
                  saveReceiveState({
                    listData,
                    todoCount: todoCount > 0 ? todoCount - 1 : 0,
                  })()
                }
                this.props.history.goBack()
              }
              message.warn('没有下一条待审批单据')
            }
          } else {
            message.error('指定处理人失败')
          }
        }).
        catch(error => {
          Toast.hide()
          if (typeof error === 'string') {
            message.error(error)
          } else {
            message.error('处理人指定异常')
          }
        })
    }

    this.setState({
      changeDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      changeModalOpen: false,
    })
  }

  /**
   * 跳转下一条待审批数据
   */
  toNextNode () {
    message.loading('跳转下一条审批单据', 1)
    this.props.history.replace('/approval/%7B%22' +
      'master%22%3A%22' + mMaster
      + '%22%2C%22nodeId%22%3A' + mNodeId
      + (mType === undefined ? '' : ('%2C%22type%22%3A' + mType))
      + '%2C%22baseUrl%22%3A%22' + encodeURIComponent(mBaseUrl)
      + '%22%7D')
    this.initPageState()
    this.getCurrentNode()
    if (mType == 0) {
      saveReceiveState({
        scrollTop: 0,
        listData: [],
        hasMore1: true,
        pageIndex: 1,
      })()
    }
    // else if (mType == 2) {
    //   clearSendState({
    //     searchKey: this.props.homeState.sendState
    //       ? ''
    //       : this.props.homeState.sendState.searchKey,
    //   })()
    // }
  }

  /**
   * 获取下一条审批数据
   */
  loadNextProcess = () => {
    Toast.loading('正在获取下一条审批单据', 0)
    fetchPost(mBaseUrl + '/common/getNextProcess.action', {
      taskId: mNodeId,
      master: mMaster,
      _noc: 1,
    }).then(response => {
      Toast.hide()
      let nextNode = getIntValue(response, 'nodeId')
      if (nextNode > 0) {
        mNodeId = nextNode
        this.toNextNode()
      } else {
        message.warn('没有下一条待审批单据')
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('审批单据获取失败')
      }
    })
  }

  inputAllInput = () => {
    const { mainList, detailList } = this.state

    let mainArray = []
    let detailsArray = []
    let details = []
    for (let i = 0; i < mainList.length; i++) {
      let approval = mainList[i]
      if (!isObjNull(approval) && approval.type == ApprovalBean.MAIN) {
        mainArray.push(approval)
      }
    }
    for (let i = 0; i < detailList.length; i++) {
      let approval = detailList[i]
      if (!isObjNull(approval) && approval.type == ApprovalBean.DETAIL) {
        details.push(approval)
        if ((detailList.length > i + 1) &&
          (detailList[i + 1].type != approval.type)) {
          detailsArray.push(details)
          details = []
        }
        if (i == detailList.length - 1) {
          detailsArray.push(details)
          details = []
        }
      }
    }
    let mainStore = this.putItem2Params(true, mainArray)
    if (isObjNull(mainStore)) {
      return false
    }
    mFormStore = new Map([...mFormStore, ...mainStore])

    for (let i = 0; i < detailsArray.length; i++) {
      let detailsObj = detailsArray[i]
      let param = this.putItem2Params(true, detailsObj)
      if (isObjNull(param)) {
        return false
      } else if (param.size > 1) {
        mParams.push(param)
      }
    }
    return true
  }

  putItem2Params = (showTocat, approvals) => {
    let formstore = new Map()
    if (isObjEmpty(approvals)) {
      return formstore
    }
    for (let i = 0; i < approvals.length; i++) {
      let approval = approvals[i]
      if (!isObjNull(approval)) {
        if (approval.neerInput) {
          if (isObjEmpty(approval.values)) {
            let msg = '必填字段  ' + approval.caption + '为必填项'
            if (showTocat) {
              message.error(msg)
            }
            return null
          } else {
            if (approval.values == ApprovalBean.VALUES_UNKNOWN) {
              formstore.set(approval.valuesKey, '1')//添加特殊字符判断
            } else {
              let isputed = false
              let datas = approval.datas
              if (!isObjNull(datas)) {
                for (let j = 0; j < datas.length; j++) {
                  let data = datas[j]
                  isputed = false
                  if (!isObjNull(data) && data.display == approval.values) {
                    formstore.set(approval.valuesKey,
                      isObjEmpty(data.value) ? approval.values : data.value)
                    isputed = true
                    break
                  }
                }
              }
              if (!isputed) {
                formstore.set(approval.valuesKey, approval.values)
              }
            }
          }
        }
        if (!isObjEmpty(approval.idKey) && approval.id > 0) {
          formstore.set(approval.idKey, approval.id)
        }
      }
    }
    return formstore
  }

  inputAllPoints = () => {
    const { pointsList } = this.state
    if (!isObjEmpty(pointsList)) {
      for (let i = 0; i < pointsList.length; i++) {
        let approval = pointsList[i]
        if (approval.mustInput && isObjEmpty(approval.values)) {
          let msg = '审批要点  ' + approval.caption + '  为必填项'
          message.error(msg)
          return false
        }
        if (!isObjEmpty(approval.caption)
          && !isObjEmpty(approval.values) && !isObjNull(mCachePoints)) {
          if (strContain(approval.values, '@')) {
            let msg = '审批要点  ' + approval.caption + '  带有特殊字符'
            message.error(msg)
            return false
          }
          if (approval.dfType == '@A') {
            mCachePoints += (approval.caption + '(' + approval.values + ')' +
              '@A@;')
          } else if (!isObjEmpty(approval.dfType) &&
            strContain(approval.dfType, '@')) {
            mCachePoints += (approval.caption + '(' + approval.values + ')' +
              approval.dfType + '@;')
          } else {
            mCachePoints += (approval.caption + '(' + approval.values + ');')
          }
        }
      }
      mCachePoints = mCachePoints.substring(0, mCachePoints.length - 1)
    }
    return true
  }

  approvalEdit = (e) => {
    this.setState({
      approvalContent: e.target.value,
    })
  }

  fastSelect = (index) => {
    const { approvalContent, fastList } = this.state
    this.setState({
      approvalContent: approvalContent + fastList[index],
      fastModalOpen: false,
    })
  }

  fastClick = () => {
    this.setState({
      fastModalOpen: true,
    })
  }

  fastModalClose = () => {
    this.setState({
      fastModalOpen: false,
    })
  }
}

let mapStateToProps = (state) => ({
  homeState: { ...state.redHomeState },
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Approval)
