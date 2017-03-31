
const changeImg = (state, action) => {
    switch (action.type) {
        case 'CHANGE_IMG':
            if (state.id !== action.id) {
                return Object.assign({}, state, {
                    isCenter: false,
                    isInverse: false
                });
            }
            return Object.assign({}, state, {
                    isCenter: true
                });
        case 'INVERSE_IMG':
            if (state.id !== action.id) {
                return state;
            }
            return Object.assign({}, state, {
                    isInverse: !state.isInverse
                });
        default:
            return state;
    }
};

const changeImgs = (state, action) => {
    switch (action.type) {
        case 'CHANGE_IMG':
            return {
                        imgs: state.imgs.map(i => changeImg(i, action)),
                        reArrange: true
            };
        case 'INVERSE_IMG':
            return {
                        imgs: state.imgs.map(i => changeImg(i, action)),
                        reArrange: false
            };
        default:
            return state;
    }
};

export default changeImgs;
