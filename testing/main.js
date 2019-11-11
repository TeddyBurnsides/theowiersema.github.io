const input = [
	['hello everybody and hi folks'],
	['hello everybody and goodbye'],
	['hi people out there'],
	['hello people in outer space'],
	['how are the bananas in Wisconsin'],
	['How is the family farm'],
	['how are the kids these days'],
	['wide are the lakes in Wisconsin']
];
let markov = new Array();
let sumOfFollowers = new Array();
let indexer = new Array();
let string,initial,follower,index,found,stop;
// build markov array
index=0;
for (let i=0; i<input.length; i++) { // loop through each sentence provided
	string=input[i].toString().split(' '); // convert each sentence to array with a word per element
	for (let k=0; k<string.length-1; k++) { // loop through words in each sentence (stopping before last value because we want pairs of words)
		initial = string[k].toLowerCase();
		follower = string[k+1].toLowerCase();
		
		found=0;
		if (markov.length > 0) { // only need to do fancy stuff if array exists
			// loop through existing markov array to search for existing values for "initial"
			for (let p=0; p<markov.length && !found; p++) {
				// found an existing entry for this "initial" value
				if (markov[p][0]==initial) {
					found=1;
					sumOfFollowers=markov[p][1];
					sumOfFollowers.push(follower);
					markov[p][1] = sumOfFollowers;
				}
			}
			// if "initial" does not exist
			if (!found) {
				index = markov.push([initial,[follower]]);		
			}
		// if markov array does not exist 
		} else {
			index = markov.push([initial,[follower]]);
		}
	}
}

// choose a word at random to start sentence with
const randomIndex = Math.floor(Math.random() * input.join(' ').split(' ').length);
startWord=input.join(' ').split(' ')[randomIndex];
console.log('Start Word: ' + startWord);
//
found=0;
let length;
for (i=0;i<markov.length && !found;i++) {
	if (startWord == markov[i][0]) {
		length=markov[i][1].length;		
		nextWordIndex=Math.floor(Math.random() * length);
		nextWord=markov[i][1][nextWordIndex];
		console.log('Next Word: ' + nextWord);
		found=1;
	}
}
if (!found) console.log('Next Word: N/A');
//console.log(Math.floor(Math.random() * 3)+1);
// print markov data
//console.log(markov);