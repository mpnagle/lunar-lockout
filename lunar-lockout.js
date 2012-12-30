var grid = [];

for (var i=0; i<5; i++)
{
    grid[i]= ["","","","",""];
}

//from JS: The Good Parts ... overkill? i don't know!
if (typeof Object.create !== 'function') {
    Object.create = function(o) {
	var F = function() {};
	F.prototype = o;
	return new F();
    };
}


function makeRobot (row, col, icon, color){
    
    return {
	"row": row,
	"col": col,
	"selector": "#" + row + col,
	"icon": icon,
	"string": "<p class='robot " + color + "'>" + icon + "</p>",
	"color": color,
	"selected": "no"
    };
}


var redRobot = makeRobot ("e",5,"R","red");

var blueRobot = makeRobot("c",2,"B","blue");

var greenRobot = makeRobot ("b",3,"G","green");

var yellowRobot = makeRobot ("d",4,"Y","yellow");

var orangeRobot = makeRobot ("a",5,"O","orange");

function iconToRobot (icon){
    switch (icon){
    case "R":
	return redRobot;
	break;
    case "B": 
	return blueRobot;
	break;
    case "G":
	return greenRobot;
	break;
    case "O":
	return orangeRobot;
	break;
    case "Y":
	return yellowRobot;
	break;

    }
}

/*var redRobot = {
    "row": "c",
    "col": 5,
    "selector": "#c5",
    "icon": "X",
    "string": "<p>X</p>",
    "color": "red"
}


var blueRobot = Object.create(redRobot);
blueRobot.row = "e";
blueRobot.col = 2;
*/



var robotRow = "c";
var robotCol = 5;
var robotSelector = "#" + robotRow + robotCol;

var robotIcon = "X";
var robotString = "<p>" + robotIcon + "</p>";

function robotUpdate(robot, row, col)
{
    $(robot.selector).html("");
    robot.selector = "#" + row + col;
    
    $(robot.selector).html(robot.string);
}

function robotLeft(robot)
{
    
    while (robot.col > 1 && checkLeft(robot) && lineOfSightLeft(robot))
    {	
	
	
	robot.col = robot.col - 1;	
	robotUpdate(robot,robot.row, robot.col);
    }
    
}


function checkLeft(robot)
{
    var oneSpaceLeft = "#" + robot.row + (robot.col - 1);

    return ($(oneSpaceLeft).html() == "");
}

function lineOfSightRight(robot)
{
    for (var i=5; i> robot.col; i--)
    {
	var currentSquare = "#" + robot.row + i;
	if ($(currentSquare).html() != "") return true;
    }
    
    return false;
}

function robotRight(robot)
{
    while (robot.col < 5 && checkRight(robot) && lineOfSightRight(robot))
    {
	robot.col = robot.col + 1;
	robotUpdate(robot,robot.row, robot.col);
    }
}



function checkRight(robot)
{
    var oneSpaceRight = "#" + robot.row + (robot.col + 1);

    return ($(oneSpaceRight).html() == "");
}


function lineOfSightLeft(robot)
{
    for (var i=1; i< robot.col; i++)
    {
	var currentSquare = "#" + robot.row + i;
	if ($(currentSquare).html() != "") return true;
    }
    
    return false;
}


function robotUp(robot)
{
    console.log(robot);
    console.log(Session.get("robotSelected"));
    
    //who knew this comparison would work!
    while (robot.row > "a" && checkUp(robot) && lineOfSightUp(robot))
    {

	//string --> num ---> -1 --> back to string. thank you stack overflow! 
	var rowInt = robot.row.charCodeAt();
	rowInt = rowInt - 1;
	robot.row = String.fromCharCode(rowInt);	
	robotUpdate(robot,robot.row, robot.col);
    }
}

function checkUp(robot)

{
    var oneRowUp = String.fromCharCode (robot.row.charCodeAt() - 1 );

    var oneSpaceUp = "#" + oneRowUp + robot.col;

    return ($(oneSpaceUp).html() == "");
}


function lineOfSightUp(robot)
{
    var rowAsNumber = robot.row.charCodeAt();

    for (var i=97; i < rowAsNumber; i++)
    {
	
	var currentRow = String.fromCharCode(i);
	var currentSquare = "#" + currentRow + robot.col;
	if ($(currentSquare).html() != "") return true;
    }
    
    return false;
}



function robotDown(robot)
{
    while (robot.row < "e" && checkDown(robot) && lineOfSightDown(robot))
    {
	rowInt = robot.row.charCodeAt();
	rowInt = rowInt + 1;
	robot.row = String.fromCharCode(rowInt);

	robotUpdate(robot,robot.row, robot.col);
    }

}



function checkDown(robot)
{
    var oneRowDown = String.fromCharCode (robot.row.charCodeAt() + 1 );

    var oneSpaceDown = "#" + oneRowDown + robot.col;

    return ($(oneSpaceDown).html() == "");
}


function lineOfSightDown(robot)
{
    var rowAsNumber = robot.row.charCodeAt();

    for (var i=101; i > rowAsNumber; i--)
    {
	
	var currentRow = String.fromCharCode(i);
	var currentSquare = "#" + currentRow + robot.col;
	if ($(currentSquare).html() != "") return true;
    }
    
    return false;
}




if (Meteor.isClient) {

    Meteor.defer(function(){
	$(redRobot.selector).html(redRobot.string);
	$(blueRobot.selector).html(blueRobot.string);
	$(yellowRobot.selector).html(yellowRobot.string);
	$(greenRobot.selector).html(greenRobot.string);
	$(orangeRobot.selector).html(orangeRobot.string);
	Session.set("iconSelected", "R");
	
    });


    
    Template.grid.events({
	'click': function(evt) {
	    if (evt.target.innerHTML) 
	    {				
//		var currentRobot = iconToRobot(evt.target.innerHTML);		
		Session.set("iconSelected", evt.target.innerHTML);
	    }
	}
    });


$(document).keydown(function(evt){

    var robotSelected = iconToRobot(Session.get("iconSelected"));
    switch(evt.keyCode)
    {

	//left arrow
    case 37:
	robotLeft(robotSelected);
	break;
	//up arrow
    case 38:
	robotUp(robotSelected);
	break;
	//right arrow
    case 39:
	robotRight(robotSelected);
	break;
	//down arrow
    case 40:
	robotDown(robotSelected);
	break;
    }

});



}






if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
