
Qall('.block' , function(e , id){
	e.innerHTML = "<input class='bBlank' type='text' maxlength='1'></input>"
});

nowFocus = {r:1 , c:1};
Qall('#sudo td input' , function(now){
	now.addEventListener('blur' , function(){
		if( this.value==='' )
			this.className = this.className.replace('bSetted','');
		else
			this.className += ' bSetted';
	})
});

Qall('#sudo td' , function(now){
	now.addEventListener('click' , function(){
		nowFocus.r = parseInt( this.getAttribute('id')[1] , 10);
		nowFocus.c = parseInt( this.getAttribute('id')[3] , 10);
	});
})

window.addEventListener("keydown" , function(e){
	var keyCode = e.which || e.keyCode;
	switch( keyCode ){
		case 37:
			nowFocus.c = (nowFocus.c-1) %9;
			nowFocus.c = nowFocus.c || 9;
			break;
		case 38:
			nowFocus.r = (nowFocus.r-1) %9;
			nowFocus.r = nowFocus.r || 9;
			break;
		case 39:
			nowFocus.c = (nowFocus.c+1) %9;
			nowFocus.c = nowFocus.c || 9;
			break;
		case 40:
			nowFocus.r = (nowFocus.r+1) %9;
			nowFocus.r = nowFocus.r || 9;
			break;
	}
	Q('#r'+nowFocus.r+'c'+nowFocus.c+' input').focus();
});
