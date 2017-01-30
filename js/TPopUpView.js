//------------------------------------------MODEL---------------------------------------------------
function TPopUpModel(){
    var MasEvents = [];
    var timeX, tdEvent;
    var NameEvents;

    this.recEventsLocalStorage = function(_currentMonth, _currentYear, _realDate, viewPopUp){

        var value = $('#textEvents').val();
        var time = $('#time').val();
        var number = $(tdEvent).find('span').text();
        var MasTime = (time.split(':'));
        var hours = +MasTime[0];
        var min = +MasTime[1];
        var realHours = _realDate.getHours(), realMin = _realDate.getMinutes();
        var realDateX = new Date(_realDate.getFullYear(), _realDate.getMonth(), _realDate.getDate());
        var DateX = new Date(_currentYear, _currentMonth, number);
        var messageFail;

        console.log(time);
        if ((time == '') || (value == undefined)) {
            messageFail = ('<p id="failMessage">Заполните все поля!!!</p>');
            viewPopUp.failPopUp(messageFail);
            $('.popUp').css('display', 'none');
            $('.layout').css('display', 'none');
        } else{
            if (((realHours > hours) || ((realHours == hours) && (realMin > min))) && (realDateX >= DateX)){
               messageFail = ('<p id="failMessage">Вы ввели прошедшее время!!!<br/><span>Введите заново!</span></p>');
                viewPopUp.failPopUp(messageFail);
                $('.popUp').css('display', 'none');
                $('.layout').css('display', 'none');
            } else {
                $('.popUp').css('display', 'none');
                $('.layout').css('display', 'none');

                timeX = new Date(_currentYear, _currentMonth, number, hours, min);
                NameEvents = _currentYear + ':' + _currentMonth + ':' + number + ':' + hours + ':' + min;

                if ('Mas' in localStorage) {
                    MasEvents = JSON.parse(localStorage.Mas);
                } else {
                    MasEvents = [];
                }

                MasEvents.push({Value: value, Time: timeX, nameEvents: NameEvents});

                for (var i = 0; i < MasEvents.length; i++) {
                    MasEvents[i].Time = new Date(MasEvents[i].nameEvents.split(':')[0], MasEvents[i].nameEvents.split(':')[1],
                        MasEvents[i].nameEvents.split(':')[2], MasEvents[i].nameEvents.split(':')[3],
                        MasEvents[i].nameEvents.split(':')[4]);
                }
                MasEvents.sort(sortDate);
                function sortDate(A, B) {
                    if (A.Time < B.Time) return -1;
                    if (A.Time > B.Time) return 1
                }

                localStorage.setItem(NameEvents, value);
                localStorage.setItem('Mas', JSON.stringify(MasEvents));
            }
        }
    };

    this.clearAllEvents = function(){
        for (var key in localStorage){
            if (key != 'dateSet'){
                delete localStorage[key];
            }
        }
        MasEvents = [];
        localStorage.setItem('Mas', JSON.stringify(MasEvents))
    };

    this.clearEndingEvent = function(elem){
        for (var key in localStorage){
            if ((key != 'dateSet') && (key == $(elem).attr('data-namEvents'))){
                delete localStorage[key];
            }
        }
        MasEvents = (JSON.parse(localStorage.Mas));
        for (var i = 0; i < MasEvents.length; i++){
            console.log(MasEvents);
            if (MasEvents[i]['nameEvents'] == $(elem).attr('data-namEvents')){
                MasEvents.shift();
                console.log(MasEvents);
                localStorage.setItem('Mas', JSON.stringify(MasEvents))
            }
        }
    };

    this.changeTD = function(_oldTD, _newTD, _elem){

        var NameNewEvents =  $(_elem.draggable[0]).attr('data-namEvents').split(':')[0] +':'+ $(_elem.draggable[0]).attr('data-namEvents').split(':')[1]
                                + ':' + $(_newTD).find('.numberDay').text() + ':' + $(_elem.draggable[0]).text();

        for (var key in localStorage){
            if ((key != 'dateSet') && (key == $(_elem.draggable[0]).attr('data-namEvents'))){
                var messageNewEvemts = localStorage[key];
                MasEvents = (JSON.parse(localStorage.Mas));

                for (var i = 0; i < MasEvents.length; i++){
                    console.log(MasEvents[i]['nameEvents'], $(_elem.draggable[0]).attr('data-namEvents'));
                    if ((MasEvents[i]['nameEvents'] == key)){
                        var elMas = MasEvents[i];
                        elMas['nameEvents'] = NameNewEvents;

                        for  (var j = 0; j < MasEvents.length; j++){
                                MasEvents[j].Time = new Date(MasEvents[j].nameEvents.split(':')[0], MasEvents[j].nameEvents.split(':')[1],
                                MasEvents[j].nameEvents.split(':')[2], MasEvents[j].nameEvents.split(':')[3],
                                MasEvents[j].nameEvents.split(':')[4]);
                        }
                        MasEvents.sort(sortDate);

                        function sortDate (A, B){
                            if (A.Time < B.Time) return -1;
                            if (A.Time > B.Time) return 1
                        }

                        localStorage.setItem('Mas', JSON.stringify(MasEvents));
                    }
                }
                $(_elem.draggable[0]).attr('data-namEvents', NameNewEvents);
                localStorage.setItem(NameNewEvents, messageNewEvemts);
                delete localStorage[key];
                return NameNewEvents;
            }
        }
    };

    this.getMasEvents = function(){
        return MasEvents;
    };

    this.getNameEvents = function(){
        return NameEvents;
    };

    this.setTdEvent = function(_tdEvents){
        tdEvent = _tdEvents;
    };


}


//-------------------------------------VIEW--------------------------------------------------------------------
function TPopUpView (){
    var body = $('body');
    var layout = $('<div class = "layout">');
    var popUp = $('<div class = "popUp">');
    var popUpEnd = $('<div class = "popUpEnd">');
    var failPopUp = $('<div id = "failPopUp">');
    var textEvents = $('<textarea id="textEvents">');
    var time = $('<input type = "time" id="time">');
    var buttonClose = $('<input type = "button" id = "close" value = "Отмена">');
    var buttonADD = $('<input type = "button" id = "AddEvent" value = "Добавить">');
    var form = $('<form id="form"></form>')
    var flag = false, flag2 = false;
    var tdEvent = null;
    var modelPopUp, switchOff, buttonCloseFail;


    this.createPopUp = function (cordClickX, cordClickY, _tdEvent, _modelPopUp){
        tdEvent = _tdEvent;
        modelPopUp = _modelPopUp;

        if (!flag) {
            $(body).append(layout, popUp);
            $(popUp).append(form);
            $(form).append(time, textEvents, buttonClose, buttonADD);
            $(popUp).css({'left': cordClickX - $(popUp).width() / 2, 'top': cordClickY - $(popUp).height() / 2});
            flag = true;
        } else {
            $(popUp).css({'display':'block', 'left': cordClickX - $(popUp).width() / 2, 'top': cordClickY - $(popUp).height() / 2});
            $(layout).css('display','block');
        }

        modelPopUp.setTdEvent(tdEvent);
    };

    this.PopUpEndEvent = function(elem){
        var alarmClock = $('<div id="alarmClock"></div>');
        var divTimePopUpEnd = $('<div id="divTimePopUpEnd"></div>');
        var divMessagePopUpEnd = $('<div id="divMessagePopUpEnd"></div>');
            switchOff = $('<input type="button" value="Выключить" id="switchOff">');
        var jingle = $('<audio src="mp3/alarmClock.mp3" autoplay="autoplay" loop="loop"></audio>');
        var MasTimeContent = $(elem).attr('data-namevents').split(':');
        var year = MasTimeContent[0];
        var month = timeStr(+MasTimeContent[1] + 1);
        var number = timeStr(+MasTimeContent[2]);
        var hours = timeStr(MasTimeContent[3]);
        var min = timeStr(MasTimeContent[4]);
        var message = $(elem).parent().find('.title').text();

        $(layout).css('display','block');
        $(body).append(layout, popUpEnd);
        $(popUpEnd).append(alarmClock, divTimePopUpEnd, divMessagePopUpEnd, switchOff, jingle);
        $(divTimePopUpEnd).html(number + '.' + month + '.' + year +'\ \ \ \ \ ' +hours + ':' + min);
        $(divMessagePopUpEnd).html(message);

        function timeStr(el){
            if (el < 10){
                el = '0' + el;
            }
            return el;
        }

    };

    this.switchOffAlarmClock = function(){
        $(layout).css('display','none');
        $(popUpEnd).empty().remove();
    };

    this.getSwitchOff = function(){
        console.log(switchOff);
        return switchOff;
    };

    this.getButtonADD = function(){
        return buttonADD;
    };

    this.getButtonClose= function(){
        return buttonClose;
    };

    this.closePopUp = function(){
        $(popUp).css('display','none');
        $(layout).css('display','none');
    };

    this.failPopUp = function(_message){
        buttonCloseFail = $('<input type="button" value="Ok">');
        $(failPopUp).appendTo('body').append(_message, buttonCloseFail);
      };

    this.getButtonCloseFail = function(){
        console.log(buttonCloseFail);
        return buttonCloseFail;
    };

    this.failPopUpClose = function(){
        $(failPopUp).empty().remove();
        $(layout).css('display','none');
    };

}