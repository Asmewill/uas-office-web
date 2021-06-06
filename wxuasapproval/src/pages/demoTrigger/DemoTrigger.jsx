import React, { Component } from 'react';
import './demoTrigger.css';
import { Modal, WingBlank } from 'antd-mobile';
import { Icon, Table } from 'antd';
import { fetchPost, fetchGet } from '../../utils/fetchRequest'

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

export default class demotrigger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            dataSource: [],
            columns: [],
        };
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });

        this.getdata();
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    getdata = () => {
        fetchPost('http://218.17.253.75:9443/uas_dev/common/dbfind.action', {
            caller: 'MaterialLackForWCPlan',
            field: 'ma_salecode',
            condition: '1=1',
            ob: '',
            page: 1,
            pageSize: 14,
            _config: null,
            which: 'form'
        }).then(response => {
            let columns = response.columns;
            let dataSource = JSON.parse(response.data);
            columns = JSON.parse(JSON.stringify(columns).replace(/header/g, "title"));
            columns = JSON.parse(JSON.stringify(columns).replace(/text/g, "key"));
            columns.forEach(item => {
                item.width = 100;
            })
            this.setState({
                dataSource: dataSource,
                columns: columns
            })
        }).catch(error => {
            console.log(error)
        })
    }
    onClickRow = (record) => {
        return {
            onClick: () => {
                let trigger = document.getElementById('triggerInput');
                trigger.setAttribute('value', record.sa_code);
                this.setState({
                    modal: false
                })
            }
        }
    }



    render() {
        const { dataSource, columns } = this.state;
        return (
            <WingBlank>
                <div className="triggerBox">
                    <div className="inputBox"><input id="triggerInput" style={{ height: 32 }} type="text" /></div>
                    <div className="iconBox"><Icon className="triggerIcon" type="search" onClick={this.showModal('modal')} /></div>
                </div>
                <div>
                </div>
                <Modal
                    onClose={this.onClose('modal')}
                    popup
                    visible={this.state.modal}
                    animationType="slide-up"
                >
                    <Table scroll={{ x: 1000, y: 300 }} onRow={this.onClickRow} dataSource={dataSource} columns={columns} />
                </Modal>
            </WingBlank>
        );
    }
}