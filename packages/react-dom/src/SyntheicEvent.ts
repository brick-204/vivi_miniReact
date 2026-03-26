import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props';
const validEventTypeList = ['click'];

export interface DOMElement extends Element {
	[elementPropsKey]: Props;
}

type EventCallback = (e: Event) => void;

// 合成事件
interface SyntheticEvent extends Event {
	__stopPropagation: boolean;
}

interface Paths {
	capture: EventCallback[];
	bubble: EventCallback[];
}

// dom[xxx] = reactElement props
export function updateFiberProps(node: DOMElement, props: Props) {
	node[elementPropsKey] = props;
}

export function initEvent(container: Container, eventType: string) {
	if (!validEventTypeList.includes(eventType)) {
		console.warn('当前不支持', eventType, '事件');
	}
	if (__DEV__) {
		console.log('初始化事件', eventType);
	}
	container.addEventListener(eventType, (e) => {
		dispatchEvent(container, eventType, e);
	});
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
	const targetElement = e.target;
	if (targetElement === null) {
		console.warn('事件不存在target', e);
		return;
	}

	// 1. 收集沿途的事件
	const { bubble, capture } = collectPaths(
		targetElement as DOMElement,
		container,
		eventType
	);
	// 2. 构造合成事件
	const se = createSyntheticEvent(e);
	// 3. 遍历capture 捕获
  triggerEventFlow(capture, se);
  if (!se.__stopPropagation) {
    // 4. 遍历bubble  冒泡
    triggerEventFlow(bubble,se);
  }
	
}

// 模仿捕获/冒泡触发回调函数
function triggerEventFlow(paths:EventCallback[], se:SyntheticEvent) {
  for (let i=0;i<paths.length;i++) {
    const callback = paths[i];
    callback.call(null, se);
    if (se.__stopPropagation) {
      break;
    }
  }
}

function createSyntheticEvent(e: Event) {
	const syntheticEvent = e as SyntheticEvent;
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation;

	syntheticEvent.stopPropagation = () => {
		if (originStopPropagation) {
			originStopPropagation();
		}
	};
  return syntheticEvent;
}

// 获取事件的回调名
function getEventCallbackNameFromEventType(
	eventType: string
): string[] | undefined {
	return {
		click: ['onClickCapture', 'onClick']
	}[eventType];
}

// 收集路径
function collectPaths(
	targetElement: DOMElement,
	container: Container,
	eventType: string
) {
	const paths: Paths = {
		capture: [],
		bubble: []
	};
	const elementProps = targetElement[elementPropsKey];
	if (elementProps) {
		const callbackNameList = getEventCallbackNameFromEventType(eventType);
		if (callbackNameList) {
			callbackNameList.forEach((callbackName, i) => {
				const eventCallback = elementProps[callbackName];
				if (eventCallback) {
					if (i === 0) {
						// capture
						paths.capture.unshift(eventCallback);
					} else {
						paths.bubble.push(eventCallback);
					}
				}
			});
		}
	}
	while (targetElement && targetElement !== container) {
		targetElement = targetElement.parentNode as DOMElement;
	}
	return paths;
}
