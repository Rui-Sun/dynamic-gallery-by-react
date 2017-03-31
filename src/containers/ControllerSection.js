import { connect } from 'react-redux';
import { changeImg } from '../actions';
import { inverseImg } from '../actions';
import ControList from '../components/ControList';





const mapStateToProps = (state) => {
    let controList = [];
    for (let img of state.imgs) {
        controList.push({
            id: img.id,
            isCenter: img.isCenter,
            isInverse: img.isInverse
        })
    }
    return {
        controList: controList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onControClick: (contro) => {
            if (!contro.isCenter) {
                dispatch(changeImg(contro.id));
            }
            else {
                dispatch(inverseImg(contro.id));
            }

        }
    };
};

const ControllerSection = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControList);

export default ControllerSection;
