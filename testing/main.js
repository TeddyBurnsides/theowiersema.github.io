const originalInput = 'hello everybody and hi folks. hello everybody and goodbye. hi people out there. hello people in outer space. how are the bananas in Wisconsin. How is the family farm. how are the kids these days. wide are the lakes in Wisconsin. Some times you just gotta leave buddy. Buddy you are not going to win. Lakes are not where you want to say hi. They are some times that you are a pain in the ass. The ass is the primary lake in space.';
//const originalInput = 'The course of true love never did run smooth. Be not afraid of greatness some are born great some achieve greatness and some have greatness thrust upon them. Neither a borrower nor a lender be for loan oft loses both itself and friend. All the worlds a stage and all the men and women merely players. All that glistens is not gold. Love sought is good but given unsought is better. Who ever loved that loved not at first sight. If music be the food of love play on. Love is blind and lovers cannot see. The pretty follies that themselves commit. Methought I was enamoured of an ass. When you depart from me sorrow abides and happiness takes his leave. The fool doth think he is wise but the wise man knows himself to be a fool. But soft what light through yonder window breaks. It is the east and Juliet is the sun';

window.onload = () => {

	let input=originalInput.split('. '); // convert string to array of sentences
	let markov = initialize(input); // build markov array
	let startWord=getRandomWord(input); // Choose starting word randomly

	// print to screen
	let sentenceDIV=document.getElementById('content')
	sentenceDIV.append(startWord.charAt(0).toUpperCase() + startWord.slice(1) + ' '); // uppercase first letter

	// build sentence
	let nextWord,counter,currentIndex;
	do {
		currentIndex = markov.findIndex(word => word[0] == startWord);
		if (currentIndex!=-1) { // found value
			nextWord = getNextWord(markov,currentIndex); // get the most probable next word
			startWord=nextWord; // allows loop to look for the next word in the sentence
			sentenceDIV.append(nextWord + ' '); // print to screen
		}
		counter++;
	} while (currentIndex!=-1 || counter>100); // hard coded infinite loop breaker
	sentenceDIV.innerHTML = sentenceDIV.innerHTML.slice(0,-1) + '.'; // remove last space + period

	console.log(markov); // print out array for review
}
// choose a random word from the array given
const getRandomWord = input => {
	const randomIndex = Math.floor(Math.random() * input.join(' ').split(' ').length);
	return input.join(' ').split(' ')[randomIndex].toLowerCase();
}
// returns the next word given the current word
const getNextWord = (markov,index) => {
	const nextWordIndex=Math.floor(Math.random() * markov[index][1].length);
	return markov[index][1][nextWordIndex];
}
// generate markov array
const initialize = input => {
	let initial,follower,index,markov = [],allFollowers  = [];
	for (let sentence of input) { // loop through each sentence provided
		sentence=sentence.toString().split(' '); // convert each sentence to array with a word per element
		for (let k=0; k<sentence.length-1; k++) { // loop through words in each sentence (stopping before last value because we want pairs of words)
			initial = sentence[k].toLowerCase();
			follower = sentence[k+1].toLowerCase();
			// logic for adding values to markov array
			if (!markov.length) { 
				markov.push([initial,[follower]]);
			} else { // only need to do fancy stuff if array exists
				index = markov.findIndex(word => word[0] == initial) // look for existance of "initial" value in array
				if (index!=-1) { // if found, append new value
					allFollowers=markov[index][1];
					allFollowers.push(follower);
					markov[index][1] = allFollowers;			
				} else {
					markov.push([initial,[follower]]);
				}
			}
		}
	}
	return markov;
}