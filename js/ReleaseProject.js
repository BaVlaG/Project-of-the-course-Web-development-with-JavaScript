


 //--------------------------------------------------Model----------------------------------------------------
 function TProjectModel() {
     var nDays = null;
     var currentDate = null;
     var currentYear = null;
     var currentMonth = null;
     var currentDay = null;
     var nameDayFirstDayMonth = null;
     var hashMonth = null;

     this.createBD = function(){
         $.ajax({
             url: 'http://fe.it-academy.by/AjaxStringStorage2.php',
             type: 'POST',
             data: {f: 'READ', n: 'storageCalendarBasko'},
             cache: false,
             error: errorMessage,
             success: function (data) {
                 if (data.error != undefined) {
                     console.log(data.error + ' №1');
                 } else {
                     hashMonth = JSON.parse(data.result);
                 }
             }
         });
     };

     this.init = function(_date) {
         currentDate = _date;
         currentMonth = currentDate.getMonth();
         currentYear = currentDate.getFullYear();
         currentDay = currentDate.getDate();

         switch (currentMonth) {
             case 0:
             case 2:
             case 4:
             case 6:
             case 7:
             case 9:
             case 11:
                 nDays = 31;
                 break;
             case 3:
             case 5:
             case 8:
             case 10:
                 nDays = 30;
                 break;
             case 1:
                 if (currentYear % 4 == 0) {
                     nDays = 29;
                 } else {
                     nDays = 28;
                 }
         }
         var firstDayMonth = new Date(currentYear, currentMonth);
         nameDayFirstDayMonth = firstDayMonth.getDay();
     };

     function errorMessage(StatusStr, ErrorStr){
         alert(StatusStr+' '+ErrorStr);
     }

     this.getHashMonth = function (){
         return hashMonth;
     };

     this.getNDays = function (){
         return nDays;
     };

     this.getNameDayFirstDayMonth = function(){
         if (nameDayFirstDayMonth == 0){
             nameDayFirstDayMonth = 7
         }
         return nameDayFirstDayMonth;
     };

     this.getCurrentDay = function(){
         return currentDay;
     };

     this.getCurrentMonth = function(){
         return  currentMonth;
     };

     this.getCurrentYear = function (){
         return currentYear;
     };

     this.switchPage = function(_month, _year, namePage, nameEvents){
         if ((_month != null) && ( _year != null) && (nameEvents == undefined)) {
             var Mas = [_month, _year];
             this.switchState({page:Mas});
         } else if (nameEvents != undefined){
             this.switchState({page:nameEvents});
     } else{
             this.switchState({page:String(namePage + _year)});
         }
     };

     this.switchState = function(page){
         window.location.hash = encodeURIComponent(JSON.stringify(page));
     };

     this.counterTime = function(_date){
         var dateX = new Date(_date.split(':')[0], _date.split(':')[1], _date.split(':')[2], _date.split(':')[3], _date.split(':')[4]);
         var realDate = new Date();
         var currentDate = new Date(realDate.getFullYear(), realDate.getMonth(), localStorage.dateSet.split(':')[2],
                                    realDate.getHours(), realDate.getMinutes(), realDate.getSeconds());
         var time = dateX - currentDate;
         var dayDrob = (time / 1000/ 60 / 60 / 24);
         var day = timeStr(Math.floor(dayDrob));
         var hourDrob = (dayDrob - day) * 24;
         var hour = timeStr(Math.floor(hourDrob));
         var minDrob = (hourDrob - hour) * 60;
         var min = timeStr(Math.floor((hourDrob - hour)*60));
         var secDrob = (minDrob - min)*60;
         var sec = timeStr(Math.round(secDrob));

         function timeStr(el){
             if (el < 10){
                 el = '0' + el;
             }
             return el;
         }
         return (day + ' : ' + hour + ' : ' + min + ' : ' + sec);
     }
 }

 //--------------------------------------------------View-----------------------------------------------------
 function TProjectView(){
     var model, modelPopUp;
     var hashMonth;
     var calendar = $('<table></table>', {class:'calendar'});
     var tr = $('<tr></tr>');
     var td = $('<td></td>', {class:'td'});
     var currentYear, currentMonth, currentNumber;
     var wrap = $('<div id="wrap">');
     var buttonNextMonth = $('<div id="nextMonth">');
     var buttonPrevMonth = $('<div id="prevMonth">');
     var tdDaysWeek, currentDate;
     var mainPage, setDate, clearEvents;
     var tdMonth, decadeP, divEvents;
     var tdLastMonth = $('<td></td>', {class:'tdLastMonth'});
         tdLastMonth.append('<span></span>');

     this.createCalendar = function (_model, _modelPopUp){
         var divButtons = $('<div class="divButtons">');
         var self = this;
         model = _model;
         modelPopUp = _modelPopUp;
         hashMonth = model.getHashMonth();
         currentMonth = model.getCurrentMonth();
         currentYear = model.getCurrentYear();

         $(wrap).children().detach();

         $(wrap).appendTo('body').append(calendar);
         $(calendar).html('<tr>' +
                                '<td class="th">Пн</td>' +
                                '<td class="th">Вт</td>' +
                                '<td class="th">Ср</td>' +
                                '<td class="th">Чт</td>' +
                                '<td class="th">Пт</td>' +
                                '<td class="th">Сб</td>' +
                                '<td class="th">Вс</td>' +
                         '</tr>');

         for (var i = 1; i < model.getNameDayFirstDayMonth(); i++){
             $(calendar).append(tdLastMonth.clone());
         }

         for (var j = 1; j <= model.getNDays(); j++){
             $(calendar).append('<td><span class="numberDay">' + j + '</span><div class="events"></div></td>');
             currentNumber = new Date(currentYear, currentMonth, j);
         }

         if (currentNumber.getDay() != 0){
             for (var n = 0; n < 7 - currentNumber.getDay(); n++){
                 $(calendar).append(tdLastMonth.clone());
             }
         }

         $('td:not(td.th)').each(function(index, el){
             $(el).addClass('daysWeek');
             if (((index + 1) % 7 == 0) && (index != 0)){
                 $('td.daysWeek').slice(index - 6, index + 1).wrapAll('<tr class="weeks"></tr>');
             }
             tdDaysWeek = $('td.daysWeek:not(td.tdLastMonth)');
         });

         $('tr td:last-child, tr td:nth-child(6)').css({'color':'red'});

         $('td').each(function(){
             if ($(this).text() == model.getCurrentDay()){
                 currentDate = $('<div id="currentDate">');
                 $(this).append(currentDate);
             }
         });

         $(wrap).css({'background':'url(' + hashMonth[currentMonth]['src'] + ') no-repeat', 'backgroundSize':'100% 100%'});
         $('<div class="monthYear">').prependTo(wrap).html('<span>' + hashMonth[currentMonth]['name'] + ' ' + currentYear+ '</span>');

         mainPage = $('<input type = "button" value = "Текущая дата" id = "mainPage">');
         setDate = $('<input type = "button" value = "Установить дату" id = "setDate">');
         clearEvents = $('<input type = "button" value = "Удалить события" id = "clearEvents">');
         $(divButtons).appendTo(wrap).append(mainPage, setDate, clearEvents);

         divEvents = $('<div id = "divEvents">');
         $(wrap).append(divEvents, buttonPrevMonth, buttonNextMonth);
         self.fillingDivEvents();
     };

     this.createCalendarMonth = function(_year, _hashMonth){
         hashMonth = _hashMonth;
         var decadeCalendar = $('<div id = "decadeCalendar"></div>');

         $(wrap).children().detach();
         $(wrap).appendTo('body').css({'background':'url(\'img/fonCalendar.jpg\') no-repeat'})
                .append('<div class="spanMonth">', '<table class = "calendarMonth"</table>', decadeCalendar);

         $('div.spanMonth').html('<span>' + _year + ' год</span>');

         for (var i = 0; i < 3; i++){
             $('table').append('<tr></tr>');
         }

         for ( var j = 0; j < 4; j++){
             $('tr').append('<td class="tdMonth"></td>');
         }

         $('td').each(function(index){
             $(this).html(hashMonth[+index].name).css({'background':'url(' + hashMonth[index].srcmin + ') no-repeat', 'background-size':'100% 100%'});
             if (currentMonth == index ){
                 //$(this).append(currentDate).css('border',' solid red 5px');
                $(this).css('border',' solid red 5px');
             }
         });

         var yearHeader = +$('.spanMonth').text().slice(0,4) - 50;
         for (var k = 0; k < 10; k++){
             $(decadeCalendar).append('<h3><a href="#">' + yearHeader + ' - ' + (yearHeader + 9) + '</a></h3><div class="decade"></div>');
             yearHeader +=10;
         }

         for (var l = 0; l < 10; l++){
             $('.decade').append('<p></p>');
         }

         var year = +$('.spanMonth').text().slice(0,4) - 50;
         var numberHeader;
         decadeP = $('.decade p');
         $(decadeP).each(function(){
             $(this).text(year);
             if ( year == _year){
                 $(this).css('color','red');
                 x = $(this).text();
                 numberHeader = $('.decade').index($(this).parent());
             }
             year++;
         });

         $(decadeCalendar).accordion({heightStyle:'content', icons:{header:'ui-icon-circle-plus', activeHeader:'ui-icon-circle-minus'}, active:numberHeader});
     };

     this.fillingDivEvents = function(){
         if ('Mas' in localStorage){
             var MasEvents = JSON.parse(localStorage.Mas);
             $(divEvents).empty();
             for (var k = 0; k < MasEvents.length; k++) {
                 var title = MasEvents[k]['Value'];

                 $('<p class="divEventsP"></p>').appendTo(divEvents).append('<p class="title">' + title + '</p>',
                      '<p class="tHead">  Дни Часы Мин Сек </p>', '<p class="digital" data-namEvents="' + MasEvents[k]['nameEvents'] + '">' +
                       model.counterTime(MasEvents[k]['nameEvents']) + '</p>');

                 if (MasEvents[k]['nameEvents'].split(':').slice(0,2).join(':') == currentYear + ':' + currentMonth){
                     for (var m = 0; m < tdDaysWeek.length; m++) {
                         if ($(tdDaysWeek[m]).find('.numberDay').text() == MasEvents[k]['nameEvents'].split(':')[2]){
                             $(tdDaysWeek[m]).find('div:not(#currentDate)').addClass('fullEvents').removeClass('events')
                                 .append('<p class="divEventsTD" data-namEvents="' + MasEvents[k]['nameEvents'] + '">' +
                                 MasEvents[k]['nameEvents'].split(':').slice(3).join(':') + '</p>');
                         }
                     }
                 }
             }
         }

         $('.divEventsTD').draggable({scope:'true', containment:'.calendar', revert: 'invalid', stop:takeEl});
         $(tdDaysWeek).find('div:not(#currentDate)').droppable({scope:'true', tolerance:'pointer', drop:throwEl});

         function throwEl(ev, elem){
             var newTD = $(this).parent();                             // новая принимающая ячейка
             var oldTD = $(elem.draggable[0]).parent().parent();       //старая ячейка из которой забрали
             var NameNewEvents = modelPopUp.changeTD(oldTD, newTD, elem, model);

             $(this).addClass('fullEvents').removeClass('events');
             $(this).append($(elem.draggable[0]));
             $(elem.draggable[0]).css({'left':'0', 'top':'0'});

             model.switchPage(null, null, null, NameNewEvents);
         }

         function takeEl(){
             if ($(this).parent().children().length < 2) {
                 $(this).parent().removeClass('fullEvents').addClass('events');
             }
         }
     };

     this.clearAllEvents = function(){
         $(divEvents).empty();
         $(tdDaysWeek).find('div:not(#currentDate)').removeClass('fullEvents').addClass('events').detach();
     };

     this.clearEndingEvents = function(elem){
         $(tdDaysWeek).each(function(){
              if ($(this).find('.divEventsTD').attr('data-namEvents') == $(elem).attr('data-namEvents') ){
                 $(this).find('.divEventsTD:first').remove();

                 if ($(this).find('.fullEvents').children().length < 1){
                     $(this).find('.fullEvents').removeClass('fullEvents').addClass('events');
                 }
             }
         })
     };

     this.getDecadeP = function(){
         return decadeP;
     };

     this.getPDigital = function(){
         return $('p.digital');
     };

     this.getTdMonth = function(){
         return $('td.tdMonth');
     };

     this.getSpanMonthYear = function (){
         return $('div.monthYear span');
     };

     this.getButtonNextMonth = function(){
         return buttonNextMonth;
     };

     this.getButtonPrevMonth = function(){
         return buttonPrevMonth;
     };

     this.getTdDaysWeek = function(){
        return tdDaysWeek;
     };

     this.getMainPage = function(){
         return mainPage;
     };

     this.getSetDate = function(){
         return setDate;
     };

     this.getClearEvents = function(){
         return clearEvents;
     };

     this.getCurrentDate = function (){
         return currentDate;
     };

     this.setBlueBorder = function(elem){
         $(currentDate).remove();
         $(elem).append(currentDate);
     };
 }
 //-----------------------------------------------Controller--------------------------------------------------
 function TProjectController(){
     var model, view, viewPopUp, modelPopUp;
     var buttonNextMonth, buttonPrevMonth, mainPage;
     var tdDaysWeek, currentDate;
     var dateSet, tdEvent;
     var newDate, setDate, clearEvents;

     this.init = function(Model, View, ModelPopUp, ViewPopUp){
         model = Model;
         view = View;
         viewPopUp = ViewPopUp;
         modelPopUp = ModelPopUp;
         var realDate = new Date();
         model.createBD();
         model.init(realDate);
         setTimeout(selectPage, 800);
         var counterMonths, counterYear;
         var realYear = realDate.getFullYear();
         var realMonth = realDate.getMonth();
         var realNumber = realDate.getDate();
         var dateURL;

         buttonNextMonth = view.getButtonNextMonth();
         $(buttonNextMonth).click(function(){
             getCounterMonthAndYear();
             ++counterMonths;

             if (counterMonths > 11){
                 counterMonths = 0;
                 counterYear++;
             }
             model.switchPage(counterMonths, counterYear);
         });

         buttonPrevMonth = view.getButtonPrevMonth();
         $(buttonPrevMonth).click(function(){
             getCounterMonthAndYear();
             --counterMonths;

             if (counterMonths < 0){
                 counterMonths = 11;
                 counterYear--;
             }
             model.switchPage(counterMonths, counterYear);
         });

         function getCounterMonthAndYear(){
             if (location.hash != ''){
                 dateURL = JSON.parse(decodeURIComponent(location.hash.substr(1)));

                 if (Array.isArray(dateURL.page)) {
                     counterMonths = dateURL.page[0];
                     counterYear = dateURL.page[1];
                 } else {
                     counterYear = dateURL.page.split(':')[0];
                     counterMonths = dateURL.page.split(':')[1];
                 }
             } else {
                 counterMonths = localStorage.dateSet.split(':')[1];
                 counterYear = localStorage.dateSet.split(':')[0];
             }
             return counterMonths;
         }

         function startTimeIvent(){
             var pDigital = view.getPDigital();
             $(pDigital).each(function(){
                 var self = this;
                 var stop = setInterval(counterTimeEvent, 1000);
                 function counterTimeEvent(){
                     var das = model.counterTime($(self).attr('data-namEvents'));
                     $(self).html(das);
                     if (das == '00 : 00 : 00 : 00') {
                         $(self).parent().remove();
                         clearInterval(stop);
                         viewPopUp.PopUpEndEvent(self);

                         var switchOff = viewPopUp.getSwitchOff();
                         $(switchOff).click(function(){
                             viewPopUp.switchOffAlarmClock();
                             view.clearEndingEvents(self);
                             modelPopUp.clearEndingEvent(self);
                         });

                     }
                 }

                 clearEvents = view.getClearEvents();
                 $(clearEvents).click(function(){
                     clearInterval(stop);
                     view.clearAllEvents();
                     modelPopUp.clearAllEvents();
                 });
             });
         }

         var buttonPopUpADD = viewPopUp.getButtonADD();
         $(buttonPopUpADD).click(function(){
             modelPopUp.recEventsLocalStorage(model.getCurrentMonth(), model.getCurrentYear(), realDate, viewPopUp);
             console.log(modelPopUp.getNameEvents());
             if (modelPopUp.getNameEvents() != undefined) {
                 model.switchPage(null, null, null, modelPopUp.getNameEvents());
                 startTimeIvent();
             }

             var buttonCloseFail = viewPopUp.getButtonCloseFail();
             console.log(buttonCloseFail);
             $(buttonCloseFail).click(function(){
                 console.log('ok');
                 viewPopUp.failPopUpClose();
             });
         });

         window.onhashchange = selectPage;

         function selectPage(){
             if (model.getHashMonth() === null){
                 setTimeout(selectPage, 100);
                 return;
             } else {
                 var URL = location.hash;
                 var regExp = /(\d+\:){4}\d+/;

                 if (URL != ''){
                     URL = JSON.parse(decodeURIComponent(URL.substr(1)));

                     if (Array.isArray(URL.page)){
                         if ((URL.page[0] == localStorage.dateSet.split(':')[1]) && (URL.page[1] == localStorage.dateSet.split(':')[0])){
                             newDate = new Date(URL.page[1], URL.page[0], localStorage.dateSet.split(':')[2]);
                             model.init(newDate);
                             view.createCalendar(model, modelPopUp);
                             startTimeIvent();
                         } else {
                             newDate = new Date(URL.page[1], URL.page[0]);
                             model.init(newDate);
                             view.createCalendar(model, modelPopUp);
                             startTimeIvent();
                         }
                     } else if (regExp.test(URL.page)){
                         var MasURLpage = URL.page.split(':');
                         if ((MasURLpage[0] == localStorage.dateSet.split(':')[0]) && ((MasURLpage[1] == localStorage.dateSet.split(':')[1]))){
                             newDate = new Date(+MasURLpage[0], +MasURLpage[1], localStorage.dateSet.split(':')[2]);
                             model.init(newDate);
                             view.createCalendar(model, modelPopUp);
                             startTimeIvent();
                         } else {
                             newDate = new Date(+MasURLpage[0], +MasURLpage[1]);
                             model.init(newDate);
                             view.createCalendar(model, modelPopUp);
                             startTimeIvent();
                         }
                     } else {
                         view.createCalendarMonth(+URL.page.slice(13), model.getHashMonth());
                     }
                 } else{
                     if ('dateSet' in localStorage){
                         var MasDate = localStorage['dateSet'].split(':');
                         newDate = new Date(MasDate[0], MasDate[1], MasDate[2]);
                         model.init(newDate);
                         view.createCalendar(model, modelPopUp);
                         startTimeIvent();
                     } else {
                         newDate = realYear + ':' + realMonth + ':' + realNumber;
                         model.init(realDate);
                         view.createCalendar(model, modelPopUp);
                         startTimeIvent();
                         localStorage.setItem('dateSet', newDate);
                     }
             }

             tdDaysWeek = view.getTdDaysWeek();
             $(tdDaysWeek).dblclick(function(event){
                 var messageFail = $('<p id="failMessage">Выбранная дата уже прошла!!!<br/><span>Выберите другую!</span></p>');
                 if ((model.getCurrentYear() < +localStorage.dateSet.split(':')[0]) ||
                    ((model.getCurrentMonth() < +localStorage.dateSet.split(':')[1]) && (model.getCurrentYear() <= +localStorage.dateSet.split(':')[0])) ||
                    ((model.getCurrentYear() <= +localStorage.dateSet.split(':')[0]) && (model.getCurrentMonth() <= +localStorage.dateSet.split(':')[1]) &&
                                                                                        (+$(this).find('.numberDay').text() < +localStorage.dateSet.split(':')[2]))) {
                     viewPopUp.closePopUp();
                     viewPopUp.failPopUp(messageFail);
                 } else {
                     event = event || window.event;
                     tdEvent = this;
                     var cordX = event.pageX;
                     var cordY = event.pageY;
                     viewPopUp.createPopUp(cordX, cordY, this, modelPopUp);
                 }

                 var buttonCloseFail = viewPopUp.getButtonCloseFail();
                 console.log(buttonCloseFail);
                 $(buttonCloseFail).click(function(){
                     console.log('ok');
                     viewPopUp.failPopUpClose();
                 });
             });

             var buttonPopUpClose = viewPopUp.getButtonClose();
             $(buttonPopUpClose).click(function(){
                 viewPopUp.closePopUp();
             });

             $(tdDaysWeek).click(function(){
                 view.setBlueBorder(this);
             });

             mainPage = view.getMainPage();
             $(mainPage).click(function(){
                 model.switchPage(localStorage['dateSet'].split(':')[1], localStorage['dateSet'].split(':')[0]);
             });

             setDate = view.getSetDate();
             $(setDate).click(function(){
                 currentDate = view.getCurrentDate();
                 var number = $(currentDate).prev().prev().text();
                 dateSet = model.getCurrentYear() + ':' + model.getCurrentMonth() + ':' + number;
                 localStorage.setItem('dateSet', dateSet);
             });

             var spanMonthYear = view.getSpanMonthYear();
                 $(spanMonthYear).click(function(){
                     model.switchPage(null, model.getCurrentYear(), 'calendarMonth');
                 });

             var tdMonth = view.getTdMonth();
                 $(tdMonth).click(function(){
                     var month = $(tdMonth).index(this);
                     var year = +$('.spanMonth span').text().slice(0,4);
                     model.switchPage(month, year);
                  });

             var decadeP = view.getDecadeP();
                 $(decadeP).click(function(){
                     model.switchPage(null, $(this).text(), 'calendarMonth');

                 });


             //$('body').click(function (event) {
             //        console.log(event.target);
             //    });
     }
     }
 }
 }



