import { connect } from 'react-redux';
import { changeImg } from '../actions';
import { inverseImg } from '../actions';
import ImageList from '../components/ImageList';

const imageDatas = require('../data/imageDatas.json');

(function genImageURL(imageDatasArr) {
    for(let singleImageData of imageDatasArr){
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    }
})(imageDatas);

let imageList = [];

for (let image of imageDatas) {
    imageList.push({
        id: 0,
        pos: {},
        rotate: 0,
        isInverse: false,
        isCenter: false,
        data: image
    });
}

/*
 * 获取区间内的随机值
 */
function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/*
 * 获取0-30度之间的一个正负值
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30);
}



const mapStateToProps = (state, ownProps) => {
    let imagesList = [];
    for (let img of imageList) {
        imagesList.push(img);
    }

    if (!state.reArrange) {
        for (let [key, img] of state.imgs.entries()){
            imagesList[key].isInverse = img.isInverse;
        }
        return {imagesList: imagesList};
    }
    else {
        let centerIndex = 0;
        for (let [key, img] of state.imgs.entries()){
                imagesList[key].id = img.id;
                imagesList[key].isCenter = img.isCenter;
                imagesList[key].isInverse = img.isInverse;
                if (imagesList[key].isCenter) {
                    centerIndex = key;
                }
        }
        let Constant = ownProps.constant,
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

            imgsArrangeCenterArr = imagesList.splice(centerIndex, 1);

            //居中图片(不旋转)
            imgsArrangeCenterArr[0].pos = centerPos;
            imgsArrangeCenterArr[0].rotate = 0;

            //取出上部图片状态信息
            topImgSpliceIndex = Math.floor(Math.random() * (imagesList.length - topImgNum));
            imgsArrangeTopArr = imagesList.splice(topImgSpliceIndex, topImgNum);

            //布局上部图片
            imgsArrangeTopArr.forEach((value, index) => {
                imgsArrangeTopArr[index].pos = {
                        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                };
                imgsArrangeTopArr[index].rotate = get30DegRandom();
            });

            //布局左右两侧图片
            for(let i = 0, j = imagesList.length, k = j / 2; i < j; i++){
                let hPosRangeLORR = null;

                //前半部分布局左边，后半部分布局右边
                if(i < k){
                    hPosRangeLORR = hPosRangeLeftSecX;
                }
                else{
                    hPosRangeLORR = hPosRangeRightSecX;
                }

                imagesList[i].pos = {
                        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORR[0], hPosRangeLORR[1])
                };
                imagesList[i].rotate= get30DegRandom();

            }

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imagesList.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imagesList.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

            return {imagesList: imagesList};
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onImgClick: (e, image) => {
            e.stopPropagation();
            if (!image.isCenter) {
                dispatch(changeImg(image.id));
            }
            else {
                dispatch(inverseImg(image.id));
            }

        }
    };
};

const ImageSection = connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageList);

export default ImageSection;
