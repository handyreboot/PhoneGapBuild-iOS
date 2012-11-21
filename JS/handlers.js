// To be used in PhoneGap Version
function changeView(view) {
	//debug('#/'+view);
	location.href = '#/'+view;
}
function backButton(prevLocation) {
	location.href = prevLocation;
}
// Stack Data Structure with only push and pop functions;
function Stack() {
	this.stack = new Array();
	
	this.pop = function() {
		return this.stack.pop();
	}
	
	this.push = function(item) {
		return this.stack.push(item);
	}
}

function debug(message) {
	//console.log("MEASUREDHS >>> "+message);
}