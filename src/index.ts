/*
  学习目标：实现MyReact, 包含render, useState, createElement三个方法
*/

interface IMyReact {
  // Reconciler（协调器）中的render，非ReactDOM中的render, 
  render(element: IMyReactELement, container: HTMLElement): void
  createElement: (type: any, props: any, ...children: any[]) => {
    type: any;
    props: any;
  };
  useState: <T>(initValue: T) => [T, (newValue: T) => void]
}

// React元素：大家熟知的虚拟dom
interface IMyReactELement<P=any> {
  // html标签可以接收的标签属性
  props: P,
  // TODO: 后续支持React组件类型 
  // 元素的类型，暂时只支持tag name，
  type:  keyof HTMLElementTagNameMap
}


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


