import React from 'react';



class ImgFigure extends React.Component {
    render () {
        let styleObj = {};

        // console.log(this.props);

        //如果props属性中有位置，使用
        if(this.props.pos) {
            styleObj = this.props.pos;
        }

        //如果图片的旋转角度有值且不为0，添加旋转角度
        if(this.props.rotate) {
            let browsers = ['Webkit', 'Moz', 'O', 'ms', ''];
            for(let browser of browsers){
                styleObj[browser + 'Transform'] = 'rotate(' + this.props.rotate + 'deg)';
            }
        }

        //居中图片
        if(this.props.isCenter){
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.props.onClick}>
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.props.onClick}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

export default ImgFigure;
