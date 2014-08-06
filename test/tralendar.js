var benv = require('benv'),
    expect = require('chai').expect

/* The following comment avoids jslint error with 'to.exist' */
/* jshint expr: true */

describe('without benv setup', function() {
  it('does not find window', function() {
    expect(function () { require('../src/tralendar3.js') }).to.throw(/window/) })
})

describe('tralendar.js', function() {

  beforeEach(function(done) {
    benv.setup(function() {
      benv.expose({
        d3: require('../bower_components/d3/d3.js'),
        moment: require('../bower_components/moment/moment.js')
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

  it('creates valid calendar sets', function() {
    require('../src/tralendar.js')
    
    function toMoment(_) { return moment(_ + ' 00:00', 'YYYY-MM-DD HH:mm') }
    function toReadable(_) { return _.format('YYYY-MM-DD HH:mm') }
    function tryThis(date, days, result) {
      result = result.map(toMoment).map(toReadable)
      var tralendar = d3.tralendar()
          .starts(toMoment(date, 'YYYY-MM-DD'))
          .span(days)
      // It does not compare array contents if 'deep' is not used
      expect(tralendar.calendar().map(toReadable)).to.deep.equal(result)
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
        '2014-08-06', '2014-08-07', '2014-08-08', '2014-08-09', '2014-08-10',
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

  })
})