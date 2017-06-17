import weplus from '../../weplus/index'

class ButtonGroup extends weplus.Component {
    constructor() {
        super();
        this.text1 = 't1';
        this.text2 = 't2';
    }

    get NAME() {
        return 'ButtonGroup';
    }

    onTapBtn1() {
        console.log(this.text1);
    }

    onTapBtn2() {
        console.log(this.text2);
    }
}

// const ButtonGroup = {
//     name: 'buttonGroup',
//     text1: 't1',
//     text2: 't2',
//     onTapBtn1() {
//         console.log(this.text1);
//     },
//     onTapBtn2() {
//         console.log(this.text2);
//     }
// }

export { ButtonGroup }