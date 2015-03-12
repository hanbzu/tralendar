var benv = require('benv'),
    expect = require('chai').expect

/* The following comment avoids jslint error with 'to.exist' */
/* jshint expr: true */

/*
describe('without benv setup', function() {
  it('does not find window', function() {
    expect(function () { require('../src/_calendar.js') }).to.throw(/window/) })
})*/

describe('tralendar.js', function() {

  beforeEach(function(done) {
    benv.setup(function() {
      benv.expose({
        // Dependencies
        d3: require('d3'),
        moment: require('moment'),
        tralendar: require('../src/tralendar'),
        // Helper functions
        toMoment: function(_) { return moment(_ + ' 00:00', 'YYYY-MM-DD HH:mm') },
        toReadable: function(_) { return _.format('YYYY-MM-DD HH:mm') }
      })
      done()
    })
  })

  afterEach(function() {
    // Clean up the globals exposed by setup and expose so other tests can run without being harmed.
    benv.teardown()
  })

  it('has all dependencies', function() {
    expect(d3).to.be.an('object')
    expect(moment).to.be.a('function')
  })

  it('chooses the first day of week as start date when into month', function() {
    // If I say '2014-07-16' (wed) it should take the start of week (either mon or sun)
    var iSay = moment('2014-07-16', 'YYYY-MM-DD'),
        iTtakes = moment(iSay).weekday(0),
        _calendar = tralendar().starts(iSay.format('YYYY-MM-DD'))
    expect(_calendar.starts()).to.equal(iTtakes.format('YYYY-MM-DD'))
  })

  it('chooses the first day of month as start date when at first week', function() {
    // If I say '2014-08-02' (sat) it should take the start of the month
    var iSay = moment('2014-08-02', 'YYYY-MM-DD'),
        iTtakes = moment('2014-08-01', 'YYYY-MM-DD'),
        _calendar = tralendar().starts(iSay.format('YYYY-MM-DD'))
    expect(_calendar.starts()).to.equal(iTtakes.format('YYYY-MM-DD'))
  })

  it('creates valid calendar sets', function() {
    
    moment.locale('eu')
    
    function tryThis(date, days, result) {
      result = result.map(toMoment).map(toReadable)
      var _calendar = tralendar()
          .starts(toMoment(date, 'YYYY-MM-DD'))
          .span(days)

      // It does not compare array contents if 'deep' is not used
      expect(result).to.deep.equal(_calendar.test.calendar().map(toReadable))
    }
    
    tryThis('2014-07-21', 30, [
        '2014-07-21', '2014-07-22', '2014-07-23', '2014-07-24', '2014-07-25', '2014-07-26', '2014-07-27',
        '2014-07-28', '2014-07-29', '2014-07-30', '2014-07-31',
        '2014-08-01', '2014-08-02', '2014-08-03',
        '2014-08-04', '2014-08-05', '2014-08-06', '2014-08-07', '2014-08-08', '2014-08-09', '2014-08-10',
        '2014-08-11', '2014-08-12', '2014-08-13', '2014-08-14', '2014-08-15', '2014-08-16', '2014-08-17', 
        '2014-08-18', '2014-08-19', '2014-08-20', '2014-08-21', '2014-08-22', '2014-08-23', '2014-08-24',
        '2014-08-25', '2014-08-26', '2014-08-27', '2014-08-28', '2014-08-29', '2014-08-30', '2014-08-31'
      ])
    
    tryThis('2014-08-06', 30, [
        '2014-08-04', '2014-08-05', '2014-08-06', '2014-08-07', '2014-08-08', '2014-08-09', '2014-08-10',
        '2014-08-11', '2014-08-12', '2014-08-13', '2014-08-14', '2014-08-15', '2014-08-16', '2014-08-17', 
        '2014-08-18', '2014-08-19', '2014-08-20', '2014-08-21', '2014-08-22', '2014-08-23', '2014-08-24',
        '2014-08-25', '2014-08-26', '2014-08-27', '2014-08-28', '2014-08-29', '2014-08-30', '2014-08-31',
        '2014-09-01', '2014-09-02', '2014-09-03', '2014-09-04', '2014-09-05', '2014-09-06', '2014-09-07',
        '2014-09-08', '2014-09-09', '2014-09-10', '2014-09-11', '2014-09-12', '2014-09-13', '2014-09-14',
        '2014-09-15', '2014-09-16', '2014-09-17', '2014-09-18', '2014-09-19', '2014-09-20', '2014-09-21',
        '2014-09-22', '2014-09-23', '2014-09-24', '2014-09-25', '2014-09-26', '2014-09-27', '2014-09-28',
        '2014-09-29', '2014-09-30'
      ])
  })

  it('creates a valid rich calendar sets', function() {

    function tryThis(calendar, eventDays, keys, paddings) {

      function countBlankItems(_) {
        return _.values.reduce(function(previous, current) {
          return previous + (current.isBlank ? 1 : 0)
        }, 0)
      }
    
      calendar = calendar.map(function(_) { return moment('2014-' + _ + ' 00:00', 'YYYY-MM-DD') })
      eventDays = d3.nest()
                      .key(function(d) { return d.date })
                      .map(eventDays.map(function(_) { return { date: '2014-' + _, extra: '' } }), d3.map)

      var _calendar = tralendar(),
          extendedCalendar = _calendar.test.extendedCalendar(calendar, eventDays),
          extendedCalendarKeys = extendedCalendar.map(function(_) { return _.key }),
          extendedCalendarPaddings = extendedCalendar.map(countBlankItems)

      expect(extendedCalendarKeys).to.deep.equal(keys)
      expect(extendedCalendarPaddings).to.deep.equal(paddings)
    }

    tryThis(
      [ '07-21', '07-22', '07-23', '07-24', '07-25', '07-26', '07-27',
        '07-28', '07-29', '07-30', '07-31',
        '08-01', '08-02', '08-03',
        '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10',
        '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17' ],
      [ '08-04', '08-05', '08-06' ],
      [ '2014-07', '2014-08' ],
      [ 0, 4 ])
  })

  it('generates correct html', function() {

    moment.locale('eu')

    var rawData = [ '2014-07-15', '2014-07-20', '2014-07-21', '2014-07-22', '2014-08-07', '2014-08-08' ]

    var data = d3.nest()
        .key(function(d) { return d.date })
        .map(rawData.map(function(_) {
          return {
            date: _,
            chosen: _ === '2014-08-07' ? true : false,
            extra: ''
          }
        }), d3.map)

    var _calendar = tralendar()
        .starts(moment('2014-07-15', 'YYYY-MM-DD'))
        .span(35) // Number of days

    d3.select('body')
      .datum(data)
      .call(_calendar)

    // creates html code for a calendar class ol
    expect(d3.select('ol').classed('calendar')).to.be.true

    // creates html code with correct labels for jul-2013 and aug-2013
    expect(d3.select('ol.calendar>li:nth-child(1)').select('h1.monthname').text().substring(0, 13)).to.equal('uztaila')
    expect(d3.select('ol.calendar>li:nth-child(2)').select('h1.monthname').text().substring(0, 13)).to.equal('abuztua')
 
    //  creates html code with correct disabled days when no data is available'   
    var daysInJul = d3.select('ol.calendar>li:nth-child(1)>ol')

    // Days with content in July: 15, 20, 21, 22
    expect(daysInJul.selectAll('li:nth-child(2)').classed('disabled')).to.be.false
    expect(daysInJul.selectAll('li:nth-child(7)').classed('disabled')).to.be.false
    expect(daysInJul.selectAll('li:nth-child(8)').classed('disabled')).to.be.false
    expect(daysInJul.selectAll('li:nth-child(9)').classed('disabled')).to.be.false
    
    // Other days without content
    expect(daysInJul.selectAll('li:nth-child(1)').classed('disabled')).to.be.true
    expect(daysInJul.selectAll('li:nth-child(3)').classed('disabled')).to.be.true
    expect(daysInJul.selectAll('li:nth-child(10)').classed('disabled')).to.be.true
    expect(daysInJul.selectAll('li:nth-child(18)').classed('disabled')).to.be.true

    var daysInAug = d3.selectAll('ol.calendar>li:nth-child(2)>ol')
    
    // Days with content in August: 7, 8 (remeber there's 4 days of padding in aug-2014)
    expect(daysInAug.selectAll('li:nth-child(11)').classed('disabled')).to.be.false // 7th
    expect(daysInAug.selectAll('li:nth-child(12)').classed('disabled')).to.be.false // 8th

    // Days are chosen ?
    expect(daysInAug.selectAll('li:nth-child(11)').classed('chosen')).to.be.true // 7th (chosen)
    expect(daysInAug.selectAll('li:nth-child(12)').classed('chosen')).to.be.false // 8th

    // Other days without content
    expect(daysInAug.selectAll('li:nth-child(5)').classed('disabled')).to.be.true
    expect(daysInAug.selectAll('li:nth-child(10)').classed('disabled')).to.be.true
    expect(daysInAug.selectAll('li:nth-child(35)').classed('disabled')).to.be.true

    // Padding in august
    expect(daysInAug.selectAll('li:nth-child(1)').classed('blank')).to.be.true
    expect(daysInAug.selectAll('li:nth-child(2)').classed('blank')).to.be.true
    expect(daysInAug.selectAll('li:nth-child(3)').classed('blank')).to.be.true
    expect(daysInAug.selectAll('li:nth-child(4)').classed('blank')).to.be.true

  })  
})