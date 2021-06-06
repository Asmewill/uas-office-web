import React, {Component} from 'react'
import './approvalNode.css'
import {Icon} from 'semantic-ui-react'
import {Avatar} from 'antd'
import {isObjEmpty, getParenthesesStr} from "../../../../../utils/common/common.util";


export default class ApprovalNode extends Component {

    render() {
        let approval = this.props.approval
        let idKey = approval.idKey
        let iconColor = 'blue'
        let stateColor = '#999999'
        let status = ''
        if (!isObjEmpty(idKey)) {
            if (idKey.startWith('待审批')) {
                stateColor = '#3BAE7E'
                iconColor = 'blue'
                status = '等待审批'
            } else if (idKey.startWith('未通过') || idKey.startWith('结束') || idKey.startWith('不同意')) {
                stateColor = '#999999'
                iconColor = 'grey'
                status = '不同意'
            } else if (idKey.startWith('已审批') || idKey.startWith('变更') || idKey.startWith('同意')) {
                stateColor = '#999999'
                iconColor = 'grey'
                status = '已审批'
            }
        }

        return <div className='parent'>
            <div className='dateLayout'>
                <div className='dateItem'>{isObjEmpty(approval.values) ? '' : approval.values}</div>
                <div className='dateItem'>{isObjEmpty(approval.dbFind) ? '' : approval.dbFind}</div>
            </div>
            <div className='arrowLayout'>
                <div className={this.props.isFirst ? 'noLine' : 'arrowLine'}></div>
                <Icon color={iconColor} name='chevron circle up' style={{margin: '0px', padding: '0px'}}/>
                <div className={this.props.isLast ? 'noLine' : 'arrowLine'}></div>
            </div>
            <Avatar shape="square" src={require('../../../../../res/img/default_header.png')} className='headerImg'/>
            <div className='contentLayout'>
                <div className='nameItem'>{approval.caption}</div>
                <div className='opinionItem'>{isObjEmpty(idKey) ? '' : getParenthesesStr(idKey)}</div>
            </div>
            <div className='stateItem' style={{color: stateColor}}>{status}</div>
        </div>
    }
}
