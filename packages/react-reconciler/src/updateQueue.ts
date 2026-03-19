import { Action } from 'shared/ReactTypes';

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

export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<Action>;
};

export const enqueueUpdate = <Action>(
	UpdateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	UpdateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State>
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// 处理函数类型的 action  setState((prevState) => prevState + 1)
			result.memorizedState = action(baseState);
		} else {
			// 处理普通类型的 action  setState(100)
			result.memorizedState = action;
		}
	}
	return result;
};
