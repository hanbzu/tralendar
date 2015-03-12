var d3 = require('d3'),
    moment = require('moment'),
    tralendar = require('../src/tralendar')

var trips = [
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-15 8:30", arr: "2014-07-15 10:30", extra: "dd" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-15 10:30", arr: "2014-07-15 11:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-15 12:30", arr: "2014-07-15 13:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-15 14:30", arr: "2014-07-15 15:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-15 17:30", arr: "2014-07-15 19:15", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-15 11:30", arr: "2014-07-15 12:25", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-15 13:30", arr: "2014-07-15 13:32", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-15 14:30", arr: "2014-07-15 15:30", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-15 21:30", arr: "2014-07-15 22:35", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-16 8:30", arr: "2014-07-16 10:30", extra: "" }, // ----
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-16 10:30", arr: "2014-07-16 11:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-16 12:30", arr: "2014-07-16 13:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-16 14:30", arr: "2014-07-16 15:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-16 17:30", arr: "2014-07-16 19:15", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-16 11:30", arr: "2014-07-16 12:25", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-16 13:30", arr: "2014-07-16 13:32", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-16 14:30", arr: "2014-07-16 15:30", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-16 21:30", arr: "2014-07-16 22:35", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-18 8:30", arr: "2014-07-18 10:30", extra: "" }, // ----
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-18 10:30", arr: "2014-07-18 11:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-18 12:30", arr: "2014-07-18 13:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-18 14:30", arr: "2014-07-18 15:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-18 17:30", arr: "2014-07-18 19:15", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-18 11:30", arr: "2014-07-18 12:25", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-18 13:30", arr: "2014-07-18 13:32", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-18 14:30", arr: "2014-07-18 15:30", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-18 21:30", arr: "2014-07-18 22:35", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-19 8:30", arr: "2014-07-19 10:30", extra: "" }, // ----
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-19 10:30", arr: "2014-07-19 11:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-19 12:30", arr: "2014-07-19 13:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-19 14:30", arr: "2014-07-19 15:30", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-19 17:30", arr: "2014-07-19 19:15", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-19 11:30", arr: "2014-07-19 12:25", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-19 13:30", arr: "2014-07-19 13:32", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-19 14:30", arr: "2014-07-19 15:30", extra: "" },
  { frm: "Bilbao", to: "Gasteiz", dep: "2014-07-19 21:30", arr: "2014-07-19 22:35", extra: "" },
  { frm: "Bilbao", to: "Donostia", dep: "2014-07-22 14:30", arr: "2014-07-22 15:30", extra: "" },  
]


moment.locale('eu')

var span = 35

var _calendar = tralendar()
    .starts(moment('2014-07-15', 'YYYY-MM-DD'))
    .span(span) // Number of days
    .clickCallback(dayClicked)
    .mouseoverCallback(dayMouseover)
    .mouseoutCallback(dayMouseout)

var dataMap = d3.map()

trips.forEach(function(_) {
  var date = moment(_.dep, 'YYYY-MM-DD H:mm').format('YYYY-MM-DD')
  dataMap.set(date, {
    date: date,
    extra: _.extra,
    chosen: (date === '2014-07-18' ? true : false)
  })
})

d3.select("#datepicker")
      .datum(dataMap)
      .call(_calendar)

function dayMouseover(_) {
  console.log('mouseover', moment(_.moment).format('YYYY-MM-DD'))
}

function dayMouseout(_) {
  console.log('mouseout', moment(_.moment).format('YYYY-MM-DD'))
}

function dayClicked(_) {
  console.log('clicked', moment(_.moment).format('YYYY-MM-DD'))
}

function moreDates() {
  span += 30
  _calendar.span(span)
  d3.select("#datepicker").datum(days).call(_calendar)
}

module.exports = {
  moreDates: moreDates
}