
class Page {
    constructor() {
        this._components = [];
    }

    onLoad(ChildPage) {
        // 重建原型链 
        const originPrototype = Reflect.getPrototypeOf(this);
        Reflect.setPrototypeOf(this, ChildPage.prototype);    
        Reflect.setPrototypeOf(Page.prototype, originPrototype)

        // 拷贝原型方法到运行时 Page 实例对象，以便 wxml 事件绑定可以找到对应函数
        let curPrototype = ChildPage.prototype;
        while (curPrototype !== originPrototype) {
            Reflect.ownKeys(curPrototype).filter(key => {
                const isLifeCycleMethods = ['constructor', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'].indexOf(key) !== -1;
                const isPublicMethods = /^[a-zA-Z]/.test(key);
                return !isLifeCycleMethods && isPublicMethods;
            }).forEach(key => {
                if (!this.hasOwnProperty(key)) {
                    this[key] = curPrototype[key]
                }
            });
            curPrototype = Reflect.getPrototypeOf(curPrototype);
        }

        // 处理组件
        this._components.forEach(component => {
            // 组件方法复制一份到当前 Page 对象（wxml中只能调用 Page 对象自身定义的方法）
            const proto = Reflect.getPrototypeOf(component);
            Object.getOwnPropertyNames(proto).forEach(key => {
                if (typeof proto[key] === 'function') {
                    this[key] = function () {
                        proto[key].apply(component, arguments);
                    }
                }
            });

            // 将组件实例复制到 Page#data 下
            const componentOwnProps = Object.assign(Object.create(null), component);
            this.setData({ [component.NAME]:  componentOwnProps});
        });

    }

    registerComponent(component) {
        this._components.push(component);
    }
}

export { Page }