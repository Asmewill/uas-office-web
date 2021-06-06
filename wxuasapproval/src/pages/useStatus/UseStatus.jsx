import React, { Component } from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label
} from "bizcharts";
import { message, Spin, Icon } from 'antd'
import DataSet from "@antv/data-set";
import './useStatus.css';
import { fetchPost, fetchGet } from '../../utils/fetchRequest';
import {
    isObjEmpty
} from '@/utils/common'

let DEPART, USERCOUNT, dataLength;
let DURATIONLIST = [];
let DAILYCOUNT = [];
let columnWidth = 300;
let mBaseUrl = window.location.origin + '/office';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1029568_7tx8nc4c0ts.js',
});

export default class Basic extends Component {
    constructor() {
        super()

        this.state = {
            loading: true    //更改
        }
    }

    componentWillMount() {
        document.title = '部门成员使用情况'
        let instanceId = this.props.match.params.instanceId;
        if (!isObjEmpty(instanceId)) {
            try {
                this.getData(instanceId);
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
    getData = (instanceId) => {
        fetchPost(mBaseUrl+'/api/analysis/getAnalysisByWeek', {
            'instanceid': instanceId,
        }, {
            // 'Cookie': 'JSESSIONID=' + mSessionId,
            // "Content-Type": "application/json; charset=UTF-8"
        }).then((response) => {
            if (response.success) {
                if(response.data.length==0){
                    message.error('获取数据失败');
                    this.setState({
                        loading: false,
                    })
                }
                let dataSource = response.data[0];
                DEPART = dataSource.DEPART;
                USERCOUNT = dataSource.USERCOUNT;
                DURATIONLIST = dataSource.DURATIONLIST;
                DAILYCOUNT = dataSource.DAILYCOUNT;
                dataLength = DURATIONLIST.length;
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
    handleClick = e => {
        if (e.data) {
            let emcode = e.data.point.EMCODE;
            let instanceId = this.props.match.params.instanceId;
            emcode = encodeURIComponent(emcode);
            instanceId = encodeURIComponent(instanceId);
            this.props.history.push('/worksummary?emcode=' + emcode + '&instanceId=' + instanceId)
        } else {
            return false;
        }
    }

    mToStr(m) {               //分钟转化小时
        let h = Math.floor(m / 60);
        m -= h * 60;
        return (h ? h + '小时' : '') + (m ? m + '分' : '')
    }

    render() {
        const { loading } = this.state;
        const cols = {
            EMCOUNT: {
                min: 0
            },
            DATE_TIME: {
                range: [0, 1]
            }
        };
        const ds = new DataSet();
        const dv = ds.createView().source(DURATIONLIST);
        dv.source(DURATIONLIST).transform({
            type: "sort",
            callback(a, b) {
                // 排序依据，和原生js的排序callback一致
                return a.DURATION - b.DURATION;
            }
        });
        return (
            <div className="useStatusRoot" >
                <Spin size="large"
                    style={{ display: loading ? 'flex' : 'none' }}
                    tip='数据请求中...'>
                </Spin>
                <div style={{ display: loading ? 'none' : 'flex' }} className='content'>
                    <div className='branch'><IconFont type="icon-bumenguanli" />  {DEPART}</div>
                    <div className="numBox">
                        <div className='useNum'>使用人数{USERCOUNT}人</div>
                        <div className="iconBox"><IconFont type="icon-xitongyunweibumen" /></div>
                    </div>
                    <div className='lineCharts'>
                        <Chart padding={['15%', '12%', '15%', '8%']} height={200} data={DAILYCOUNT} scale={cols} forceFit>
                            <Axis
                                name="DATE_TIME"
                                label={{
                                    offset: 18,
                                    textStyle: {
                                        fontSize: '14',
                                        fill: '#000'
                                    }
                                }} />
                            <Axis
                                name="EMCOUNT"
                                position="right"
                                label={{
                                    offset: 10,
                                    textStyle: {
                                        fontSize: '14',
                                        fill: '#000'
                                    }
                                }}
                            />
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom
                                color={['EMCOUNT', ['#4682B4']]}
                                tooltip={['DATE_TIME*EMCOUNT', (text, num) => {
                                    return {
                                        name: '使用人数',
                                        value: num
                                    };
                                }]}
                                shape="smooth" type="line" position="DATE_TIME*EMCOUNT" size={2}
                            />
                            <Geom
                                color={['EMCOUNT', ['#4682B4']]}
                                type="point"
                                position="DATE_TIME*EMCOUNT"
                                size={4}
                                shape={"circle"}
                                style={{
                                    stroke: "#fff",
                                    lineWidth: 1
                                }}
                            />
                        </Chart>
                    </div>
                    <div className='columnCharts'>
                        <div className='useTime'>成员使用时间</div>
                        <Chart
                            onPlotClick={this.handleClick}
                            padding={['auto', '20%', 'auto', '20%']}
                            height={columnWidth}
                            data={dv}
                            forceFit
                        >
                            <Coord transpose />
                            <Axis
                                name="EMNAME"
                                label={{
                                    offset: 10,
                                    textStyle: {
                                        fontSize: '14',
                                        fill: '#000'
                                    }
                                }}
                            />
                            <Axis grid={null} name="DURATION" label={null} />
                            <Geom
                                color={['EMNAME', ['#4682B4']]}
                                type="interval" position="EMNAME*DURATION" >
                                <Label
                                    offset={5}
                                    content="DURATION"
                                    formatter={(text, item, index) => {
                                        return this.mToStr(text)
                                    }}
                                    textStyle={{
                                        fill: '#000', // 文本的颜色
                                        fontSize: '14', // 文本大小
                                    }} />
                            </Geom>
                        </Chart>
                    </div>
                </div>
            </div >
        );
    }
}

