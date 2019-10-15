// some initialization
let id;
if (typeof(Storage) == 'undefined') {
	alert('Your browser does not support local storage. This website will not work.')
} else {
	if (localStorage.getItem('numTasks') == null) {
		localStorage.clear(); // clear all data
		id=0;
	} else {
		id=localStorage.getItem('numTasks'); // counter should always be >= numTasks
	}
}

// stuff to do after window is loaded
window.onload = () => {
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

	// only try to generate HTML if there are tasks in storage
	if (storageAlreadyExists('id')) {
		// get data from local storage
		const id=localStorage.getItem('id').split(',');
		const title=localStorage.getItem('title').split(',');
		const highlight=localStorage.getItem('highlight').split(',');
		const timestamp=localStorage.getItem('timestamp').split(',');
		const complete=localStorage.getItem('complete').split(',');

		// build out HTML elements
		id.forEach((element,i) => {
			if (element) buildNewTaskHTML(id[i],title[i],timestamp[i],highlight[i],complete[i]);
		})
	}
}

// add new item to the task list
const addNewItem = () => {
	const input = document.getElementById('newItemText').value;  //get input from text field
	const alertStatus=document.getElementById('alert').classList; // check for invalid alert status
	// if input is valid, try to save it off
	if (IsValidInput(input) == true) { 
		if (alertStatus !== 'hide') alertStatus.add('hide') // hide alert if it's visible
		const timestamp=getDate(); // get current date + time
		id=parseInt(id)+1; // add 1 to global task identifier (have to convert it a integer)
		buildNewTaskHTML(id,input,timestamp,0,0); // insert new task HTML
		document.getElementById('newItemText').value = ""; // clear input field
		// if data is already stored, append
		if (storageAlreadyExists('id')) {
			localStorage.setItem('numTasks',id);
			saveOffTasks(localStorage.getItem('id')+','+id,localStorage.getItem('title')+','+input,localStorage.getItem('timestamp')+','+timestamp,localStorage.getItem('highlight')+','+'0',localStorage.getItem('complete')+','+'0');
		// else just add regularly
		} else {
			localStorage.setItem('numTasks',id);
			saveOffTasks(id,input,timestamp,0,0);
		}	
	} else {
		if (alertStatus == 'hide') alertStatus.remove('hide'); // show alert
	}
}

//remove item from task list
const removeItem = element => {
	// remove local storage
	const taskID=element.parentNode.getAttribute('data-id'); // task to remove
	const indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
	// convert localStorage strings to arrays
	let allIDs=localStorage.getItem('id').split(','); 
	let allTitles=localStorage.getItem('title').split(',');
	let allTimestamps=localStorage.getItem('timestamp').split(',');
	let allHighlights=localStorage.getItem('highlight').split(',');
	let allComplete=localStorage.getItem('complete').split(',');
	// remove the task from arrays
	allIDs.splice(indexOfTaskID,1);
	allTitles.splice(indexOfTaskID,1);
	allTimestamps.splice(indexOfTaskID,1);
	allHighlights.splice(indexOfTaskID,1);
	allComplete.splice(indexOfTaskID,1);
	// convert arrays back to strings
	allIDs=allIDs.join(',');
	allTitles=allTitles.join(',');
	allTimestamps=allTimestamps.join(',');
	allHighlights=allHighlights.join(',');
	allComplete=allComplete.join(',');
	// save off new strings to localStorage
	saveOffTasks(allIDs,allTitles,allTimestamps,allHighlights,allComplete);
	// remove HTML element
	element.parentNode.remove();
}

// allow modifications to task when clicked
const editItem = element => {
	const fieldValue=element.innerHTML; // save off task title in span
	const container=element.parentNode; // save off <form> element that holds inputs/buttons
	element.outerHTML = '<input type="Text" value="' + fieldValue + '" />'; // replace <span> with input
	container.querySelector('input').focus(); // put cursor in input field
}

// save changes to item
const saveItem = element => {
	const fieldValue=element.parentNode.querySelector('input').value; // get text in input
	// check if input is valid
	if (IsValidInput(fieldValue) === true) {
		// local Storage stuff
		const taskID=element.parentNode.parentNode.getAttribute('data-id'); // task to remove
		const indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
		let allTitles=localStorage.getItem('title').split(','); // convert all task titles into array
		allTitles[indexOfTaskID]=fieldValue; // change the task we care about
		allTitles=allTitles.join(','); // convert back to string
		localStorage.setItem('title',allTitles); // save to localStorage
		// HTML stuff
		element.parentNode.querySelector('input').outerHTML='<span class="text">' + fieldValue + '</span>'; // replace input with input value
	}
}

// toggle highlight flag on task
const toggleHighlight = element => {
	const taskID=element.parentNode.getAttribute('data-id'); // task to remove
	const indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
	let allHighlight=localStorage.getItem('highlight').split(','); // convert to array of highlights
	// should we highlight or unhighlight?
	if (element.classList.contains('highlight')) {
		allHighlight[indexOfTaskID]=0;
	} else {
		allHighlight[indexOfTaskID]=1;
	}
	allHighlight=allHighlight.join(','); // convert back to string
	localStorage.setItem('highlight',allHighlight); // save off to localStorage
	element.classList.toggle('highlight'); // HTML modifications
}

// toggle complete checkbox
const toggleComplete = element => {
	const taskID=element.parentNode.getAttribute('data-id'); // task to remove
	const indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
	let allComplete=localStorage.getItem('complete').split(','); // convert to array
	// should we complete or uncomplete?
	if (element.parentNode.classList.contains('completed')) {
		allComplete[indexOfTaskID]=0;
	} else {
		allComplete[indexOfTaskID]=1;
	}
	allComplete=allComplete.join(','); // back to a string!
	localStorage.setItem('complete',allComplete); // save off to local Storage
	element.parentNode.classList.toggle('completed'); // HTML modifications
}

// global reset 
const removeAll = () => {
	document.querySelector('#list').innerHTML = ''; //  delete HTML
	localStorage.clear(); // delete localStorage
}

// does local storage exist?
const storageAlreadyExists = element => {
	if (typeof localStorage.getItem(element) == 'undefined' || localStorage.getItem(element) == null) {
		return false;
	} else {
		return true;
	}
}

// restricts invalid text entry into a task
const IsValidInput = input => {
	const invalidChars=['=',',',';'];
	if (invalidChars.some(element => input.includes(element))) return false; // does input contains invalid characters?
	if (input !== '') return true;
}

// store data to local Storage
const saveOffTasks = (id,input,timestamp,highlight,complete) => {
	localStorage.setItem('id',id);
	localStorage.setItem('title',input);
	localStorage.setItem('timestamp',timestamp);
	localStorage.setItem('highlight',highlight);
	localStorage.setItem('complete',complete);
}

// create the HTML for the new task (new technique)
const buildNewTaskHTML = (id,title,timestamp,highlight,complete) => {
	// create complete button
	const check=document.createElement('button');
	check.setAttribute('class','complete');
	check.textContent = '✓';
	// create star button
	const star=document.createElement('button');
	star.setAttribute('class','star');
	star.textContent = '★';
	if (highlight == 1) star.setAttribute('class','star highlight');
	// create remove button
	const remove=document.createElement('button');
	remove.setAttribute('class','remove');
	remove.textContent = '×';
	// create save button
	const save=document.createElement('button');
	save.setAttribute('class','save');
	// create task title
	const content=document.createElement('span');
	content.setAttribute('class','text');
	content.textContent = title;
	// create timestamp
	const small=document.createElement('small');
	small.textContent = 'Created on ' + timestamp;
	// create form
	const form=document.createElement('form');
	form.setAttribute('onsubmit','return false;');
	form.appendChild(content);
	form.appendChild(save);
	// create <li>
	const li=document.createElement('li');
	li.setAttribute('data-id',id);
	if (complete == 1) li.setAttribute('class','completed');
	li.appendChild(star);
	li.appendChild(check);
	li.appendChild(form);
	li.appendChild(small);
	li.appendChild(remove);
	document.querySelector('#list').prepend(li);
}

// returns nicely formatted date
const getDate = () => {
	const date=new Date();
	const year=date.getFullYear();
	const month=date.toLocaleString('default', { month: 'long' });
	const day=date.getDate();
	const time=date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	return month + ' ' + day + ' ' + year + ' at ' + time
}