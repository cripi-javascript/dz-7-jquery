/*
* Events - коллекция событий в календаре. Объект наследуется от Collection
* 
* Event - объект события в календаре
* Event.prototype.validate - проверяет корректность полей объекта 
* Events.prototype.filterToDate - возвращает предстоящие или прощедшие события в зависимости от входящего параметра flag
* Events.prototype.FilterToParty - возвращает события, в которых я принимаю/ не принимаю участие в зависимости от входящего параметра flag
* Events.prototype.sortToDate - сортирует события по дате
* function str2date(s) - преобразует строку в дату 
*/
var Events = function (items) {
    "use strict";
    Collection.apply(this, arguments);
};
inherits(Events, Collection);

Events.prototype.constructor = Events;

function str2date(s) {
    "use strict";
    var dateParts = s.split('.');
    if (typeof dateParts[2] === 'string') {
        return new Date(dateParts[2], dateParts[1], dateParts[0]);
    }
    if (typeof dateParts[2] === 'undefined') {
        dateParts = s.split('-');
        console.log(new Date(dateParts[0], dateParts[1], dateParts[2]));
        return new Date(dateParts[0], dateParts[1], dateParts[2]);
    }
}

Events.prototype.SortToDate = function () {
    "use strict";
    var mass = this.elem;
    mass.sort(function (a, b) {
        return str2date(a.start) > str2date(b.start) ? 1 : -1;
    });
    var results = new Events(mass);
    return results;
};

Events.prototype.FilterToDate = function (flag) {
    "use strict";
    var result, collection;
    result = new Events();
    collection = this.elem;
    if (flag === -1) {
        result.elem = collection.filter(function (collection) {
            var s = str2date(collection.start);
            return s < new Date();
        });
    } else {
        result.elem = collection.filter(function (collection) {
            var s = str2date(collection.start);
            return s >= new Date();
        });
    }
    return result;
};

Events.prototype.FilterToParty = function (flag) {
    "use strict";
    var result, collection;
    result = new Events();
    collection = this.elem;
    if (flag === -1) {
        result.elem = collection.filter(function (collection) {
            return collection.party === "нет";
        });
    } else {
        result.elem = collection.filter(function (collection) {
	        return collection.party === "да";
        });
    }
    return result;
};
