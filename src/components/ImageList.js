import ImgFigure from './ImgFigure';
import React from 'react';

class ImageList extends React.Component {
    render () {
        return (
            <section className="img-sec">
                {
                    this.props.imagesList.map((image, index) =>
                        <ImgFigure key={'img' + index}
                                   {...image}
                                   onClick = {(e) => this.props.onImgClick(e, image)}/>
                    )
                }
            </section>
        )
    }
}

export default ImageList;
