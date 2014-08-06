/* global window */
if (typeof d3 === 'undefined') {
  throw new Error('missing d3');
}

d3.tralendar = function(config) {

  function generateCalendar2(ref) {
    function createDays(ref) {
      var days = []
      function addBlankDays(howMany) {
        for (i = 0; i < howMany; i++)
          days.push(undefined)
      }
      function addDays(start, howMany) {
        for (i = 0; i < howMany; i++)
          days.push(moment(start).add('days', i)) 
      }
      var firstOfWeek = moment(ref).weekday(0),
          firstOfMonth = moment(ref).date(1)
      if (firstOfMonth.isBefore(firstOfWeek)) {
        // 23 24 25 26 27 28 29
        addDays(firstOfWeek, ref.daysInMonth() - firstOfWeek.diff(firstOfMonth, 'days'))
      }
      else {
        //  _  _  1  2  3  4  5
        addBlankDays(firstOfMonth.diff(firstOfWeek, 'days'))
        addDays(firstOfMonth, ref.daysInMonth())
      }
      return days
    }

    var nextMonth = moment(ref).add('months', 1)
    return [
      {
        month: ref.format('MMMM, YYYY'),
        days: createDays(ref).map(readablify)
      },
      {
        month: nextMonth.format('MMMM, YYYY'),
        days: createDays(moment(ref).add('months', 1)).map(readablify)
      }
    ]
  }

  function generateCalendar(start, days) {
    function extendedDays() { // Days have to extend until the end of the month
      var last = moment(start).add('days', days)
          .endOf('month')
          .hours(0).minutes(0).seconds(0)
      return last.diff(start, 'days') + 1
    }
    return d3.range(0, extendedDays()).map(function(_) {
      return moment(start).add('days', _)
    })
  }

  function mergeData(departureTimes) {
    var days = d3.set(departureTimes.map(function(_) {
      return moment(_).hours(0).minutes(0).seconds(0)
    }))
    var data = config.calendar.map(function(_) {
      var day = moment(_).hours(0).minutes(0).seconds(0),
          action = 'disabled'
      if (days.has(day))
        action = '' + _.format('YYYY-MM-DD')        
      return {
        action: action,
        yearmonth: _.format('YYYY-MM'),
        moment: day
      }
    })
    /** Adds as many undefined items as extra days are in the first week of each month. */
    function addDayPadding(_) {
      var dayOne = moment(_[0].moment),
          weekdayOne = moment(dayOne).weekday(0)
      //console.log([weekdayOne, dayOne].map(function(_) { return _.format('ddd MM-DD HH:mm')}))
      if (dayOne != weekdayOne)
        return d3.range(dayOne.diff(weekdayOne, 'days')).map(function() { return undefined }).concat(_)
      else
        return _
    }
    //console.log(data.map(readablify))
    //console.log(addDayPadding(data).map(readablify))
    var nest = d3.nest()
        .key(function(_) { return _.yearmonth })
        .sortKeys(d3.ascending)
        .rollup(addDayPadding)
        .entries(data)

    //console.log('thedata', nest)

  }


  config = config || {}
  config.start = moment().hours(0).minutes(0).seconds(0)
  config.days = 45
  config.extractor = function(_) { return _ }
  config.calendar = generateCalendar(config.start, config.days)

  function readablify(_) {
    if (_ === undefined)
      return '---'
    else {
      _.date = _.date.format('ddd, YYYY MM DD') 
      return _
    }      
  }

  //console.log(config.calendar)

  var tral = function(selection) {

    return tral
  }

  tral.starts = function(start) {
    config.start = start
    return tral
  }

  tral.span = function(days) {
    config.days = days
    return tral
  }

  tral.extractor = function(_) {
    config.extractor = _
    return tral
  }

  tral.calendar = function() {
    config.calendar = generateCalendar(config.start, config.days)
    mergeData([ '2014-08-04 15:32', '2014-08-04 18:32', '2014-08-05 15:40'].map(function(_) {
      return moment(_)
    }))
    //console.log(config.calendar.map(function(_){ return _.format('MM.DD')}))
    return config.calendar
  }


  return tral
}
