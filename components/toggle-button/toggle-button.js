import weplus from '../../weplus/index'

class ToggleButton extends weplus.Component {
    constructor(name, id) {
        super(name, id);
        this.text = 'ON';
    }

    onTap() {
        if (this.text === 'ON') {
            this.setState({
                text: 'OFF'
            })
        } else {
            this.setState({
                text: 'ON'
            })
        }
    }
}

export {ToggleButton}