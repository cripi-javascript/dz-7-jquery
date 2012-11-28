/*jslint plusplus: true, browser: true, devel: true */
var currentEvents = new Events();
function WriteCalendar() {
    "use strict";
    var filterEvents = currentEvents,
        filter1,
        filter2,
        $sort,
        bool,
        sortBy,
        res;

    filter1 = $(".filter1").prop("checked");
    filter2 = $(".filter2").prop("checked");
    bool = false; // флажок. если =true, выдаем отфильтрованную коллекцию. иначе - всю.
    if (filter1 === true) {
        filterEvents = currentEvents.findFutureEvents();
        bool = !bool;
    }
    if (filter2 === true) {
        filterEvents = currentEvents.findPastEvents();
        bool = !bool;
    }

    sortBy = "";
    $sort = $(".filterCollection").find('[name="sort"]');
    $sort.each(function (index, element) {
        if ($(element).prop("checked") === true) {
            sortBy = $(element).val();
        }
    });

    if (bool) {
        res = new Events(filterEvents.sortBy(sortBy).items);
    } else {
        res = new Events(currentEvents.sortBy(sortBy).items);
    }
    res.write();
}

function CreateCalendar() {
    "use strict";
    var date = $(".start_date").val(),// строка даты 
        time = $(".start_time").val(), // строка времени
        startEv = date + "T" + time + ":00",
        endEv,
        element;

    date = $(".end_date").val();
    time = $(".end_time").val();
    endEv = date + "T" + time + ":00";
    element = new Event({
        start: new Date(startEv),
        end:  new Date(endEv),
        name: $(".New_Event").val(),
        place: $(".plase_event").val(),
        rating: parseFloat($(".rating_event").val().charAt(0)),
        comment: $(".comment_event").val(),
        link: $(".link_event").val()
    });
    element.validate();
    currentEvents.add(element);

    WriteCalendar();
}
$(document).ready(function () {
    "use strict";
    var $button = $(".add_event"),
        $filter = $(".filterCollection").find('[name="filter"]'),
        $sort = $(".filterCollection").find('[name="sort"]'),
        i;
    $button.click(CreateCalendar);
    $filter.each(function (index, element) {
        $(element).change(WriteCalendar);
    });
    $sort.each(function (index, element) {
        $(element).change(WriteCalendar);
    });
});