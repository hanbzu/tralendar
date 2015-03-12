var d3 = require('d3'),
    moment = require('moment')

function tralendar() {

  var _config = {
    start: _chooseFirstDay(moment().startOf('day')),
    days: 35,
    mouseoverCallback: function(_) { console.log('mouseover callback', _) },
    mouseoutCallback: function(_) { console.log('mouseout callback', _) },
    clickCallback: function(_) { console.log('click callback', _) }
  }
  
  // Initialise the root ol as undefined
  var _ol

  // The first day has to be the beginning of a week,
  // unless the month starts later
  function _chooseFirstDay(start) {
    return moment.max(moment(start).startOf('week'), moment(start).startOf('month'))
  }

  // Extend number of days till the end of the month
  function _getExtendedSpan(span) {
    var last = moment(_config.start)
        .add(span, 'days')
        .endOf('month')
        .endOf('day')

    return last.diff(_config.start, 'days') + 1
  }

  // A base calendar is an array of days from the start day to the
  // end of the month containing the start day + the number of days
  function _generateCalendar() {
    return d3.range(0, _config.days).map(function(_) {
      return moment(_config.start).add(_, 'days')
    })
  }

  // An extended calendar is nested by year-month
  // and has padding to respect weekdays
  function _generateExtendedCalendar(calendar, eventDays) {

    // Adds as many undefined items as additional days
    // are in the first week of each month.
    function addDayPadding(_) {
      var dayOne = moment(_[0].moment),
          weekdayOne = moment(dayOne).weekday(0)
      if (dayOne != weekdayOne)
        return d3.range(dayOne.diff(weekdayOne, 'days'))
                 .map(function() { return { isBlank: true } })
                 .concat(_)
      else
        return _
    }

    // Out of a moment element it creates a rich item depending on days set
    function buildItem(_) {

      var day = moment(_).format('YYYY-MM-DD'),
          inEventDays = eventDays.has(day)

      return {
        hasEvent: inEventDays,
        yearmonth: _.format('YYYY-MM'),
        moment: _,
        chosen: inEventDays ? eventDays.get(day).chosen : false
      }
    }

    // Nest a rich item array with `yearmonth` as a key,
    // ordered in ascending year-month, adding additional
    // padding days as undefined items out of calendar days
    // turned into rich items.
    return d3.nest()
        .key(function(_) { return _.yearmonth })
        .sortKeys(d3.ascending)
        .rollup(addDayPadding)
        .entries(calendar.map(buildItem))
  }


  var exports = function(_selection) {
    _selection.each(function(_data) {
      
      // Here we update what goes into ol.calendar (li items)
      function updateDayList(d) {

        var ol = d3.select(this).select('ol').selectAll('li')
                   .data(d.values)

        ol.enter()
          .append('li')
          .each(updateDay)

        ol.exit()
          .remove()
      }

      // Here we update what's in each of the ol.calendar > li items
      function updateDay(d) {

        var li = d3.select(this)
        
        // If there is no data (isBlank) we've got padding (blank li)
        li.classed('blank', d.isBlank)

        if (!d.isBlank) {
          li.classed('disabled', !d.hasEvent)
            .text(moment(d.moment).format('D'))
          if (d.hasEvent) {
            li.classed('chosen', d.chosen)
            li.on('mouseover', function(_) { _config.mouseoverCallback(_) })
            li.on('mouseout', function(_) { _config.mouseoutCallback(_) })
            li.on('click', function(_) {
              var day = d3.select(this)
              day.classed('chosen', !day.classed('chosen'))
              _config.clickCallback(_)
            })
          }
        }
      }

      var calendar = _generateCalendar(),
          data = _generateExtendedCalendar(calendar, _data)

      // Create the root ol if it's not there yet
      if (!_ol)
        _ol = d3.select(this)
          .append('ol').classed('calendar', true)

      var li = _ol.selectAll('li')
          .data(data, function(d) { return d.key })

      var monthLi = li.enter()
        .append('li').classed('month', true)
      
      // The MMMM format would be for example 'July'
      monthLi
        .append('h1').classed('monthname', true)
        .text(function(d) { return moment(d.key, 'YYYY-MM').format('MMMM') })
        
      monthLi
        .append('ol').classed('daygrid', true)

      li.exit()
        .remove()

      li.each(updateDayList)
    })
  }

  exports.starts = function(_) {
    if (!arguments.length) return _config.start.format('YYYY-MM-DD')
    _config.start = _chooseFirstDay(moment(_, 'YYYY-MM-DD'))
    return this
  }

  exports.span = function(_) {
    if (!arguments.length) return _config.days
    _config.days = _getExtendedSpan(_)
    return this
  }

  exports.clickCallback = function(_) {
    _config.clickCallback = _
    return this
  }

  exports.mouseoverCallback = function(_) {
    _config.mouseoverCallback = _
    return this
  }

  exports.mouseoutCallback = function(_) {
    _config.mouseoutCallback = _
    return this
  }

  exports.test = {
    calendar: function() {
      return _generateCalendar(_config.start, _config.days)
    },
    extendedCalendar: function(calendar, data) {
      return _generateExtendedCalendar(calendar, data)
    }
  }

  return exports
}

module.exports = tralendar
