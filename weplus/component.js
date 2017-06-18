
class Component {
    constructor(name = this.name, id = '') {
        this._name = name;
        this._id = id;
    }

    // 组件名称
    get NAME() {
        return this._name;
    }

    // 同类型组件实例的唯一标识
    get ID() {
        return this._id;
    }

    // 组件方法前缀
    get UNIQUE_NAME() {
        if (this.ID) {
            return `${this.NAME}_${this.ID}`;
        } else {
            return `${this.NAME}`;
        }
    }

    setState(obj) {
        const curPages = getCurrentPages();
        const curPage = curPages[curPages.length - 1];
        Reflect.ownKeys(obj).forEach(key => {
            // TODO：多层嵌套时需要优化
            this[key] = obj[key];
        });
        curPage.setData({
            [this.UNIQUE_NAME]: obj
        });
    }
}

export { Component }