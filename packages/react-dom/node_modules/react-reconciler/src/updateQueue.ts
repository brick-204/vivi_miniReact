import { Action } from 'shared/ReactTypes';

// Action 一个值或者一个箭头函数

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
	UpdateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	UpdateQueue.shared.pending = update;
};

// 消费 update
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// 处理函数类型的 action  setState((prevState) => prevState + 1)
			result.memoizedState = action(baseState);
		} else {
			// 处理普通类型的 action  setState(100)
			result.memoizedState = action;
		}
	}
	return result;
};
