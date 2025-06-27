/*

TODO:

* update page to enter new things
* add shuffle button
* lock rows
* about page
* main styling
* store prefs in localStorage

*/

const dragStart = event => {
	console.log('drag starts');

	const item = event.target;
	const sourceZone = item.closest('.droptarget');

	const info = `${item.id}-${sourceZone.id}`;
	console.log(info);

	event.dataTransfer.setData('text/plain', info);
	window.setTimeout(() => {
		item.classList.add('dragging');
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

	console.log(`dropTarget.id: ${dropTarget.id}`);

	dropTarget.classList.remove('drag-over');

	const info = event.dataTransfer.getData('text/plain');
	const dropId = info.split('-')[0];
	const sourceId = info.split('-')[1];

	console.log(`dropId: ${dropId}`);
	console.log(`sourceId: ${sourceId}`);

	const draggable = document.querySelector(`#${dropId}`);
	const dropSource = document.querySelector(`#${sourceId}`);

	// while (dropTarget.firstChild) {
	// 	dropTarget.removeChild(dropTarget.firstChild);
	// }

	const displacedNode = dropTarget.querySelector('.dragme');
	console.log('this should be the one that gets shoved out');
	console.log(displacedNode);
	const displaced = dropTarget.removeChild(displacedNode);
	console.log(`displaced.id: ${displaced.id}`);
	dropSource.append(displaced);
	displaced.classList.remove('drag-over');

	dropTarget.appendChild(draggable);
	draggable.classList.remove('dragging');
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

const boxChange = event => {
	const container = document.querySelector('.container');
	if (event.target.checked) {
		container.classList.add('nyt-col');
	} else {
		container.classList.remove('nyt-col');
	}
};

const setupCheckbox = () => {
	const cb = document.querySelector('#nytc');
	cb.addEventListener('change', boxChange);
};

const init = () => {
	console.log('JS loaded');
	setupDraggables();
	setupDroptargets();
	setupCheckbox();
};

window.addEventListener('load', init);
