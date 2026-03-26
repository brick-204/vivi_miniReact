import { ReactElementType } from 'shared/ReactTypes';
// @ts-ignorets
import { createRoot } from 'react-dom';

export function renderIntoDocument(element: ReactElementType) {
	const div = document.createElement('div');
  // element
	return createRoot(div).render(element);
}
