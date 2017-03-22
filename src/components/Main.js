require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


//获取图片数据

let imageDatas = require('../data/imageDatas.json');
(function genImageURL(imageDatasArr) {
    for(let singleImageData of imageDatasArr){
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    }
})(imageDatas);






class AppComponent extends React.Component {
  render() {
    return (
        <section className="stage">
            <section className="img-sec">
            </section>
            <nav className="controller-nav">
            </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
