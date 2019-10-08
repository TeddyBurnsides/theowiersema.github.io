// immediately add listeners for various click types
window.onload = () => {
	document.addEventListener('click', event => {
		let element=event.target; // this is the element that is clicked
		if (element.classList == 'star') element.parentNode.classList.toggle('highlight');
		if (element.classList == 'remove') element.parentNode.remove();
		if (element.id == 'newItem') addNewItem();
		if (element.classList == 'text') editItem(element);
		if (element.classList == 'save') saveItem(element);
		if (element.classList == 'complete') element.parentNode.classList.toggle('completed');
	}, false);
}
// add new item to the task list
const addNewItem = () => {
	let input = document.getElementById('newItemText').value;  //get input from text field
	if (IsValidInput(input) === true) { 
		let timestamp=getDate();
		// insert a new task template
		document.querySelector('#list').insertAdjacentHTML('afterbegin',
			'<li class="item"><button class="complete">✓</button><button class="star">★</button><form onsubmit="return false;"><span class="text">' + input + '</span><button\ class="save hide">Save</button></form><small>Due by ' + timestamp + '</small><button class="remove">X</button></li>'
		);
		document.getElementById('newItemText').value = ""; //clear input field
		//generateCookies(input,timestamp,1)
	}
}
//rebuild cookies
const generateCookies = (title,timestamp,highlighted) => {
	let currentCookies=document.cookie;
	console.log(currentCookies.split(';'));
	console.log(currentCookies);

	document.cookie='title=' + title;
	document.cookie='timestamp=' + timestamp;
	document.cookie='highlighted=' + highlighted;
	
	

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
		element.parentNode.querySelector('input').outerHTML='<span class="text">' + fieldValue + '</span>'; // replace input with input value
		element.classList.add('hide'); // hide save button
	}
}
// restricts invalid text entry into a task
const IsValidInput = input => {
	if (input !== '') return true;
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