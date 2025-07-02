(function () {
	'use strict';

	/*

	TODO:

	* prefill entry box from URL on load
	* main styling
	* shuffle
	* lock rows
	* about page
	* store prefs in localStorage

	*/

	/* TO DONE:

	* get things from query string
	* update box to enter new things

	*/

	// ?items=clonk^jonk^bonk^chonk^honk^fonk^nonk^slonk^ponk^quonk^squonk^stonk^sponk^shonk^donk^gonk

	/*

	clonk
	jonk
	bonk
	chonk
	honk
	fonk
	nonk
	slonk
	ponk
	quonk
	squonk
	stonk
	sponk
	shonk
	donk
	gonk

	*/

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
	  const dropTarget = dropLocation.classList.contains('droptarget') ? dropLocation : dropLocation.closest('.droptarget');
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
	    document.location = `/?items=${split.join('^')}`;
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
	const setupButtons = () => {
	  document.querySelector('#go').addEventListener('click', goButton);
	  document.querySelector('#cancel').addEventListener('click', cancelButton);
	  document.querySelector('#update').addEventListener('click', updateButton);
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

})();
