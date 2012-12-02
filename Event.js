/*jslint plusplus: true, browser: true, devel: true */

function datatype(data) {// возвращает true, если data имеет тип дата и она корректна
    "use strict";
    if (typeof data === 'undefined') {
        return false;
    }
    if (!data.getTime) {
        return false;
    }
    if ('Invalid Date' === data) {
        return false;
    }
    return true;
}

function ratingtype(rating) {// возвращает true, если rating - число от 0 до 5
    "use strict";
    if (typeof rating !== 'number') {
        return false;
    }
    if (rating > 5 || rating < 0) {
        return false;
    }
    return true;
}

function inherits(Constructor, SuperConstructor) {
    "use strict";
    var F = function () {};

    F.prototype = SuperConstructor.prototype;

    Constructor.prototype = new F();
}


// наследуем от Абстракнтого конструктора Model объект Event
var Event = function (data) {
    "use strict";
    Model.apply(this, arguments);
};
inherits(Event, Model);

Event.prototype.validate = function () {//проверяет корректность переданных данных.
    "use strict";
    if (!datatype(this.start)) {
        throw new Error(this.start + " не является датой!");
    }
    if (!datatype(this.end)) {
        throw new Error(this.end + " не является датой!");
    }
    if (this.start.getTime() - this.end.getTime() > 0) {
        throw new Error("некорректное событие: не может закончиться раньше, чем начаться!!!");
    }
    if (!ratingtype(this.rating)) {
        throw new Error("введите рейтинг от 0 до 5");
    }
};

$.template("eventTemplate", "<p>Событие: ${Name}</p><p>Начало: ${Start}</p><p>Конец: ${End}</p><p>Продолжительность: ${Length}</p><p>Рейтинг: ${Rating}</p><p>Место: ${Place}</p><p>Комментарий: ${Comment}</p><p>Сcылка: ${Link}</p><br>");

Event.prototype.createSection = function () {
    "use strict";
    var $el,
        event_temp = [{Name: this.name, Start: this.start, End: this.end, Length: hours(this.end - this.start), Rating: this.rating, Place: this.place, Comment: this.comment, Link: this.link}];
    $el = $('<section/>');
    $.tmpl("eventTemplate", event_temp).appendTo($el);
    return $el;
};