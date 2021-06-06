import React, { Component } from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label
} from "bizcharts";
import DataSet from "@antv/data-set";
import './workSummary.css';
import { Avatar, message, Spin } from 'antd';
import { List } from 'antd-mobile';
import { fetchPost, fetchGet } from '../../utils/fetchRequest'
import {
    isObjNull, strContain, isObjEmpty, isEmptyObject, getStrValue,
} from '@/utils/common'
const Item = List.Item;

let EMCODE, EMNAME, RANGETIME, DURATION, ADDCOUNT, COMMITCOUNT, AUDITCOUNT, dataLength;
let MODELLIST = [];
let columnWidth = 300;
let mBaseUrl = window.location.origin + '/office';

export default class Basic extends Component {
    constructor() {
        super()

        this.state = {
            loading: true   //更改
        }
    }
    componentWillMount() {
        document.title = '个人一周小结';
        let messobj = this.getUrlData();
        if (!isObjEmpty(messobj)) {
            try {
                let emCode = decodeURIComponent(messobj.emcode);
                let instanceId = decodeURIComponent(messobj.instanceId);
                this.getData(emCode, instanceId);
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

    getUrlData() {
        let url = window.location.href;  //url中?之后的部分
        url = decodeURIComponent(url)
        url = this.getCaption(url);
        let dataObj = {};
        if (url.indexOf('&') > -1) {
            url = url.split('&');
            for (let i = 0; i < url.length; i++) {
                let arr = url[i].split('=');
                dataObj[arr[0]] = arr[1];
            }
        } else {
            url = url.split('=');
            dataObj[url[0]] = url[1];
        }
        return dataObj;
    }

    getCaption(obj) {     //拿到？后的值
        var index = obj.lastIndexOf("\?");
        obj = obj.substring(index + 1, obj.length);
        return obj;
    }
    getData = (emCode, instanceId) => {
        fetchPost(mBaseUrl+'/api/analysis/getAnalysisByPerson', {
            'emCode': emCode,
            'instanceid': instanceId
        }, {
            // 'Cookie': 'JSESSIONID=' + mSessionId,
            // "Content-Type": "application/json; charset=UTF-8"
        }).then((response) => {
            if (response.success) {
                let dataSource = response.data;
                EMCODE = dataSource.EMCODE;
                EMNAME = dataSource.EMNAME;
                RANGETIME = dataSource.RANGETIME;
                DURATION = dataSource.DURATION;
                ADDCOUNT = dataSource.ADDCOUNT;
                COMMITCOUNT = dataSource.COMMITCOUNT;
                AUDITCOUNT = dataSource.AUDITCOUNT;
                MODELLIST = dataSource.MODELLIST;
                dataLength = MODELLIST.length;
                if (dataLength > 0) {
                    columnWidth = dataLength * 38;
                } else {
                    columnWidth = 300
                }
                this.setState({
                    loading: false
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    mToStr(m) {               //分钟转化小时
        let h = Math.floor(m / 60);
        m -= h * 60;
        return (h ? h + '小时' : '') + (m ? m + '分' : '')
    }

    render() {
        const { loading } = this.state;
        const ds = new DataSet();
        const dv = ds.createView().source(MODELLIST);
        dv.source(MODELLIST).transform({
            type: "sort",
            callback(a, b) {
                // 排序依据，和原生js的排序callback一致
                return a.DURATION - b.DURATION;
            }
        });

        return (
            <div className=" workSummaryRoot">
                <Spin size="large"
                    style={{ display: loading ? 'flex' : 'none' }}
                    tip='数据请求中...'>
                </Spin>
                <div style={{ display: loading ? 'none' : 'flex' }} className='content'>
                    <div className='selfMess'>
                        <Avatar size={42} src={require('@/images/default_header.png')} />
                        <div className='self'>
                            <p className='name'>{EMNAME}</p>
                            <p className='summary'>一周小结 {RANGETIME}</p>
                        </div>
                    </div>
                    <div className='workSummary'>
                        <p className='workTitle'>工作小结</p>
                        <List className="my-list">
                            <Item extra={this.mToStr(DURATION)}>累计在线时长：</Item>
                            <Item extra={ADDCOUNT + ' 项'}>累计新增单据：</Item>
                            <Item extra={COMMITCOUNT + ' 项'}>累计提交单据：</Item>
                            <Item extra={AUDITCOUNT + ' 项'}>累计处理审批：</Item>
                        </List>
                    </div>
                    <div className='columnCharts'>
                        <div className='useTime'>各模块使用情况</div>
                        <Chart
                            padding={['auto', '20%', 'auto', 'auto']} height={columnWidth} data={dv} forceFit>
                            <Coord transpose />
                            <Axis
                                name="MODELNAME"
                                label={{
                                    textStyle: {
                                        textAlign: 'end', // 文本对齐方向，可取值为： start center end
                                        fill: '#000',
                                        fontSize: '14'
                                    }
                                }}
                            />
                            <Axis grid={null} name="DURATION" label={null} />
                            <Tooltip />
                            <Geom
                                color={['MODELNAME', ['#4682B4']]}
                                tooltip={['MODELNAME*DURATION', (text, num) => {
                                    return {
                                        name: '使用时间',
                                        value: num
                                    };
                                }]}
                                type="interval" position="MODELNAME*DURATION" >
                                <Label label={{
                                    textStyle: {
                                        fill: '#000',
                                        fontSize: '14'
                                    }
                                }}
                                    formatter={(text, item, index) => {
                                        return this.mToStr(text)
                                    }}
                                    offset={5} content="DURATION" />
                            </Geom>
                        </Chart>
                    </div>
                </div>
            </div>
        );
    }
}

