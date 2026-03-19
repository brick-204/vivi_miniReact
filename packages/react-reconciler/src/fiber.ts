import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: any;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref | null;

	memoizedProps: Props | null;
  alternate: FiberNode | null;
  flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.pendingProps = pendingProps;
		this.key = key;

		// HostComponent <div> dom节点实例
		this.stateNode = null;
		//
		this.type = null;

		// 构成树状结构
		// 指向父 fiberNode
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;

    this.alternate = null;
    // 副作用
    this.flags = NoFlags;
	}
}
