const input = [
	['hello everybody and hi folks'],
	['hello everybody and goodbye'],
	['hi people out there'],
	['hello people in outer space'],
	['how are the bananas in Wisconsin'],
	['How is the family farm'],
	['how are the kids these days'],
	['wide are the lakes in Wisconsin'],
	['Some times you just gotta leave buddy'],
	['Buddy you are not going to win'],
	['Lakes are not where you want to say hi'],
	['They are some times that you are a pain in the ass'],
	['The ass is the primary lake in space']
];
let markov = new Array();
let sumOfFollowers = new Array();
let string,initial,follower,index,found,stop;
// build markov array
for (let i=0; i<input.length; i++) { // loop through each sentence provided
	string=input[i].toString().split(' '); // convert each sentence to array with a word per element
	for (let k=0; k<string.length-1; k++) { // loop through words in each sentence (stopping before last value because we want pairs of words)
		initial = string[k].toLowerCase();
		follower = string[k+1].toLowerCase();
		// logic for adding values to markov array
		if (markov.length > 0) { // only need to do fancy stuff if array exists
			// loop through existing markov array to search for existing values for "initial"
			found=0;
			for (let p=0; p<markov.length && !found; p++) {
				// found an existing entry for this "initial" value
				if (markov[p][0]==initial) {
					found=1;
					// save off existing values and push new value into the array
					sumOfFollowers=markov[p][1];
					sumOfFollowers.push(follower);
					markov[p][1] = sumOfFollowers;
				}
			}
			// if "initial" value does not exist yet, add it without any fuss
			if (!found) {
				markov.push([initial,[follower]]);		
			}
		// if markov array does not exist, start it off
		} else {
			markov.push([initial,[follower]]);
		}
	}
}
// Choose a word at random from the input string to start with
const randomIndex = Math.floor(Math.random() * input.join(' ').split(' ').length);
startWord=input.join(' ').split(' ')[randomIndex].toLowerCase();
console.log(startWord);
document.getElementById('content').append(startWord + ' ');

// look for the most likely next word
let quit;
i=0;
do {
	found=0;
	nextWord='';
	for (i=0;i<markov.length && !found;i++) {
		if (startWord == markov[i][0]) {
			// the arrays are already populated by probability so choose randomly	
			nextWordIndex=Math.floor(Math.random() * markov[i][1].length);
			nextWord=markov[i][1][nextWordIndex];
			console.log(nextWord);
			document.getElementById('content').append(nextWord + ' ');
			found=1;
			startWord=nextWord // pass this on to the next loop
		}
	}
	// words that end sentences don't have a "follower"
	if (!found) console.log('N/A');

	//
	if (nextWord=='') {
		quit=1;
	}

	i++;
} while (!quit || i>100);

console.log(markov);