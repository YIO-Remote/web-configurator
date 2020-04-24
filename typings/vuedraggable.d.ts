declare module 'vuedraggable' {
	import Vue, { ComponentOptions } from 'vue';

	export interface IDraggedContext<T> {
		index: number;
		futureIndex: number;
		element: T;
	}

	export interface IDropContext<T> {
		index: number;
		component: Vue;
		element: T;
	}

	export interface IRectangle {
		top: number;
		right: number;
		bottom: number;
		left: number;
		width: number;
		height: number;
	}

	export interface IDragEndEvent {
		to: Element;
		from: Element;
		item: Element;
		oldIndex: number;
		newIndex: number;
		oldDraggableIndex: number;
		newDraggableIndex: number;
		clone: Element;
		pullMode: string;
	}

	const draggableComponent: ComponentOptions<Vue>;

	export default draggableComponent;
  }
