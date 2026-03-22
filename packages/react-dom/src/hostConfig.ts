// 宿主（如浏览器、项目）环境中的方法

export type Container = Element; // 外壳组件挂载的 dom
export type Instance = Element; // 普通的 dom 实例

export const createInstance = (type: string): Instance => {
	// TODO 处理 props
	const element = document.createElement(type);
	return element;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChild;
