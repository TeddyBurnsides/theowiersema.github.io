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
	// listeners for various click types
	document.addEventListener('click', event => {
		const element=event.target; // HTML node that is clicked
		if (element.classList.contains('star')) toggleHighlight(element);
		if (element.classList.contains('remove')) removeItem(element);
		if (element.id == 'newItem') addNewItem();
		if (element.classList.contains('text')) editItem(element);
		if (element.classList.contains('save')) saveItem(element);
		if (element.classList.contains('complete')) toggleComplete(element);
		if (element.id == 'clearAll') removeAll();
	}, false);

	// listener for searching functionality
	document.addEventListener('keyup', event => {
		const element=event.target;
		if (element.id == 'search') filterTaskList(event.keyCode);
	})

	document.getElementById('search').value = ""; // clear search field

	// only try to generate HTML if there are tasks in storage
	if (storageAlreadyExists('id')) {
		// get data from local storage
		const id=localStorage.getItem('id').split(',');
		const title=localStorage.getItem('title').split(',');
		const highlight=localStorage.getItem('highlight').split(',');
		const timestamp=localStorage.getItem('timestamp').split(',');
		const complete=localStorage.getItem('complete').split(',');

		// build out each task in HTML
		id.forEach((element,i) => {
			if (element) buildNewTaskHTML(id[i],title[i],timestamp[i],highlight[i],complete[i]);
		})
	}
}

// filter task list
filterTaskList = (badKey) => {
	const invalidChars=[16,17,18,224]; // shift,control,option,command
	if (invalidChars.some(element => badKey == element)) return false; // ignore bad chars
	// only search if data exists
	if (storageAlreadyExists('id')) { 
		const input = document.getElementById('search').value.toLowerCase();  //get input from text field and convert to lowercase
		const id=localStorage.getItem('id').split(',');
		let title=localStorage.getItem('title').split(',');
		// loop through each post to hide/show
		id.forEach((element,i) => {
			document.querySelector('li[data-id="' + id[i] + '"').classList.add('hide'); // default to hidden
			title[i]=title[i].toLowerCase(); // convert to lowercase for comparison
			// if search text matches task title, unhide the task
			if (element && title[i].includes(input)) {
				document.querySelector('li[data-id="' + id[i] + '"').classList.remove('hide');
			}
		});
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
	(element.classList.contains('highlight')) ? allHighlight[indexOfTaskID]=0 : allHighlight[indexOfTaskID]=1; // should we highlight or unhighlight?
	allHighlight=allHighlight.join(','); // convert back to string
	localStorage.setItem('highlight',allHighlight); // save off to localStorage
	element.classList.toggle('highlight'); // HTML modifications
}

// toggle complete checkbox
const toggleComplete = element => {
	const taskID=element.parentNode.getAttribute('data-id'); // task to remove
	const indexOfTaskID=localStorage.getItem('id').split(',').indexOf(taskID); // index of task
	let allComplete=localStorage.getItem('complete').split(','); // convert to array
	(element.parentNode.classList.contains('completed')) ? allComplete[indexOfTaskID]=0 : allComplete[indexOfTaskID]=1; // should we complete or uncomplete?
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
	const check=createHTML('button','✓','class','complete'); // complete button
	const star = createHTML('button','★','class','star'); // star button
	if (highlight == 1) star.setAttribute('class','star highlight');
	const remove=createHTML('button','×','class','remove'); // remove button
	const save=createHTML('button','','class','save'); // save button	
	const content=createHTML('span',title,'class','text'); // task content
	const small=createHTML('small','Created on ' + timestamp); // create timestamp
	const form=createHTML('form','','onsubmit','return false;'); // create form
	appendChildren(form,[content, save]);
	const li=createHTML('li','','data-id',id); // create <li>
	const br=createHTML('div','','class','break'); // create <br />
	if (complete == 1) li.setAttribute('class','completed');
	appendChildren(li,[star,check,form,small,remove,br]); // add elements inside parent
	document.querySelector('#list').prepend(li);
}

// create HTML element with attribute and attribute value and populates element with content
const createHTML = (type,content,attr,attrVal) => {
	const element=document.createElement(type);
	if (attr && attrVal) element.setAttribute(attr,attrVal);
	if (content) element.textContent = content;
	return element;
}

// append a bunch of things to a parent element
const appendChildren = (parent,children) => {
	children.forEach(child => {
		parent.appendChild(child);
	})
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