
block = [];
sCompare = [];
rCompare = [];
cCompare = [];

var tmp = function (){
	for(var i=0 ; i<9 ; ++i){
		block[i] = [];
		sCompare[i] = [];
		rCompare[i] = [];
		cCompare[i] = [];
	}

	for(var i=0;i<9;++i){
		for(var j=0;j<9;++j){
			block[i][j] = new position({row:i , col:j});
			sCompare[ block[i][j].bigBlockID() ].push( block[i][j] );
			rCompare[i].push( block[i][j] );
			cCompare[j].push( block[i][j] );
		}
	}
}();

function init(){
	for(var i=0 ; i<9 ; ++i)
		for(var j=0 ; j<9 ; ++j)
			block[i][j].ready();
}

stCnt = 0;
rStack = [{re:false}];
stopSignal = false;
showProcessOn = true;
maxRecurDepth = 1;
priList = [];
nowPri = 0;

function ans(){
	stCnt = 0;
	recurCnt = 0;
	Q('#info').innerHTML = "";
	stopSignal = false;
	rStack = [{re:false}];
	init();

	priList = [];
	for(var i=0 ; i<9 ; ++i)
		for(var j=0 ; j<9 ; ++j)
			if( block[i][j].val == 0 )
				priList.push( block[i][j] );
	nowPri = 0;

	for(var i=0 ; i<priList.length ; ++i){
		var sqrG = priList[i].bigBlockID();
		var rowG = priList[i].row;
		var colG = priList[i].col;
		for(var j=0; j<9; ++j ){
			priList[ i ].delPossibility( 
				parseInt( sCompare[sqrG][j].val , 10)
			);
			priList[ i ].delPossibility( 
				parseInt( rCompare[rowG][j].val , 10)
			);
			priList[ i ].delPossibility( 
				parseInt( sCompare[sqrG][j].val , 10)
			);
		}
	}

	priList.sort( function(a , b){
		return a.numCan > b.numCan;
	} );
	dfsMain();
}
/*
function dfsMain(r , c) {
	var i = r || 0;
	var j = c || 0;
	for(var i=0;i<9;++i)
		for(var j=0;j<9;++j)
			if( !block[i][j].val ){
				dfs(block[i][j]);
				return;
			}
	blinkInfo('Solved. Try '+stCnt+' states');
	rStack[ rStack.length - 1 ].re = true;
	stop();
}*/
function dfsMain(r , c){
	if( nowPri == priList.length ){
		blinkInfo('Solved. Try '+stCnt+' states');
		rStack[ rStack.length - 1 ].re = true;
		stop();
		return;
	}
	if( !priList[nowPri].val ){
		dfs( priList[nowPri] );
		return;
	}
}

function dfs(nowAt) {
	var ok = [];
	for(var i=1;i<=9;++i)
		ok[i] = 1;
	var sqrG = nowAt.bigBlockID();
	var rowG = nowAt.row;
	var colG = nowAt.col;
	for(var i=0; i<9; ++i ){
		ok[ sCompare[sqrG][i].val ] = false;
		ok[ rCompare[rowG][i].val ] = false;
		ok[ cCompare[colG][i].val ] = false;	
	}
	rStack.push({
		nowAt:nowAt,
		ok:ok,
		re:false
	});
	runRecur();
}

function runRecur(){
	if( rStack.length<=1 || stopSignal ){
		blinkInfo("Unsolvable");
		rStack.length = 0;
		stopSignal = false;
		stop();
		return;
	}
	var nowS = rStack[ rStack.length - 1 ];
	if( nowS.re == true ){
		rStack.pop();
		rStack[ rStack.length - 1 ].re = true;
		return;
	}
	for(var i=1;i<=9;++i){
		if( !nowS.ok[i] )
			continue;
		nowS.ok[i] = false;
		++stCnt;
		//Q('#info').innerHTML = 'Try '+stCnt+' states';
		++nowPri;
		nowS.nowAt.setVal( i , function(){
			dfsMain(nowS.row , nowS.col);
		} );
		return;
	}
	--nowPri;
	nowS.nowAt.setVal('' , function(){
		rStack.pop();
		rStack[ rStack.length - 1 ].re = false;
		runRecur();
	});
}

function heuristicMain(){

}




function start(){
	Q('#bruteforce').removeEventListener('click',start);
	Q('#bruteforce').addEventListener('click',stop);
	Qall('td input' , function(now){
		now.style.pointerEvents = 'none';
	});
	Q('#bruteforce').innerHTML = 'Stop';
	ans();
}
function stop(){
	stopSignal = true;
	Q('#bruteforce').removeEventListener('click',stop);
	Q('#bruteforce').addEventListener('click',start);
	Qall('td input' , function(now){
		now.style.pointerEvents = 'auto';
	});
	Q('#bruteforce').innerHTML = 'Start';
}
function clean(){
	stop();
	for(var i=0;i<9;++i)
		for(var j=0;j<9;++j)
			block[i][j].clean();
	Qall('#sudo td input' , function(now){
		now.className = now.className.replace(/bSetted/g,'');
	});
}
function showP(){
	if( showProcessOn ){
		showProcessOn = false;
		this.innerHTML = 'show process : off';
	}
	else{
		showProcessOn = true;
		this.innerHTML = 'show process : on';
	}
}

Q('#bruteforce').addEventListener('click' , start);
Q('#clean').addEventListener('click' , clean);
Q('#speedUp').addEventListener('click' , function(){
	if( maxRecurDepth<1000 )
		maxRecurDepth *= 10;
	Q('#info').innerHTML = "max recursion depth : " + maxRecurDepth;
});
Q('#slowDown').addEventListener('click' , function(){
	if( maxRecurDepth>1 )
		maxRecurDepth /= 10;
	Q('#info').innerHTML = "max recursion depth : " + maxRecurDepth;
});
/*
bool sudo::bfsMain(){
	bool haveOne = false;
	toBeVisit.clear();
	for(var i=0;i<9;++i)
		for(var j=0;j<9;++j)
			if( block[i][j].val && bfsLimitP( i , j , block[i][j].bigBlockID() , block[i][j].val ) )
				haveOne = true;

	while( !toBeVisit.empty() ){
		position *tmp = toBeVisit.back();
		toBeVisit.pop_back();
		if( tmp->val ) continue;
		tmp->val = tmp->onePossibility();
		bfsLimitP( tmp->row , tmp->col , tmp->bigBlockID() , tmp->val );
	}
	return haveOne;
}

bool sudo::bfsLimitP( var row , var col , var sq , var number ){
	bool haveOne = false;
	std::vector<position*>::iterator it;
	for( it=rCompare[row].begin(); it!=rCompare[row].end(); ++it ){
		(*it)->delPossibility(number);
		if( (*it)->onePossibility() ){
			toBeVisit.push_back(*it);
			haveOne = true;
		}
	}
	for( it=cCompare[col].begin(); it!=cCompare[col].end(); ++it ){
		(*it)->delPossibility(number);
		if( (*it)->onePossibility() ){
			toBeVisit.push_back(*it);
			haveOne = true;
		}
	}
	for( it=sCompare[sq].begin(); it!=sCompare[sq].end(); ++it ){
		(*it)->delPossibility(number);
		if( (*it)->onePossibility() ){
			toBeVisit.push_back(*it);
			haveOne = true;
		}
	}
	return haveOne;
}

void sudo::humanwayMain(){
	bfsMain();
	do{
		smartBlockSearch();
	}while( bfsMain() );
}

void sudo::smartMain(){
	bfsMain();
	smartBlockSearch();
	dfsMain();
}
void sudo::smartBlockSearch(){
	bool stillFind = true;
	while( stillFind ){
		stillFind = false;
		for(var i=0;i<9;++i){
			for(var nowVal=1;nowVal<=9;++nowVal)
				if( smartFind( i , nowVal ) )
					stillFind = true;
		}
	}
}
bool sudo::smartFind(var whichBlock,var nowVal){
	std::vector<position*>::iterator it;
	position *emptyCan = NULL;
	var P=9;
	for( it=sCompare[whichBlock].begin(); it!=sCompare[whichBlock].end(); ++it ){
		if( (*it)->val == nowVal ) return false;
		if( (*it)->val || !(*it)->isPossible(nowVal) )
			--P;
		else
			emptyCan = (*it);
	}
	if( emptyCan!=NULL && P==1 ){
		emptyCan->val = nowVal;
		bfsLimitP( emptyCan->row , emptyCan->col , emptyCan->bigBlockID() , emptyCan->val );
		return true;
	}
	return false;
}
*/