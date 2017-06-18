import { utils } from './utils'

class Page {
    constructor() {
        this._components = [];
    }

    onLoad(ChildPage) {
        const wxPage = this;

        // 重建原型链 
        // this                               WXPage
        //      -> ChildPage -> ... -> Page ->
        const originPrototype = Reflect.getPrototypeOf(wxPage);
        Reflect.setPrototypeOf(wxPage, ChildPage.prototype);    
        Reflect.setPrototypeOf(Page.prototype, originPrototype)

        // 拷贝原型方法到运行时 Page 实例对象，以便 wxml 事件绑定可以找到对应函数
        let curPrototype = ChildPage.prototype;
        while (curPrototype !== originPrototype) {
            Reflect.ownKeys(curPrototype).filter(key => {
                const isLifeCycleMethods = ['constructor', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'].indexOf(key) !== -1;
                const isPublicMethods = /^[a-zA-Z]/.test(key);
                return !isLifeCycleMethods && isPublicMethods;
            }).forEach(key => {
                if (!wxPage.hasOwnProperty(key)) {
                    wxPage[key] = curPrototype[key]
                } else {
                    utils.error(`duplicate key! ${curPrototype.constructor.name}.${key} has defined in page({...})`);
                }
            });
            curPrototype = Reflect.getPrototypeOf(curPrototype);
        }

        // 处理组件
        wxPage._components.forEach(component => {
            // Copy component methods to runtime page. 
            // Rename the component method to avoid name conflict.
            const proto = Reflect.getPrototypeOf(component);
            Object.getOwnPropertyNames(proto).forEach(methodName => {
                if (typeof proto[methodName] === 'function') {
                    const methodNameInPage = component.NAME + '_' + methodName;
                    if (!wxPage[methodNameInPage]) {
                        wxPage[methodNameInPage] = event => {
                            const id = event.target.dataset.id;
                            const targetComponent = wxPage._components.find(c => {
                                return component.NAME === c.NAME && (id === undefined || c.ID === id)
                            });
                            if (targetComponent ) {
                                proto[methodName].apply(targetComponent , arguments);
                            }
                        }
                    }
                }
            });

            // 将组件实例复制到 Page#data 下
            // 传入组件实例，组件事件响应函数中修改组件状态
            this.setData({ [component.UNIQUE_NAME]:  component});
        });

    }

    registerComponent(component) {
        this._components.push(component);
    }
}

export { Page }