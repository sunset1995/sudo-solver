
nowFocus = {r:0 , c:0};
Qall('.block' , function(e , id){
	e.innerHTML = "<input class='bBlank' type='text' maxlength='1'></input>"
});

Qall('#sudo td input' , function(now){
	now.addEventListener('blur' , function(){
		if( this.value==='' )
			this.className = this.className.replace('bSetted','');
		else
			this.className += ' bSetted';
	})
});
