const dragStart = event => {
	console.log('drag starts');
	console.log(event);

	event.dataTransfer.setData('text/plain', event.target.id);
	window.setTimeout(() => {
		event.target.classList.add('dragging');
	}, 0);
};

const dragEnter = event => {
	// console.log(event);
	event.preventDefault();
	event.target.classList.add('drag-over');
};

const dragOver = event => {
	// console.log(event);
	event.preventDefault();
	event.target.classList.add('drag-over');
};

const dragLeave = event => {
	// console.log(event);
	event.target.classList.remove('drag-over');
};

const drop = event => {
	// console.log(event);

	const dropLocation = event.target;
	const dropTarget = (dropLocation.classList.contains('droptarget') ? dropLocation : dropLocation.closest('.droptarget'));

	dropTarget.classList.remove('drag-over');

	const dropId = event.dataTransfer.getData('text/plain');
	const draggable = document.querySelector(`#${dropId}`);

	while (dropTarget.firstChild) {
		dropTarget.removeChild(dropTarget.firstChild);
	}

	dropTarget.appendChild(draggable);
	draggable.classList.remove('hide');
};

const noop = () => {
	console.log('noop');
};

const setupDraggables = () => {
	const draggables = document.querySelectorAll('.dragme');
	for (const node of draggables) {
		node.addEventListener('dragstart', dragStart);
		node.addEventListener('dragenter', noop);
		node.addEventListener('dragover', noop);
	}
};

const setupDroptargets = () => {
	const targets = document.querySelectorAll('.droptarget');

	for (const target of targets) {
		target.addEventListener('dragenter', dragEnter);
		target.addEventListener('dragover', dragOver);
		target.addEventListener('dragleave', dragLeave);
		target.addEventListener('drop', drop);
	}
};

const init = () => {
	console.log('JS loaded');
	setupDraggables();
	setupDroptargets();
};

window.addEventListener('load', init);
