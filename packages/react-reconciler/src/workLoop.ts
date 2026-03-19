import { FiberNode } from './fiber';
import { completeWork } from './completeWork';
import { beginWork } from './beginWork';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
  // 初始化
  prepareFreshStack(root);

  do{
    try {
      workLoop();
      break;
    } catch (e) {
      console.warn("workLoop 发生错误", e);
      workInProgress = null;
      
    } while (true);
  }
}

function workLoop() {
  while (workInProgress!==null) {
    performUnitOfWork(workInProgress);
  }
}

// 有子节点，遍历子节点
function performUnitOfWork(fiber: FiberNode) {
  const next =  beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  // 已经递归到最底层，没有子节点了
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

// 无子节点，遍历兄弟节点
function completeUnitOfWork(fiber: FiberNode) {
   let node : FiberNode | null = fiber;

   do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    } else {
      node = node.return;
      workInProgress = node;
    }
   } while (node !== null);
  }
