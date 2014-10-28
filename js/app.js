/* Med object */

function Med(inputDOM, panelDOM) {
    this.inputDOM = $(inputDOM);
    this.input = this.inputDOM.find('.eatWhat');
    this.eatOther = this.inputDOM.find('.eatOther');
    this.panel = $(panelDOM);
    this.doneEat = this.panel.find(".doneEat");
    this.reminder = this.panel.find(".reminder");
    this.subject = $(".subject");
    this.msg = {
	yestNotEaten: this.panel.find('.yestNotEaten'),
	todayNotEaten: this.panel.find('.todayNotEaten'),
	todayEaten: this.panel.find('.todayEaten')
    };
    this.status = 'i'; // initializing
    this.lastEaten = null;
    this.eatWhat = '';
    this.initialize();

    this.input.data('app', this);
    this.eatOther.data('app', this);
    this.doneEat.data('app', this);

    this.eatOther.on('click', function(e) {
	var _this = $(this);
	var app = _this.data('app');
	app.status = 'u';
	app.update();
	localStorage.removeItem('med.data');
    });

    this.doneEat.on('click', function(e) {
	var _this = $(this);
	var app = _this.data('app');
	app.lastEaten = new Date();
	app.status = 'g'; // good to go
	localStorage.setItem('med.data', JSON.stringify({lastEaten: app.lastEaten.getTime(), eatWhat: app.eatWhat}));
	app.update();
    });

    this.input.on('keypress', function(e) {
	var keycode = (e.keyCode ? e.keyCode : e.which);
	var _this = $(this);
	var app = _this.data('app');
	if (keycode == '13' && _this.val() != "") {
	    app.lastEaten = new Date(0);
	    app.eatWhat = _this.val();
	    app.status = 'g'; // good to go
	    localStorage.setItem('med.data', JSON.stringify({lastEaten: app.lastEaten.getTime(), eatWhat: app.eatWhat}));
	    app.update();
	}
    });

    return this;
}

Med.prototype.hide = function(dom) {
    $(dom).addClass('hidden');
}

Med.prototype.show = function(dom) {
    $(dom).removeClass('hidden');
}

Med.prototype.hideAll = function(dom) {
    this.hide(this.inputDOM); 
    this.hide(this.input); 
    this.hide(this.eatOther); 
    this.hide(this.panel);
    this.hide(this.doneEat); 
    this.hide(this.reminder); 
    this.hide(this.msg.yestNotEaten); 
    this.hide(this.msg.todayNotEaten);
    this.hide(this.msg.todayEaten);
}

Med.prototype.update = function() {
    switch (this.status) {
    case 'g':
	// enable panel
	this.hideAll();
	this.subject.html(this.eatWhat);
	var now = new Date();
	var yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);
	// today eaten?
	var todayEaten = (this.lastEaten.getDate() == now.getDate());
	// yesterday eaten?
	var yesterdayEaten = (this.lastEaten.getDate() == yesterday.getDate() || todayEaten);
	this.show(this.panel);
	if (!yesterdayEaten) {
	    this.show(this.msg.yestNotEaten);
	    this.show(this.reminder);
	    this.msg.yestNotEaten.html("琴日無食喎");
	}
	if (!todayEaten) {
	    this.show(this.msg.todayNotEaten);
	    this.show(this.reminder);
	    this.msg.todayNotEaten.html("今日未食喎");
	    this.show(this.doneEat);
	} else {
	    this.show(this.msg.todayEaten);
	    this.msg.todayEaten.html("乖乖豬，聽日記住食呀");
	}
	this.show(this.inputDOM);
	this.show(this.eatOther);
	break;
    case 'u':
	// enable editing
	this.hideAll();
	this.show(this.inputDOM);
	this.show(this.input);
	break;
    case 'x':
	alert('屌你無 localStorage 用乜撚野呀');
	break;
    default: 
	break; // do nothing
    }
}

Med.prototype.initialize = function() {
    if (typeof(Storage) !== "undefined") {
	// get item
	if (localStorage.getItem('med.data') != null) {
	    var data = JSON.parse(localStorage.getItem('med.data'));
	    this.lastEaten = new Date(data.lastEaten);
	    this.eatWhat = data.eatWhat;
	    this.status = 'g'; // good to go
	} else {
	    this.status = 'u'; // uninitialized
	}
    } else {
	this.status = 'x'; // unsupported
    }
    this.update();
}

var app = new Med($("#eatSubject"), $("#eatPanel"));
