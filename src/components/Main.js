require('normalize.css/normalize.css');
require('styles/App.css');

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import changeImgs from '../reducers/changeImg';
import App from './App';
import { changeImg } from '../actions'

import React from 'react';
import ReactDOM from 'react-dom';

const imageDatas = require('../data/imageDatas.json');

let initState = {
    imgs: (() => {
            let arr = [];
            for (let i = 0; i < imageDatas.length; i++) {
                arr.push({
                    id: i,
                    isCenter: false,
                    isInverse: false
                });
            }
            return arr;
    })(),
    reArrange: true
}

let store = createStore(changeImgs, initState);

class AppComponent extends React.Component {

    //组件加载后计算每张图片范围
    componentDidMount () {
        //舞台大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);

        //imageFigure的大小
        let imgDOM = stageDOM.children[0].children[0],
            imgW = imgDOM.scrollWidth,
            imgH = imgDOM.scrollHeight,
            halfImgW = Math.floor(imgW / 2),
            halfImgH = Math.floor(imgH / 2);

        //计算中心图片位置
        this.props.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        //左右两侧区域图片位置范围
        this.props.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.props.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.props.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.props.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.props.Constant.hPosRange.y[0] = -halfImgH;
        this.props.Constant.hPosRange.y[1] = stageH - halfImgH;

        //上部区域图片位置范围
        this.props.Constant.vPosRange.topY[0] = -halfImgH;
        this.props.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.props.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.props.Constant.vPosRange.x[1] = halfStageW;

        store.dispatch(changeImg(0));
    }

    render () {
        return (
            <Provider store = {store}>
                <App ref = 'stage' Constant = {this.props.Constant}/>
            </Provider>
        )
    }
}

AppComponent.defaultProps = {
    Constant: {
        centerPos: {
            left: 0,
            top: 0
        },
        hPosRange: {        //水平方向取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {        //垂直方向取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    }
};

export default AppComponent;
