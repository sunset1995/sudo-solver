
function position(obj){
	this.row = obj.row;
	this.col = obj.col;
	this.dom = Q('#r'+(obj.row+1)+'c'+(obj.col+1) );
	this.val = obj.val || 0;
	this.numCan = obj.numCan || 9;
	this.theOnlyOne = obj.theOnlyOne || 0;
	this.can = [];

	this.ready();
}

position.prototype.ready = function(){
	this.val = parseInt( this.dom.children[0].value , 10 );
	if( !(this.val>=1 && this.val<=9) )
		this.val = 0;
	this.numCan = 9;
	this.theOnlyOne = 0;

	for(var i=0;i<10;++i)
		this.can[i] = true;
}

position.prototype.clean = function(){
	this.dom.children[0].value = '';
}

position.prototype.setVal = function(v , next){
	++recurCnt;
	if( v=='' ){
		this.dom.children[0].value = v;
		this.val = 0;
	}
	else{
		this.dom.children[0].value = v;
		this.val = v;
	}
	if( recurCnt > 100 ){
		setTimeout( function(){
			next();
		} , 0);
		recurCnt = 0;
	}
	else
		next();
}

position.prototype.bigBlockID = function(){
	var belong = parseInt(this.col/3 , 10) + parseInt( this.row/3 , 10 ) * 3;
	return belong;
};

position.prototype.onePossibility = function(){
	if( this.val ) return 0;
	return this.theOnlyOne;
};

position.prototype.delPossibility = function(which){
	if( which<1 || which>9 ) return;
	if( this.val ) return;
	if( !this.can[which] ) return;
	this.can[which] = false;
	this.numCan--;
	if( this.numCan==1 )
		for(var i=1;i<=9;++i)
			if( this.can[i] ){
				this.theOnlyOne = i;
				return;
			}
}

position.prototype.isPossible = function(which){
	return this.can[which];
}
