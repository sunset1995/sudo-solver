
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

function bruteForce(){
	stCnt = 0;
	recurCnt = 0;
	Q('#info').innerHTML = "";
	stopSignal = false;
	rStack = [{re:false}];
	init();

	dfsMain();
}

var heuristicFind = 0;
function heuristic(){
	init();
	heuristicFind = 0;
	humanwayMain();
	blinkInfo('Heuristic find '+heuristicFind+' directly');
}

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
		nowS.nowAt.setVal( i , function(){
			dfsMain(nowS.row , nowS.col);
		} );
		return;
	}
	nowS.nowAt.setVal('' , function(){
		rStack.pop();
		rStack[ rStack.length - 1 ].re = false;
		runRecur();
	});
}


function humanwayMain(){
	for(var i=0;i<9;++i)
		for(var j=0;j<9;++j)
			if( block[i][j].val )
				bfsLimitP( i , j , block[i][j].bigBlockID() , block[i][j].val );

	smartBlockSearch();
}
function bfsLimitP(row , col , sq , number){
	var haveOne = false;

	for(var i=0 ; i<rCompare[row].length ; ++i){
		rCompare[row][i].delPossibility(number);
		if( rCompare[row][i].onePossibility() ){
			haveOne = true;
		}
	}

	for(var i=0 ; i<cCompare[col].length ; ++i){
		cCompare[col][i].delPossibility(number);
		if( cCompare[col][i].onePossibility() ){
			haveOne = true;
		}
	}

	for(var i=0 ; i<sCompare[sq].length ; ++i){
		sCompare[sq][i].delPossibility(number);
		if( sCompare[sq][i].onePossibility() ){
			haveOne = true;
		}
	}
	return haveOne;
}
function smartBlockSearch(){
	var stillFind = true;
	while( stillFind ){
		stillFind = false;

		for(var i=0 ; i<rCompare.length ; ++i)
			for(var num=1 ; num<=9 ; ++num)
				if( findUnique( rCompare[i] , num ) )
					stillFind = true;

		for(var i=0 ; i<cCompare.length ; ++i)
			for(var num=1 ; num<=9 ; ++num)
				if( findUnique( cCompare[i] , num ) )
					stillFind = true;

		for(var i=0 ; i<sCompare.length ; ++i)
			for(var num=1 ; num<=9 ; ++num)
				if( findUnique( sCompare[i] , num ) )
					stillFind = true;
	}
}
function findUnique(bs , num){
	var cntCan = 0;
	var cand = null;
	for(var i=0 ; i<bs.length ; ++i){
		if( bs[i].val == num )
			return false;
		if( bs[i].val==0 && bs[i].can[num] )
			++cntCan , cand = bs[i];	
	}

	if( cntCan==1 ){
		++heuristicFind;
		cand.setVal(num , function(){});
		bfsLimitP(cand.row , cand.col , cand.bigBlockID() , cand.val);
		return true;
	}
	return false;
}




function start(){
	Q('#bruteforce').removeEventListener('click',start);
	Q('#bruteforce').addEventListener('click',stop);
	Qall('td input' , function(now){
		now.style.pointerEvents = 'none';
	});
	Q('#bruteforce').innerHTML = 'Stop';
	bruteForce();
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
Q('#heuristic').addEventListener('click' , heuristic);
/*



void sudo::smartMain(){
	bfsMain();
	smartBlockSearch();
	dfsMain();
}
*/