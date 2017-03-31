require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

/*
 * 获取区间内的随机值
 *
 */

function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/*
 *
 * 获取0-30度之间的一个正负值
 *
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30);
}


//获取图片数据
const imageDatas = require('../data/imageDatas.json');
(function genImageURL(imageDatasArr) {
    for(let singleImageData of imageDatasArr){
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    }
})(imageDatas);

// 图片组件
const ImgFigure = React.createClass({
    /*
     * imgFigure的点击处理函数
     *
     */
    handleClick:  function (e) {

        if(this.props.arrange.isCenter) {
            this.props.inverse();
        }
        else{
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render: function() {
        let styleObj = {};

        //如果props属性中有位置，使用
        if(this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值且不为0，添加旋转角度
        if(this.props.arrange.rotate) {
            let browsers = ['Webkit', 'Moz', 'O', 'ms', ''];
            for(let browser of browsers){
                styleObj[browser + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }
        }

        //居中图片
        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
            <img src={this.props.data.imageURL}
                alt={this.props.data.title}
            />
            <figcaption>
                <h2 className="img-title">{this.props.data.title}</h2>
                <div className="img-back" onClick={this.handleClick}>
                    <p>{this.props.data.desc}</p>
                </div>
            </figcaption>
        </figure>
        );
    }
})

// 控制组件
const ControllerUnit = React.createClass({
    handleClick: function (e) {

        //点击居中图片对应按钮，翻转；点击非居中图片，图片居中
        if(this.props.arrange.isCenter) {
            this.props.inverse();
        }
        else{
            this.props.center();
        }

        e.preventDefault;
        e.stopPropagation;
    },
    render: function () {
        let controllerUnitClassName = 'controller-unit';

        // 如果控制组件对应的图片居中
        if(this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center';

            // 如果居中图片对应的是翻转态
            if(this.props.arrange.isInverse) {
                controllerUnitClassName += ' is-inverse';
            }
        }

        return(
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
})



class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {imgsArrangeArr: [
            /*{
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,  //图片旋转角度
                isInverse: false,   //图片正反面（false反面）
                isCenter: false     // 图片是否居中
            }*/
        ]};
    }

    /*
     * 翻转图片
     * @parm index 被执行翻转的图片对应的数组序号
     * @return {Function} 闭包函数，return一个待执行函数
     */
    inverse (index) {
        return () => {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }
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

            //居中图片(不旋转)
            imgsArrangeCenterArr[0] = {
                pos: centerPos,
                rotate: 0,
                isCenter: true
            }

            //取出上部图片状态信息
            topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

            //布局上部图片
            imgsArrangeTopArr.forEach((value, index) => {
                imgsArrangeTopArr[index] = {
                    pos: {
                        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                }
            });

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

                imgsArrangeArr[i] = {
                    pos: {
                        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORR[0], hPosRangeLORR[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
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

    /*
     * 利用rearrange方法居中图片
     * @param index，需要被居中的图片对应图片信息数组的index
     * @return {Function} 闭包函数
     */
    center (index) {
        return () => {
            this.rearrange(index);
        }
    }

    //组件加载后计算每张图片范围
    componentDidMount () {
        //舞台大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);

        //imageFigure的大小
        let imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
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
                },
                rotate: 0,
                isInverse: false,
                isCenter: false
            }
        }

        imgFigures.push(<ImgFigure key={'img' + index}
                                   ref={'imgFigure' + index}
                                   data={value}
                                   arrange = {this.state.imgsArrangeArr[index]}
                                   inverse = {this.inverse(index)}
                                   center = {this.center(index)}
                        />);
        controllerUnits.push(<ControllerUnit key={'ctr' + index}
                                             arrange = {this.state.imgsArrangeArr[index]}
                                             inverse = {this.inverse(index)}
                                             center = {this.center(index)}
                            />);
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
