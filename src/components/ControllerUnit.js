import React from 'react';



class ControllerUnit extends React.Component {
    render () {
        let controllerUnitClassName = 'controller-unit';

        // 如果控制组件对应的图片居中
        if(this.props.isCenter) {
            controllerUnitClassName += ' is-center';

            // 如果居中图片对应的是翻转态
            if(this.props.isInverse) {
                controllerUnitClassName += ' is-inverse';
            }
        }

        return(
            <span className={controllerUnitClassName} onClick={this.props.onClick}></span>
        );
    }
}

export default ControllerUnit;
