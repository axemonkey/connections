/*

TODO:

* main styling
* break up the JS
* error messaging / validation
* shuffle
* lock rows
* about page
* store prefs in localStorage

*/

/* TO DONE:

* break up the CSS
* URL encode/decode items
* trim whitepace off of items
* get things from query string
* update box to enter new things
* prefill entry box from URL on load

*/

/* EASY ONE

?items=rock^straw^eye^nature^nations^fiddle^guess^laugh^coming^party^resort^responder^lady^supper^rail^aid

rock
straw
eye
nature
nations
fiddle
guess
laugh
coming
party
resort
responder
lady
supper
rail
aid

HARDER ONE

?items=contact^number^exchange^insurance^arrival^college^market^position^almanac^flight^dealings^team^gate^tan^destination^interaction

contact
number
exchange
insurance
arrival
college
market
position
almanac
flight
dealings
team
gate
tan
destination
interaction

*/

const VARS = {
	SHUFFLE_STEPS: 20,
	ANIMTIMEOUT: 1,
};

let shuffling = false;

const prefillEntryBox = itemsArray => {
	const textarea = document.querySelector('#entry');
	textarea.value = itemsArray.join('\n');
};

const fillItems = itemsArray => {
	for (const item in itemsArray) {
		if (Object.hasOwn(itemsArray, item)) {
			document.querySelector(`#item${item}`).textContent = itemsArray[item];
		}
	}
};

const getItemsFromQuery = q => {
	const params = new URLSearchParams(q);
	const itemString = params.get('items');
	let valid = false;
	if (itemString) {
		console.log('hooray');
		const itemsArray = itemString.split('^');
		console.log(`itemsArray.length: ${itemsArray.length}`);
		if (itemsArray.length === 16) {
			fillItems(itemsArray);
			prefillEntryBox(itemsArray);
			valid = true;
		}
	}
	if (!valid) {
		showEntryBox();
	}
};

const showEntryBox = () => {
	console.log('entry box');

	const container = document.querySelector('.container');
	const entryBox = document.querySelector('.entry-box');
	const nav = document.querySelector('nav');

	container.classList.add('hide');
	entryBox.classList.remove('hide');
	nav.classList.add('hide');
};

const checkQuery = () => {
	const q = document.location.search;
	if (q) {
		getItemsFromQuery(q);
	} else {
		showEntryBox();
	}
};

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

const goButton = () => {
	console.log('go!');
	const entered = document.querySelector('#entry').value;
	console.log(entered);
	const split = entered.split('\n');
	if (split.length === 16) {
		// woohoo
		const trimmedItems = [];
		for (const item of split) {
			const safeItem = item.replace(/\^/gm, '');
			trimmedItems.push(encodeURIComponent(safeItem.trim()));
		}
		document.location = `/?items=${trimmedItems.join('^')}`;
	} else {
		// waaahhhhh
		// error messaging
		console.log('must enter 16 things');
	}
};

const cancelButton = () => {
	const container = document.querySelector('.container');
	const entryBox = document.querySelector('.entry-box');
	const nav = document.querySelector('nav');

	container.classList.remove('hide');
	entryBox.classList.add('hide');
	nav.classList.remove('hide');
};

const updateButton = () => {
	showEntryBox();
};

const shiftElement = stepVars => {
	const firstItem = document.querySelector(`#whizz1`);
	const currLeftOne = Number.parseInt(firstItem.style.left, 10);
	const newLeftOne = currLeftOne - stepVars.stepSizeX;
	firstItem.style.left = `${newLeftOne}px`;
	const currTopOne = Number.parseInt(firstItem.style.top, 10);
	const newTopOne = currTopOne - stepVars.stepSizeY;
	firstItem.style.top = `${newTopOne}px`;

	const secondItem = document.querySelector(`#whizz2`);
	const currLeftTwo = Number.parseInt(secondItem.style.left, 10);
	const newLeftTwo = currLeftTwo + stepVars.stepSizeX;
	secondItem.style.left = `${newLeftTwo}px`;
	const currTopTwo = Number.parseInt(secondItem.style.top, 10);
	const newTopTwo = currTopTwo + stepVars.stepSizeY;
	secondItem.style.top = `${newTopTwo}px`;

	if (stepVars.currStep === stepVars.steps) {
		const itemOne = document.querySelector(`#item${stepVars.a}`);
		const itemOneText = itemOne.textContent;
		const itemTwo = document.querySelector(`#item${stepVars.b}`);
		const itemTwoText = itemTwo.textContent;

		itemOne.textContent = itemTwoText;
		itemTwo.textContent = itemOneText;
		document.querySelector(`#whizz1`).remove();
		document.querySelector(`#whizz2`).remove();
		shuffle(stepVars.iteration + 1);
	} else {
		window.setTimeout(() => {
			shiftElement({
				a: stepVars.a,
				b: stepVars.b,
				firstTop: stepVars.firstTop,
				secondItem: stepVars.secondItem,
				secondLeft: stepVars.secondLeft,
				secondTop: stepVars.secondTop,
				stepSizeX: stepVars.stepSizeX,
				stepSizeY: stepVars.stepSizeY,
				currStep: stepVars.currStep + 1,
				steps: stepVars.steps,
				iteration: stepVars.iteration,
			});
		}, VARS.ANIMTIMEOUT);
	}
};

const swap = (a, b, iteration) => {
	const firstItem = document.querySelector(`#item${a}`);
	const secondItem = document.querySelector(`#item${b}`);

	const firstItemCopy = firstItem.cloneNode(true);
	const firstLeft = firstItem.offsetLeft;
	const firstTop = firstItem.offsetTop;
	firstItemCopy.id = 'whizz1';
	firstItemCopy.classList.add('whee');
	firstItemCopy.style.position = 'absolute';
	firstItemCopy.style.left = `${firstLeft}px`;
	firstItemCopy.style.top = `${firstTop}px`;
	document.body.append(firstItemCopy);

	const secondItemCopy = secondItem.cloneNode(true);
	const secondLeft = secondItem.offsetLeft;
	const secondTop = secondItem.offsetTop;
	secondItemCopy.id = 'whizz2';
	secondItemCopy.classList.add('whee');
	secondItemCopy.style.position = 'absolute';
	secondItemCopy.style.left = `${secondLeft}px`;
	secondItemCopy.style.top = `${secondTop}px`;
	document.body.append(secondItemCopy);

	const steps = VARS.SHUFFLE_STEPS;
	const deltaX = firstLeft - secondLeft;
	const deltaY = firstTop - secondTop;
	const stepSizeX = deltaX / steps;
	const stepSizeY = deltaY / steps;

	shiftElement({
		a,
		b,
		firstTop,
		secondItem,
		secondLeft,
		secondTop,
		stepSizeX,
		stepSizeY,
		currStep: 1,
		steps,
		iteration,
	});
};

const shuffle = iteration => {
	if (iteration < 16) {
		shuffling = true;
		const wun = iteration;
		const too = Math.floor(Math.random() * 16);

		if (wun === too) {
			shuffle(iteration);
		} else {
			swap(wun, too, iteration);
		}
	} else {
		shuffling = false;
	}
};

const setupButtons = () => {
	document.querySelector('#go').addEventListener('click', goButton);
	document.querySelector('#cancel').addEventListener('click', cancelButton);
	document.querySelector('#update').addEventListener('click', updateButton);
	document.querySelector('#shuffle').addEventListener('click', () => {
		if (!shuffling) {
			shuffle(0);
		}
	});
};

const init = () => {
	console.log('JS loaded');
	setupDraggables();
	setupDroptargets();
	setupCheckbox();
	setupButtons();
	checkQuery();
};

window.addEventListener('load', init);
