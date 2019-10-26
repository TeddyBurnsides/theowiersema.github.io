let x = "";
let y = "";
let operator;
let result;
const display=document.querySelector('#display');
window.onload = () => {
	document.addEventListener('keyup', event => {
		const key = event.keyCode;
		const shift=event.shiftKey;
		console.log('Key: ' + key);
		if (key === 27)  reset(); // escape
		if (key >= 48 && key <= 57) appendNumber(key-48); // number keys
		if (key === 13 || (key === 61 && !shift)) equals(); // enter or = (but not +)
		if (key === 173) { // dash
			display.innerHTML += '-';
			operator='subtract';
		}
		if (key === 88) { // x
			display.innerHTML += '*';
			operator='multiply';
		}
		if (key === 61 && shift) { // + (shift and =)
			display.innerHTML += '+';
			operator='add';
		}
	}, false);
	document.addEventListener('click', event => {
		const el=event.target
		const type=el.classList;
		const val=el.innerHTML;
		if (type.contains('reset')) reset();
		if (type.contains('number')) appendNumber(val);
		if (type.contains('equals')) equals();
		if (type.contains('operator') && x && !operator && !y) {
			operator = type[1];
			if (operator === 'add') display.innerHTML += '+';
			if (operator === 'subtract') display.innerHTML += '-';
			if (operator === 'multiply') display.innerHTML += '*';
			if (operator === 'divide') display.innerHTML += '/';
		}
	}, false);
}
const reset = () => {
	display.innerHTML = '';
	x = '';
	y = '';
	operator = '';
	result='';
}

const appendNumber = (val) => {
	display.innerHTML += val;
	(!operator) ?  x += val : y += val; // append to x or y depending on if operator is set
}

const equals = () => {
	if (!x || !y || !operator) return false;
	x = parseFloat(x);
	y = parseFloat(y);
	if (x !== null && operator != null && y !== null) {
		if (operator === 'add') result=x+y;
		if (operator === 'subtract') result=x-y;
		if (operator === 'multiply') result=x*y;
		if (operator === 'divide' && y!== 0) result=x/y;
		result=Math.round(result * 1000000000) / 1000000000;
		display.innerHTML = result;
	}
	x = result; // reuse for future operations
	y = '';
	operator='';
}