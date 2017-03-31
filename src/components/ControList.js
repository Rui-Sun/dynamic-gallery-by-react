import React from 'react';
import ControllerUnit from './ControllerUnit';

class ControList extends React.Component {
    render () {
        return (
            <nav className="controller-nav">
                {
                    this.props.controList.map((contro, index) =>
                        <ControllerUnit key={'ctr' + index}
                                        {...contro}
                                        onClick = {() => this.props.onControClick(contro)}/>
                    )
                }
            </nav>
        )
    }
}

export default ControList;
