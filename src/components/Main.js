require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

/*
 *
 * 获取区间内的随机值
 *
 *
 */

function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


//获取图片数据
let imageDatas = require('../data/imageDatas.json');
(function genImageURL(imageDatasArr) {
    for(let singleImageData of imageDatasArr){
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    }
})(imageDatas);

let ImgFigure = React.createClass({
    render: function() {

        let styleObj = {};

        //如果props属性中有位置，使用
        if(this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }



        return (
        <figure className="img-figure" style={styleObj}>
            <img src={this.props.data.imageURL}
                alt={this.props.data.title}
            />
            <figcaption>
                <h2 className="img-title">{this.props.data.title}</h2>
            </figcaption>
        </figure>
        );
    }
})




class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {imgsArrangeArr: []};
    }
    /*
     * 重新排布所有图片
     * @param centerIndex 指定居中图片
     *
     */
    rearrange (centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.props.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),   //取0-1个
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

            //居中图片
            imgsArrangeCenterArr[0].pos = centerPos;

            //取出上部图片状态信息
            topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

            //布局上部图片
            imgsArrangeTopArr.forEach((value, index) => {
                imgsArrangeTopArr[index].pos = {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                }
            })

            //布局左右两侧图片
            for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
                let hPosRangeLORR = null;

                //前半部分布局左边，后半部分布局右边
                if(i < k){
                    hPosRangeLORR = hPosRangeLeftSecX;
                }
                else{
                    hPosRangeLORR = hPosRangeRightSecX;
                }

                imgsArrangeArr[i].pos = {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORR[0], hPosRangeLORR[1])
                }
            }

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });


    }

    //组件加载后计算每张图片范围
    componentDidMount () {
        //舞台大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //imageFigure的大小
        let imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgDOM.scrollWidth,
            imgH = imgDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

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

        this.rearrange(0);
    }


    render() {
    let controllerUnits = [];
    let imgFigures = [];

    imageDatas.forEach((value, index) => {
        if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
                pos: {
                    left: 0,
                    right: 0
                }
            }
        }

        imgFigures.push(<ImgFigure key={'img' + index} ref={'imgFigure' + index} data={value} arrange = {this.state.imgsArrangeArr[index]}/>);
    });

    return (
        <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className="controller-nav">
                {controllerUnits}
            </nav>
        </section>
    );
    }
}

AppComponent.defaultProps = {
    Constant: {
        centerPos: {
            left: 0,
            right: 0
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
