import { REACT_ELEMENT_TYPE } from 'shared/ReactSymols';
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

// ReactElement

const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'caicai'
	};
	return element;
};

export const jsx = (type: ElementType, config: Props, ...maybeChildren: unknown[]) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

  // 处理config中的key和ref, 其他属性注入 props 中
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val as Ref;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}
  return ReactElement(type, key, ref, props);
};

// 生产环境和开发环境一致
export const jsxDev = jsx;
export const jsxDEV = jsx;
