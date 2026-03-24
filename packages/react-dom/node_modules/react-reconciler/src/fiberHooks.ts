import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 当前指向函数组件的fiber
let currentlyRenderingFiber: FiberNode | null = null;
// hook 链表中当前正在处理的 hook
let workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	// 重置
	wip.memoizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update
	} else {
		// mount
		// 将当前使用的hooks集合指向mount类hooks的集合
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;

	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前useState 对应的hook数据
	const hook = mountWorkInProgressHook();

	let memoizedState;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
  hook.memoizedState = memoizedState

  // @ts-ignore
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
  queue.dispatch = dispatch;

	return [memoizedState, dispatch];
}

// 创造一个可触发更新的 setState
function dispatchSetState<State>(fiber:FiberNode, updateQueue:UpdateQueue<State>, action:Action<State>) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
}

// mount 时，将hook串起为链表
function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	// mount 时第一个hook
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			// 指向hook链表的第一个hook
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		// mount时后续的hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
