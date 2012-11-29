(function (toExport) {
    var TableEventBase = function ($container) {
        this.$container = $container;
    };
    var rowTable = '<tr>' +
        "<td><%= number %></td>" +
        "<td><%= start %></td>" +
        "<td><%= end %></td>" +
        "<td><%= name %></td>" +
        "<td><%= x %></td>" +
        "<td><%= y %></td>" +
        "<td><%= stars %></td>" +
        "<td><%= cost %></td>" +
        "<td><%= parties %></td>" +
        "</tr>";
    var templateRowParty ='<option>' +
        "<%= party %>" +
        '</option>';
    toExport.TableEventBase = TableEventBase;
    TableEventBase.prototype.updateTable = function (base) {
        this.$container.children().remove();
        var tableHtml = "";
        for (var i = 0; i < base.items.length; i += 1) {
            var item = base.items[i];
            var partiesHtml = "";
            for (var j = 0; j < item.parties.length; j += 1) {
                partiesHtml += tmpl(templateRowParty, {"party": item.parties[j]});
            }
            if (partiesHtml.length !== 0) {
                partiesHtml = "<select>" + partiesHtml + "</select>";
            }
            tableHtml += tmpl(rowTable, {
                "number": i,
                "start": item.start.toDateString(),
                "end": item.end.toDateString(),
                "name": item.name,
                "x": item.gps.x,
                "y": item.gps.y,
                "stars": item.stars,
                "cost": item.cost,
                "parties": partiesHtml
            })
        }
        $(tableHtml).appendTo(this.$container);
    };
}(window));