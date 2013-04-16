//variables for calculator/formula
	var income 						= 0;
	var income_tax_rate 			= 0;
	var income_tax_constant 		= 0;
	var income_tax_remainder 		= 0;
	var sales_tax 					= 0;
	var grocery_tax 				= 0;
	var grocery_bill 				= 0;
	var spent_on_taxable_items 		= 0;
	var spent_on_taxable_services	= 0;
	var total_taxes					= 0;

	//keep formula at top of screen
	$(document).ready(function() {
	    var s = $('#taxRates');
	    var f = $('#formula');
	    var pos = s.position();
	              
	    $(window).scroll(function() {
	        var windowpos = $(window).scrollTop();
	        if (windowpos >= pos.top+100) {
	        	f.show();
	            f.addClass('fixed');
	        } else {
	            f.removeClass('fixed'); 
	        }
		});

	});

	//make radio buttons and forms pretty, user friendly

	// SELECT BY CHOICE, CHANGE THE COLOR & SHOW APPROPRIATE DIVS
	$('button[id^="choice"]').click(function(){
		if($(this).not('.active')){
			var id = $(this).attr('choice');				// GET CHOICE NUMBER
			$('[id^="choice"]').removeClass('btn-success');	// REMOVE CLASSES FROM ALL CHOICES
			$(this).addClass('btn-success');				// ADD BTN-SUCCESS TO THIS CHOICE BUTTON
			$('[id^="choice"] i,div[id^="detail"]').hide();	// HIDE ALL CHOICE i AND DETAILS
			$('#choice'+id+' i, #detail'+id).show();		// SHOW THIS CHOICE i AND DETAIL

			// if(id == 1){									// IF #choice1, HIDE #services-input
			// 	$('#services-input').hide();				// HIDE QUESTION 5
			// } else if(id == 3){
			// 	$('[opt="question"]').hide();				// SHOW ALL
			// } else {
			// 	$('[opt="question"]').show();				// SHOW ALL
			// }
		}
	});

	// SELECT BY TAX, CHANGE THE COLOR & SHOW APPROPRIATE DIVS
	$('button[id^="tax"]').click(function(){
		if ($(this).not('.active')) {
			var id = $(this).attr('tax');
			$('[id^="tax"]').removeClass('btn-success');	// REMOVE CLASSES FROM ALL CHOICES
			$(this).addClass('btn-success');				// ADD BTN-SUCCESS TO THIS CHOICE BUTTON

			// if(id != '1'){									// EMPTY DIVS IF NOT TAX #1
			// 	$('#formula_income, #result_displayed').empty();
			// }
		}
	});

	//generating the formula
	$('input, button').bind('keyup click', function() {
		var this_id = $(this).attr('id'); 
		$('#formula_income, #result_displayed').empty();

		if($('#input2').val()){	income 		 				= parseInt($('#input2').val());}
		if($('#input3').val()){	grocery_bill 				= parseInt($('#input3').val());}
		if($('#input4').val()){	spent_on_taxable_items 		= parseInt($('#input4').val());}
		if($('#input5').val()){	spent_on_taxable_services 	= parseInt($('#input5').val());}
		

		/* Start filing status function */
		function get_tax_rates(this_id){
			if 	(this_id === 'tax1'){	// Files Single, Current Rates
				filing_type 		= 1;
				// Based on amount of income
				if (income > 60000){
					income_tax_rate = .0775;
					income_tax_constant = 4072.5;
					income_tax_remainder = 60000;
				}else if (income > 12750 && income <=60000) {
					income_tax_rate = .07;
					income_tax_constant = 765;
					income_tax_remainder = 12750;
				}else{
					income_tax_rate = .06;
					income_tax_constant = 0;
					income_tax_remainder = 0;
				};
			
			} else if 	(this_id === 'tax2'){	// Files as Head of Household, Current Rates
				filing_type 		= 2;
				if (income > 80000){
					income_tax_rate = .0775;
					income_tax_constant = 5430;
					income_tax_remainder = 80000;
					income_tax_remainder = 0;
				}else if (income > 17000 && income <=80000) {
					income_tax_rate = .07;
					income_tax_constant = 1020;
					income_tax_remainder = 17000;
				}else{
					income_tax_rate = .06;
					income_tax_constant = 0;
					income_tax_remainder = 0;
				};
			
			} else if 	(this_id === 'tax3'){	// Married jointly or widower, Current Rates
				filing_type 		= 3;
				if (income > 100000){
					income_tax_rate = .0775;
					income_tax_constant = 6787.5;
					income_tax_remainder = 100000;
				}else if (income > 21250 && income <=100000) {
					income_tax_rate = .07;
					income_tax_constant = 1275;
					income_tax_remainder = 21250;
				}else{
					income_tax_rate = .06;
					income_tax_constant = 0;
					income_tax_remainder = 0;
				};
			
			} else if 	(this_id === 'tax4'){	// Married filing separately, Current Rates
				filing_type 		= 4;
				if (income > 50000){
					income_tax_rate = .0775;
					income_tax_constant = 3393.75;
					income_tax_remainder = 50000;
				}else if (income > 10625 && income <=50000) {
					income_tax_rate = .07;
					income_tax_constant = 637.5;
					income_tax_remainder = 10625;
				}else{
					income_tax_rate = .06;
					income_tax_constant = 0;
					income_tax_remainder = 0;
				};
			}
		}
		/* End filing status function */

		// If filing status is clicked
		get_tax_rates(this_id);

		// IF CHOICE1 IS ACTIVE, RECALCULATE GET_TAX_RATES
		if($('#choice1').hasClass('active')){
			get_tax_rates('tax'+filing_type);
		}

		// SET CHOICES BASED ON VARIABLES CLICKED
		if 			(this_id === 'choice1'){					// Current Tax Rates
			formula_type 		= 1;
			sales_tax 			= 0.0675;
			grocery_tax 		= 0.02;
			
			var active_tax 		= $('[id^="tax"][class="active"]').attr('id');		
			if(active_tax){
				get_tax_rates(active_tax);						// If filing status has been selected, calculate it.
			}
			
		
		} else if 	(this_id === 'choice2'){					// No Income Tax, Increased Sales Tax
			formula_type		= 2;
			sales_tax 			= .0805;
		
		} else if 	(this_id === 'choice3'){					// No Sales Tax, Increased Income Tax
			formula_type 				= 3;
			increased_income_tax_rate 	= .1;
		
		}

		// CREATE AND DISPLAY FORMULAS
		if(formula_type === 1){
			total_taxes = parseFloat((income_tax_rate*(income - income_tax_remainder) + income_tax_constant) + (grocery_tax*(52*grocery_bill)) + (sales_tax*(52*spent_on_taxable_items))).toFixed(2);
			$('#formula_income').append('['+income_tax_rate+'('+income+ ' - ' +income_tax_remainder+ ') + ' +income_tax_constant+ '] + [' +grocery_tax+ '(52 * ' +grocery_bill+ ')] + [' +sales_tax+ '(52 * ' +spent_on_taxable_items+ ')] = ');

		} else if(formula_type === 2){
			total_taxes = parseFloat(sales_tax*(52*(spent_on_taxable_items + grocery_bill + spent_on_taxable_services))).toFixed(2);
			$('#formula_income').append('[' +sales_tax+ '(52(' +grocery_bill+ ' + ' +spent_on_taxable_items+ ' + ' +spent_on_taxable_services+ '))] = ');

		} else if(formula_type === 3){
			total_taxes = parseFloat(increased_income_tax_rate*income).toFixed(2);
			$('#formula_income').append('['+increased_income_tax_rate+'('+income+ ')] = ');
		}


		$('#result_displayed').html('$'+total_taxes).wrap('<b>');
	});
