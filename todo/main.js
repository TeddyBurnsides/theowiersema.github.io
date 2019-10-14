let numTasks=localStorage.getItem('numTasks');
if (numTasks == '' || isNaN(numTasks) || typeof numTasks == 'undefined') {
	localStorage.clear();
	localStorage.setItem('numTasks',0); // pick arbitrary number of start at
}
let id=localStorage.getItem('numTasks');
window.onload = () => {
	// browser support
	if (typeof(Storage) == 'undefined') {
		alert('Your browser does not support local storage. This website will not work.')
	}
	// immediately add listeners for various click types
	document.addEventListener('click', event => {
		const element=event.target; // this is the element that is clicked
		if (element.classList.contains('star')) toggleHighlight(element);
		if (element.classList.contains('remove')) removeItem(element);
		if (element.id == 'newItem') addNewItem();
		if (element.classList.contains('text')) editItem(element);
		if (element.classList.contains('save')) saveItem(element);
		if (element.classList.contains('complete')) toggleComplete(element);
		if (element.id == 'clearAll') removeAll();
	}, false);
	// don't try to generate anything if no tasks
	if (typeof localStorage.getItem('numTasks') == 'undefined' || localStorage.getItem('numTasks') == null) return false;
	// build stored task list
	let id=localStorage.getItem('id').split(',');
	let title=localStorage.getItem('title').split(',');
	let highlight=localStorage.getItem('highlight').split(',');
	let timestamp=localStorage.getItem('timestamp').split(',');
	let complete=localStorage.getItem('complete').split(',');
	let highlightHTML,completeHTML;
	id.forEach((element,i) => {
		if (element == '') return false; // don't show empty tasks 
		if (highlight[i] == 0) {
			highlightHTML='<button class="star">★</button>';
		} else {
			highlightHTML='<button class="star highlight">★</button>';
		}
		if (complete[i] == 0) {
			completeHTML='" class="item"><button class="complete">✓</button>';
		} else {
			completeHTML='" class="item completed"><button class="complete">✓</button>';
		}
		document.querySelector('#list').insertAdjacentHTML('afterbegin',
		'<li data-id="' + id[i] + completeHTML + highlightHTML + '<form onsubmit="return false;"><span class="text">' + title[i] + '</span><button class="save hide">Save</button></form><small>Created on  ' + timestamp[i] + '</small><button class="remove">&times;</button></li>');
	})
}
// add new item to the task list
const addNewItem = () => {
	let input = document.getElementById('newItemText').value;  //get input from text field
	let alertStatus=document.getElementById('alert').classList; 
	if (IsValidInput(input) === true) { 
		if (alertStatus !== 'hide') {
			alertStatus.add('hide')
		};
		let timestamp=getDate();

		id=parseInt(id)+1; // add 1 to global counter (have to convert it a integer)

		// insert a new task template
		document.querySelector('#list').insertAdjacentHTML('afterbegin',
			'<li data-id="' + id + '" class="item"><button class="complete">✓</button><button class="star">★</button><form onsubmit="return false;"><span class="text">' + input + '</span><button class="save hide">Save</button></form><small>Created on ' + timestamp + '</small><button class="remove">&times;</button></li>'
		);
		document.getElementById('newItemText').value = ""; //clear input field

		// save off the new Item to local storage
		if (typeof localStorage.getItem('numTasks') == 'undefined' || localStorage.getItem('numTasks') == null) {
			localStorage.setItem('numTasks',id);
			localStorage.setItem('id',id);
			localStorage.setItem('title',input);
			localStorage.setItem('timestamp',timestamp);
			localStorage.setItem('highlight','0');
			localStorage.setItem('complete','0');
		} else {
			localStorage.setItem('numTasks',id);
			localStorage.setItem('id',localStorage.getItem('id')+','+id);
			localStorage.setItem('title',localStorage.getItem('title')+','+input);
			localStorage.setItem('timestamp',localStorage.getItem('timestamp')+','+timestamp);
			localStorage.setItem('highlight',localStorage.getItem('highlight')+','+'0');
			localStorage.setItem('complete',localStorage.getItem('complete')+','+'0');
		}
		

	} else {
		if (alertStatus == 'hide') {
			alertStatus.remove('hide');
		}
	}
}
//remove item from list
const removeItem = element => {
	// remove local storage
	let taskID=element.parentNode.getAttribute('data-id'); // task to remove
	let indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
	// convert to arrays
	let allIDs=localStorage.getItem('id').split(','); 
	let allTitles=localStorage.getItem('title').split(',');
	let allTimestamps=localStorage.getItem('timestamp').split(',');
	let allHighlights=localStorage.getItem('highlight').split(',');
	let allComplete=localStorage.getItem('complete').split(',');
	// remove task from arrays
	allIDs.splice(indexOfTaskID,1);
	allTitles.splice(indexOfTaskID,1);
	allTimestamps.splice(indexOfTaskID,1);
	allHighlights.splice(indexOfTaskID,1);
	allComplete.splice(indexOfTaskID,1);
	// convert back to strings
	allIDs=allIDs.join(',');
	allTitles=allTitles.join(',');
	allTimestamps=allTimestamps.join(',');
	allHighlights=allHighlights.join(',');
	allComplete=allComplete.join(',');
	// save off to local Storage
	localStorage.setItem('id',allIDs)
	localStorage.setItem('title',allTitles);
	localStorage.setItem('timestamp',allTimestamps);
	localStorage.setItem('highlight',allHighlights);
	localStorage.setItem('complete',allComplete);

	// remove HTML element
	element.parentNode.remove();
}
// allow modifications to task when clicked
const editItem = element => {

	let fieldValue=element.innerHTML; // save off value in span
	let container=element.parentNode; // save off li element
	element.outerHTML = '<input type="Text" value="' + fieldValue + '" />'; // replace span with input
	container.querySelector('.save').classList.remove('hide'); //show save button
	container.querySelector('input').focus(); // put cursor in input field
}
// save changes to item
const saveItem = element => {
	let fieldValue=element.parentNode.querySelector('input').value; // get text in input
	if (IsValidInput(fieldValue) === true) {
		// local Storage stuff
		let taskID=element.parentNode.parentNode.getAttribute('data-id'); // task to remove
		let indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
		let allTitles=localStorage.getItem('title').split(',');
		allTitles[indexOfTaskID]=fieldValue;
		allTitles=allTitles.join(',');
		localStorage.setItem('title',allTitles);
		//
		// HTML stuff
		element.parentNode.querySelector('input').outerHTML='<span class="text">' + fieldValue + '</span>'; // replace input with input value
		element.classList.add('hide'); // hide save button
	}
}
// toggle highlight flag on task
const toggleHighlight = element => {
	// local Storage stuff
	let taskID=element.parentNode.getAttribute('data-id'); // task to remove
	let indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID);
	let allHighlight=localStorage.getItem('highlight').split(',');
	if (element.classList.contains('highlight')) {
		allHighlight[indexOfTaskID]=0;
	} else {
		allHighlight[indexOfTaskID]=1;
	}
	allHighlight=allHighlight.join(',');
	localStorage.setItem('highlight',allHighlight);
	//
	// HTML stuff
	element.classList.toggle('highlight');
}
// toggle complete checkbox
const toggleComplete = element => {
	// local Storage stuff
	let taskID=element.parentNode.getAttribute('data-id'); // task to remove
	let indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID);
	let allComplete=localStorage.getItem('complete').split(',');
	if (element.parentNode.classList.contains('completed')) {
		allComplete[indexOfTaskID]=0;
	} else {
		allComplete[indexOfTaskID]=1;
	}
	allComplete=allComplete.join(',');
	localStorage.setItem('complete',allComplete);
	//
	// HTML stuff
	element.parentNode.classList.toggle('completed');
}
const removeAll = () => {
	document.querySelector('#list').innerHTML = '';
	localStorage.clear();
}
// restricts invalid text entry into a task
const IsValidInput = input => {
	if (input !== '') return true;
	if (input.includes('=') || input.includes(',') || input.includes(';')) return true;
}
// returns nicely formatted date
const getDate = () => {
	const date=new Date();
	const year=date.getFullYear();
	const month=date.toLocaleString('default', { month: 'long' });
	const day=date.getDate();
	var time=date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	return month + ' ' + day + ' ' + year + ' at ' + time
}