import React from 'react';
import ImageSection from '../containers/ImageSection';
import ControllerSection from '../containers/ControllerSection';


class App extends React.Component {

    render () {
        return (
            <section ref = 'stage' className = 'stage'>
                <ImageSection constant = {this.props.Constant}/>
                <ControllerSection />
            </section>
        )
    }
}

export default App;
