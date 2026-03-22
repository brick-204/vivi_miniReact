import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { completeWork } from './completeWork';
import { beginWork } from './beginWork';
import { HostRoot } from './workTags';
import { MutationMask, NoFlags } from './fiberFlags';
import { commitMutationEffects } from './commitWork';

let workInProgress: FiberNode | null = null;

// 准备、创建 workInprogress
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// 获取 fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

// 向上递归寻找 fiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	// 寻找到了 hostRootFiber
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop 发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);

	// 创建好的 wip，且携带富集的 flags
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// 至此，渲染阶段结束，进入提交阶段
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	// wip
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}

	// 重置
	root.finishedWork = null;

	// 判断是否存在三个子阶段需要执行的操作

	// 判断 root 的 flags 和 subtreeFlagss
	const subTreeHashEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHashEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subTreeHashEffect || rootHashEffect) {

		// beforeMutation
		// mutation PlaceMent
    // 在 mutation 之后，layout 之前，wip 转为 current
    commitMutationEffects(finishedWork);
    root.current = finishedWork;
		// layout
	} else {
    root.current = finishedWork;
  }
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

// 有子节点，遍历子节点
function performUnitOfWork(fiber: FiberNode) {
	// 向下递
	const next = beginWork(fiber);
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
	let node: FiberNode | null = fiber;

	do {
		// 向上归
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
