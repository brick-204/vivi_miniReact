// 副作用标志
export type Flags = number;

export const NoFlags =  0b0000001; // 无副作用
export const Placement =  0b0000010;  // 插入
export const Update =  0b0000100;   // 更新属性
export const ChildDeletion =  0b0001000;   // 删除子节点，标记在父节点上


export const MutationMask = Placement | Update | ChildDeletion