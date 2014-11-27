if (typeof d3 === 'undefined') {
  throw new Error('missing d3');
}

d3.tralendar = function module() {

  var config = {
    start: chooseFirstDay(moment().hours(0).minutes(0).seconds(0)),
    days: 35,
    mouseoverCallback: function(_) {  },
    mouseoutCallback: function(_) {  },
    clickCallback: function(_) { console.log('onClick callback') }
  }
  
  var ol // Initialise the root ol as undefined

  /** The first day has to be the beginning of a week, unless the month starts later */
  function chooseFirstDay(start) {
    var startOfWeek = moment(start).startOf('week'),
        startOfMonth = moment(start).startOf('month')
    return startOfWeek.isBefore(startOfMonth) ? startOfMonth : startOfWeek
  }

  /** A base calendar is an array of days from the start day to the
    end of the month containing the start day + the number of days */
  function generateCalendar() {

    /** Extend number of days till the end of the month */
    function extendedDays() {
      var last = moment(config.start).add(config.days, 'days')
          .endOf('month')
          .hours(23).minutes(59).seconds(59)

      console.log('START', config.start.format('YYYY-MM-DD'))
      console.log('LAST', last.format('YYYY-MM-DD'))
      return last.diff(config.start, 'days') + 1
    }

    return d3.range(0, extendedDays()).map(function(_) {
      return moment(config.start).add(_, 'days')
    })
  }

  /** An extended calendar is nested by year-month and has padding to respect weekdays */
  function generateExtendedCalendar(calendar, eventDays) {

    /** Adds as many undefined items as extra days are in the first week of each month. */
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

    /** Out of a moment element it creates a rich item depending on days set */
    function buildItem(_) {

      var day = moment(_).format('YYYY-MM-DD'),
          inEventDays = eventDays.has(day)

      return {
        hasEvent: inEventDays,
        yearmonth: _.format('YYYY-MM'),
        moment: _,
        extra: inEventDays ? eventDays.get(day)[0].extra : '', // I take 0 because I may get more than a day
        chosen: inEventDays ? eventDays.get(day)[0].chosen : false
      }
    }

    // Nest a rich item array
    return d3.nest()
        .key(function(_) { return _.yearmonth }) // ...with year-month as a key
        .sortKeys(d3.ascending) // ...ascending year-month order
        .rollup(addDayPadding) // ...adding extra padding days as undefined items
        .entries(calendar.map(buildItem)) // ...out of calendar days turned into rich items
  }


  var exports = function(_selection) {
    _selection.each(function(_data) {
      
      /** Here we update what goes into ol.calendar (li items) */
      function updateDayList(d) {

        var ol = d3.select(this).select('ol').selectAll('li')
                   .data(d.values)

        ol.enter()
          .append('li')
          .each(updateDay)

        ol.exit()
          .remove()
      }

      /** Here we update what's into each of the ol.calendar > li items (day, extra info, class, onclick...) */
      function updateDay(d) {

        //console.log(d)

        var li = d3.select(this)
        
        // If there is no data (isBlank) we've got padding (blank li)
        li.classed('blank', d.isBlank)

        if (!d.isBlank) {
          li.classed('disabled', !d.hasEvent)
            .text(moment(d.moment).format('D'))
          if (d.hasEvent) {
            li.classed('chosen', d.chosen)
            li.on('mouseover', function(_) { config.mouseoverCallback(_) })
            li.on('mouseout', function(_) { config.mouseoutCallback(_) })
            li.on('click', function(_) {
              var day = d3.select(this)
              day.classed('chosen', !day.classed('chosen'))
              config.clickCallback(_)
            })
          }
        }
      }

      var calendar = generateCalendar(),
          data = generateExtendedCalendar(calendar, _data)

      console.log('------>', data)

      if (!ol) // Create the root ol if it's not there yet
        ol = d3.select(this)
          .append('ol').classed('calendar', true)

      var li = ol.selectAll('li')
          .data(data, function(d) { return d.key })

      var monthLi = li.enter()
        .append('li').classed('month', true)
      
      monthLi
        .append('h1').classed('monthname', true)
        .text(function(d) { return moment(d.key, 'YYYY-MM').format('MMMM') }) // July
        
      monthLi
        .append('ol').classed('daygrid', true)

      li.exit()
        .remove()

      li.each(updateDayList)
    })
  }

  exports.starts = function(_) {
    if (!arguments.length) return config.start.format('YYYY-MM-DD')
    config.start = chooseFirstDay(moment(_, 'YYYY-MM-DD'))
    return this
  }

  exports.span = function(_) {
    if (!arguments.length) return config.days
    config.days = _
    return this
  }

  exports.clickCallback = function(_) {
    config.clickCallback = _
    return this
  }

  exports.mouseoverCallback = function(_) {
    config.mouseoverCallback = _
    return this
  }

  exports.mouseoutCallback = function(_) {
    config.mouseoutCallback = _
    return this
  }

  exports.test = {
    calendar: function() {
      return generateCalendar(config.start, config.days)
    },
    extendedCalendar: function(calendar, data) {
      return generateExtendedCalendar(calendar, data)
    }
  }

  return exports
}
