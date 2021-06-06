/**
 * Created by Arison on 2018/10/25.
 */
import React from 'react';
import {strContain} from "../../utils/common";
import {Icon} from 'semantic-ui-react'
import './bindPhone.css'

/**
 * Created by  on 2018/10/25.
 */
class BindResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bindSuccess: true,
            bindResult: '',
        }
    }

    componentWillMount() {
        document.title = '绑定结果'
        let result = this.props.match.params.result
        console.log(result)
        if (strContain(result, '绑定成功')) {
            this.setState({
                bindSuccess: true,
                bindResult: result,
            })
        } else if (strContain(result, '绑定失败')) {
            this.setState({
                bindSuccess: false,
                bindResult: result,
            })
        }
    }

    componentDidMount() {

    }

    render() {
        const {bindSuccess, bindResult} = this.state
        return <div className='finishedLayout'>
            <Icon name={bindSuccess ? 'check circle' : 'warning circle'} size='huge'
                  color={bindSuccess ? 'green' : 'red'}/>
            <div style={{
                width: '80%',
                marginTop: '10px',
                textAlign: 'center',
                color: bindSuccess ? 'green' : 'red',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                wordBreak: 'normal'
            }}>{decodeURIComponent(bindResult)}</div>
        </div>
    }
}

export default BindResult;