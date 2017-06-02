
class Page {
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
                const isPrivateMethods = /^(_|\$)/.test(key);
                return !isLifeCycleMethods && !isPrivateMethods;
            }).forEach(key => {
                if (!this.hasOwnProperty(key)) {
                    this[key] = curPrototype[key]
                }
            });
            curPrototype = Reflect.getPrototypeOf(curPrototype);
        }
    }
}

export { Page }