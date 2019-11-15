//const originalInput = 'hello everybody and hi folks. hello everybody and goodbye. hi people out there. hello people in outer space. how are the bananas in Wisconsin. How is the family farm. how are the kids these days. wide are the lakes in Wisconsin. Some times you just gotta leave buddy. Buddy you are not going to win. Lakes are not where you want to say hi. They are some times that you are a pain in the ass. The ass is the primary lake in space.';
//const originalInput = 'The course of true love never did run smooth. Be not afraid of greatness some are born great some achieve greatness and some have greatness thrust upon them. Neither a borrower nor a lender be for loan oft loses both itself and friend. All the worlds a stage and all the men and women merely players. All that glistens is not gold. Love sought is good but given unsought is better. Who ever loved that loved not at first sight. If music be the food of love play on. Love is blind and lovers cannot see. The pretty follies that themselves commit. Methought I was enamoured of an ass. When you depart from me sorrow abides and happiness takes his leave. The fool doth think he is wise but the wise man knows himself to be a fool. But soft what light through yonder window breaks. It is the east and Juliet is the sun. The rivals of my watch, bid them make haste. I think I hear them. Stand ho. Who is there.';
const originalInput='There are more things in Heaven and Earth Horatio than are dreamt of in your philosophy. Now cracks a noble heart. Goodnight sweet prince. And flights of angels sing thee to thy rest. When sorrows come they come not single spies. But in battalions. To be or not to be that is the question. Whether tis nobler in the mind to suffer. The slings and arrows of outrageous fortune. Or to take arms against a sea of troubles. And by opposing end them. To die. There are more things in Heaven and Earth Horatio than are dreamt of in your philosophy. Now cracks a noble heart. Good Night Sweet prince. And flights of angels sing thee to thy rest. When sorrows come. they come not single spies But in battalions. To be or not to be. that is the question. Whether tis nobler in the mind to sufferThe slings and arrows of outrageous fortune.Or to take arms against a sea of troubles. And by opposing end them. To die. to sleep No more and by a sleep to say we end The heartache and the thousand natural shocks That flesh is heir to. tis a consummation Devoutly to be wishd. To die to sleep. To sleep perchance to dream. ay theres the rub. For in this sleep of death what dreams may come. Though this be madness. yet there is method in. Sweets to the sweet. God hath given you one face. and you make yourself another. Conscience doth make cowards of us all. One may smile and smile and be a villain. The lady doth protest too much methinks. This above all to think own self be true. And it must follow as the night the day. Thou canst not then be false to any man. From this day to the ending of the world. But we in it shall be remembered. We few we happy few. we band of brothers. For he today that sheds his blood with me Shall be my brother be he neer so vile. This day shall gentle his condition. And gentlemen in England nowabed Shall think themselves accursd they were not here. And hold their manhoods cheap whiles any speaks That fought with us upon Saint Crispins day. Love is a smoke made with the fume of sighs. Parting is such sweet sorrow. that I shall say goodnight till it be morrow. By the pricking of my thumbs Something wicked this way comes. Do you not know I am a woman. when I think I must speak. I do love nothing in the world so well as you is not that strange. Lord what fools these mortals be. Sigh no more ladies sigh no more. Men were deceivers ever. One foot in sea and one on shore. To one thing constant never. Let me be that I am and seek not to alter me. All the worlds a stage. And all the men and women merely players. They have their exists and their entrances And one man in his time plays many parts. His acts being seven ages.The course of true love never did run smooth. Cowards die many times before their deaths. The valiant never taste of death but once. Of all the wonders that I yet have heard. It seems to me most strange that men should fear Seeing that death a necessary end Will come when it will come. Why man he doth bestride the narrow world Like a Colossus and we petty men Walk under his huge legs and peep about To find ourselves dishonourable graves. Men at some time are masters of their fates. The fault dear Brutus is not in our stars but in ourselves that we are underlings. Et tu Brute. O beware my lord of jealousy. It is the greeneyd monster. which doth mock The meat it feeds on. All that glisters is not gold. Often have you heard that told Many a man his life hath sold But my outside to behold. Gilded tombs do worms enfold.The devil can cite Scripture for his purpose. Good night good night parting is such sweet sorrow. That I shall say good night till it be morrow. Better three hours too soon than a minute too late. Wisely and slow they stumble that run fast. But soft what light through yonder window breaks. It is the east and Juliet is the sun. Tomorrow and tomorrow and tomorrow. Creeps in this petty pace from day to day. To the last syllable of recorded time And all our yesterdays have lighted fools The way to dusty death. Out out brief candle. Lifes but a walking shadow a poor player. That struts and frets his hour upon the stage. And then is heard no more. It is a tale Told by an idiot full of sound and fury Signifying nothing. Whats done cannot be undone. Double  double toil and trouble Fire burn and cauldron bubble. Stars hide your fires Let not light see my black and deep desires. The fool doth think he is wise but the wise man knows himself to be a fool. Hell is empty and all the devils are here. Be not afraid of greatness. Some are born great some achieve greatness and others have greatness thrust upon them Love all. trust a few. do wrong to none. If music be the food of love Play on. Give me excess of it that surfeiting. The appetite may sicken and so die. The first thing we do lets kill all the lawyers. Our revels now are ended. These our actors. As I foretold you were all spirits and Are melted into air into thin air.And like the baseless fabric of this vision. The cloudcappd towers. the gorgeous palaces. The solemn temples. the great globe itself. Yea  all which it inherit shall dissolve And like this insubstantial pageant faded. Leave not a rack behind. We are such stuff As dreams are made on and our little life Is rounded with a sleep. Whats past is prologue. Me poor man. my library. Was dukedom large enough. Oft expectation fails. and most oft there where most it promises.';
window.onload = () => {
	let input,markov,startWord
	document.querySelector('#build').setAttribute('disabled','');
	input=originalInput.split('. '); // convert string to array of sentences
	document.addEventListener('click', event => {
		const element=event.target; // HTML node that is clicked
		if (element.id == 'init') markov = initialize(input); // generate markov array
		if (element.id == 'build') {
			startWord=getRandomWord(input); // Choose starting word randomly
			buildSentence(markov,startWord); // build sentence
		}
	}, false);
}
const buildSentence = (markov,startWord) => {
	//
	if (!markov) return false;

	let sentenceDIV=document.getElementById('content')
	// clear last sentence
	sentenceDIV.innerHTML = '';
	// print to screen
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
	} while (currentIndex!=-1 || counter>30); // hard coded infinite loop breaker
	sentenceDIV.innerHTML = sentenceDIV.innerHTML.slice(0,-1) + '.'; // remove last space + period

	
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
		for (let k=0; k<sentence.length-1; k++) { // loop through each word in sentence to get pairs
			initial = sentence[k].toLowerCase();
			follower = sentence[k+1].toLowerCase();
			if (!markov.length) { // if array doesn't exist, create it 
				markov.push([initial,[follower]]);
			} else { // only need to do fancy logic if array exists
				index = markov.findIndex(word => word[0] == initial) // look for index of "initial" value in array
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
	document.querySelector('#build').removeAttribute('disabled');
	document.querySelector('#init').setAttribute('disabled','');
	console.log(markov);
	return markov;
}