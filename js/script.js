/* Author:Alex Zelenskiy */

//returns new cloned array minus first element of input.
function chopArray(arr){
	var clone = arr.slice(0);
	clone.shift();
	return clone;
}

//Recursive function that fills a passed array with result totals
function recursiveOdds(runningTotal, diceLeft, outcomes){
	//base case
	if(diceLeft.length === 1){
		for(var i = 1; i <= diceLeft[0]; i++){
			var target = runningTotal + i;
			if(typeof outcomes[target] === 'undefined'){
				outcomes[target] = 1;
			}
			else{
				outcomes[target]++;
			}
		}
	}
	//run function again with all possibilities of current die
	else{
		var newDiceLeft = chopArray(diceLeft);
		for (var i = 1; i <= diceLeft[0]; i++){
			var newTotal = runningTotal + i;
			recursiveOdds(newTotal, newDiceLeft, outcomes);
		}
	}
}

//Inserts a row into the results table
function insertRow(result, combinations, percentage){
	var tableRef = document.getElementById('results');
	var newRow   = tableRef.insertRow(-1);

	// Let's set up our cells
	var resultCell  = newRow.insertCell(-1);
	var combinationsCell  = newRow.insertCell(-1);
	var percentageCell  = newRow.insertCell(-1);

	// Get that data in there
	$(resultCell).append(result);
	$(combinationsCell).append(combinations);
	$(percentageCell).append(percentage).addClass('percent');
}

//Scrapes dice out of the UI elements and returns an array of them
function getDice(){
	var dice = [];

	$('.die-field').each(function(){
		dice.push($(this).val());
	});

	return dice;
}

//update precent total of selected options
function updateTotal(){
	var selectedFields = $('#results .active .percent'), 
		total = 0;
	
	//TODO: Javascript floats suck :( convert to integers first!
	selectedFields.each(function(){
		total = total + Number($(this).text());
	});

	$('#total').empty().append(total.toFixed(4));
}

$(document).ready(function() {
	//zero out total for good measure
	updateTotal();
	
	// bind me some events
	$('#calculate').click(function() {
		var dice = getDice(),
			results = [],
			totalCombos = 0;
		
		//delete current table cells
		var headers = $('.header-row');
		$('#results').empty().append(headers);
		
		//calculate all possible rolls
		recursiveOdds(0, dice, results);
		
		var len = results.length;
		//get total combinations
		for (var i = 1; i < len; i++){
			if(typeof results[i] === 'undefined'){
				//impossible result. don't do anything.
			}
			else{
				totalCombos = totalCombos + results[i];
			}
		}
		//print rows
		for (var i = 1; i < len; i++){
			if(typeof results[i] === 'undefined'){
				//impossible result. don't do anything.
			}
			else{
				insertRow(i, results[i], ((results[i]/totalCombos)*100).toFixed(4));
			}
		}
		
		//reset total since no rows are selected now
		updateTotal();
	});

	$('#add-dice').click(function() {
		var list = $('#dice ol'),
			template = list.find('li').first(), 
			newNode = template.clone(false);

		list.append(newNode);
	});
	
	$('#results tr').live('click', function(){
		$(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
		
		updateTotal();
	});

});
