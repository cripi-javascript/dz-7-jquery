/**
 * @author Alex.Mangin
 */
(function (){
    var currentCalendary = new Calendary(),
        changeTime = function() {
            currentCalendary.errorManager.changeTime(this);
        },
        changeCoordinate = function() {
            currentCalendary.errorManager.changeCoordinate(this);
        };
    currentCalendary.LoadChange();
    currentCalendary.EventFactory.$IntervalStartDate.on('blur', changeTime);
    currentCalendary.EventFactory.$IntervalEndDate.on('blur', changeTime);
    currentCalendary.EventFactory.nameLocation.on('blur', function() {
        currentCalendary.errorManager.changeImportantStringField(this);
    });
    currentCalendary.EventFactory.$coordinateX.on('blur', changeCoordinate);
    currentCalendary.EventFactory.$coordinateY.on('blur', changeCoordinate);
    currentCalendary.EventFactory.$stars.on('blur', function() {
        currentCalendary.errorManager.changeStars(this);
    });
    currentCalendary.EventFactory.$cost.on('blur', function() {
        currentCalendary.errorManager.changePositiveNumber(this);
    });

    $("SubmitNewEventButton").on('click', function() {
        currentCalendary.CreateEvent();
        currentCalendary.updateShowList();
    });
    $("AddFriend").on('click', function() {
        currentCalendary.addFriend(currentCalendary.EventFactory.$parties);
    });

    $("#FilterEventList").find("input").find("[type = radio]").each(function ($filterEl) {
        $filterEl.on('click', function() {
            currentCalendary.updateFilter();
            currentCalendary.updateShowList();
        })
    });
    $("FilterFreshPeopleList").on('blur', function() {
        currentCalendary.updateFilter();
        currentCalendary.updateShowList();
    });
}());