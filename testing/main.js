/*const input = [
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
];*/
const input = [
	['The course of true love never did run smooth'],
	['Be not afraid of greatness: some are born great some achieve greatness and some have greatness thrust upon them'],
	['Neither a borrower nor a lender be for loan oft loses both itself and friend'],
	['All the worlds a stage and all the men and women merely players'],
	['All that glistens is not gold'],
	['Love sought is good but given unsought is better'],
	['Who ever loved that loved not at first sight'],
	['If music be the food of love play on'],
	['Love is blind, and lovers cannot see, The pretty follies that themselves commit'],
	['Methought I was enamoured of an ass'],
	['When you depart from me sorrow abides and happiness takes his leave'],
	['The fool doth think he is wise but the wise man knows himself to be a fool'],
	['But soft what light through yonder window breaks'],
	['It is the east and Juliet is the sun']
];
window.onload = () => {
	let markov = [], allFollowers = [];
	let initial,follower,valueFound,i;
	// build markov array
	for (let sentence of input) { // loop through each sentence provided
		sentence=sentence.toString().split(' '); // convert each sentence to array with a word per element
		for (let k=0; k<sentence.length-1; k++) { // loop through words in each sentence (stopping before last value because we want pairs of words)
			initial = sentence[k].toLowerCase();
			follower = sentence[k+1].toLowerCase();
			// logic for adding values to markov array
			if (!markov.length) { 
				markov.push([initial,[follower]]);
			} else { // only need to do fancy stuff if array exists
				// loop through existing markov array to search for existing values for "initial"
				valueFound=0;
				for (i=0; i<markov.length && !valueFound; i++) {
					if (markov[i][0]==initial) { // found an existing entry for this "initial" value
						valueFound=1;
						// save off existing values and push new value into the array
						allFollowers=markov[i][1];
						allFollowers.push(follower);
						markov[i][1] = allFollowers;
					}
				}
				// if "initial" value does not exist yet, add it without any fuss
				if (!valueFound && i == markov.length) markov.push([initial,[follower]]);
			}
		}
	}
	// Choose starting position
	let startWord=getRandomWord(input);
	document.getElementById('content').append(startWord + ' ');

	// look for the most likely next word
	let nextWord;
	do {
		valueFound=0;
		nextWord='';
		for (i=0;i<markov.length && !valueFound;i++) {
			if (startWord == markov[i][0]) { // search for array position
				// the arrays are already populated by probability so choose randomly	
				nextWord = getNextWord(markov,i);		
				document.getElementById('content').append(nextWord + ' ');
				valueFound=1;
				startWord=nextWord; // pass this on to the next loop
			}
		}
		i++;
	} while (valueFound || i>100);

	// print out array for review
	console.log(markov);
}
// choose a random word from the array given
const getRandomWord = input => {
	const randomIndex = Math.floor(Math.random() * input.join(' ').split(' ').length);
	return input.join(' ').split(' ')[randomIndex].toLowerCase();
}
// returns the next word given the current word
const getNextWord = (markov,i) => {
	const nextWordIndex=Math.floor(Math.random() * markov[i][1].length);
	return markov[i][1][nextWordIndex];
}