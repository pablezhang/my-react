/** @jsx MyReact.createElement */

/*
  学习目标：let's get our own render function
*/

// React元素：大家熟知的虚拟dom

// 浏览器线程空闲时执行回调的工作流
// 每个element对应一个fiber，每个fiber是一个work unit
let nextUnitOfWork;
// 后台中待更新的root fiber节点
// 当没有下一个work unit，我们才将整个fiber tree插入DOM
// 💥react只通过一次操作dom，将全部虚拟dom更新到根节点上
let wipRoot;

// 对应已插入到dom中根节点，保存的fiber。
// 已插入的dom中根节点，为何还保存其fiber。
// React采用的是双缓存策略，需要保存根fiber，将来与根fiber直接进行比较。
let currentRoot;

// 由于将fiber tree插入DOM中是我们是从wipRoot开始，而其没有old fibers，所以需要数组保存我们需要删除的nodes
let deletions;

// TODO 后代中，待更新的fiber 💥💥？
let wipFiber;

// hooks记忆最新值，是根据调用顺序记忆
let hookIndex;

// let's stat do own createElement

/* 创建react元素 */
const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        // 区分创建文字元素 与 React元素
        return typeof child === 'object' ? child : createTextElement(child);
      })
    }
  };
};

/* 创建文本节点 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      // 对于文本节点, React实际不会创建children
      children: []
    }
  };
}
const render = (element, container) => {
  const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);

  // 把 element 的 props 分配给 node
  const isProperty = key => key !== 'children';
  Object.keys(element.props).filter(isProperty).forEach(pName => {
    dom[pName] = element.props[pName];
  });
  element.props.children.forEach(child => {
    MyReact.render(child, dom); // TODO：文字节点可以不进行递归
  });

  container.appendChild(dom);
};
const MyReact = {
  createElement,
  render
};
const divNode = MyReact.createElement("div", {
  id: "foo"
}, MyReact.createElement("a", null, "bar"), MyReact.createElement("b", null));
MyReact.render(divNode, document.querySelector('#root'));
