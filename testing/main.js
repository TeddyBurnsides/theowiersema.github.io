const data = [
	['hello everybody and hi folks'],
	['hello everybody'],
	['hi people'],
	['hello people'],
	['how are the bananas'],
	['How is the family'],
	['how are the kids'],
	['wide are the lakes']
];
let markov = new Array();
let sumOfFollowers = new Array();
let indexer = new Array();
let string,initial,follower,index,found,stop;
// build markov array
index=0;
for (let i=0; i<data.length; i++) { // loop through each sentence provided
	string=data[i].toString().split(' '); // convert each sentence to array with a word per element
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
const startIndex = Math.floor(Math.random() * data.length);
const startWord = data[startIndex].toString().split(' ')[0]; 
//console.log('Start Word: ' + startWord);

// print markov data
console.log(markov);