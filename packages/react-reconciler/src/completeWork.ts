import {
	appendInitialChild,
	Container,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags, Update } from './fiberFlags';
import { updateFiberProps } from 'react-dom/src/SyntheicEvent';

function markUpdate(fiber:FiberNode) {
  fiber.flags |= Update;
}

// DFS 递归遍历 递归中的归阶段
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
        updateFiberProps(wip.stateNode, newProps);
			} else {
				// mount
				// 构建离屏dom
				// instance 是宿主环境的实例，即 dom fiber
				const instance = createInstance(wip.type, newProps);
				// 将孩子节点插入到 instance 树下
				appendAllChildren(instance, wip);
				//
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
        const oldText = current.memoizedProps?.content;
        const newText = newProps.content;
        if (oldText !== newText) {
          markUpdate(wip);
        }
			} else {
				// mount
				// 构建离屏dom
				// instance 是宿主环境的实例，即 dom fiber
				const instance = createTextInstance(newProps.content as string);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
    case FunctionComponent:
      bubbleProperties(wip);
      return null;
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', wip);
			}
			break;
	}
};

function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child;

	while (node !== null) {
		// 如果是基本的dom节点或者文本节点，可以直接插入
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === wip) {
			return;
		}
		// 到底部遍历兄弟节点没有了，开始归
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

// 归冒泡处理副作用 flags
// 将当前 wip 节点的子节点及其子节点的兄弟节点的 flags 冒泡富集到 subtreeFlags
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;

	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlags |= subtreeFlags;
}
