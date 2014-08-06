/*
tralendar 0.0.1- A calendar generator in D3, suitable to do date picking or date range picking
https://github.com/hanbzu/tralendar.git
Built on 2014-07-22
*/
module.exports = {
	add: function (a, b) {
		return a + b;
	},

	subtract: function (a, b) {
		return a - b;
	}
}; ;
var d3 = d3 || {} // For the current setup of mocha tests
var moment = require('../bower_components/moment/moment.js').moment

var isNode = typeof exports !== 'undefined' && this.exports !== exports

console.log(moment)


d3.tralendar = function(config) {

  function generateCalendar(ref) {
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

  config = config || {}
  config.start = moment()
  config.days = 45
  config.extractor = function(_) { return _ }
  config.calendar = generateCalendar(config.start)

  function readablify(_) {
    if (_ === undefined)
      return '---'
    else 
      return _.format('ddd, YYYY MM DD')      
  }

  console.log(config.calendar)

  var tral = function(selection) {

    return tral
  }


  tral.span = function(start, days) {
    config.start = start
    config.days = days
    return tral
  }

  tral.extractor = function(_) {
    config.extractor = _
    return tral
  }


  var myFunc = function() { return 3 }
  return tral
}

/*
function generateMonth(monthnum) {
  var m = moment().month(monthnum)
  console.log(m.daysInMonth())  

}

generateMonth(0)
generateMonth(2)
*/



/*
var calendar = d3.tralendar()

function chosen(day) {
  console.log(day, "chosen")
  d3.json("days2.json", function(error, json) {
    if (error) return console.warn(error)
    console.log(json)
    d3.select("#datepicker")
      .datum(json)
      .call(calendar)
  });
}

calendar.callback(chosen)

d3.json("days.json", function(error, json) {
  if (error) return console.warn(error)
  d3.select("#datepicker")
    .datum(json)
    .call(calendar)
});
*/

//exports.myFunc = d3.tralendar.myFunc
 
module.exports = d3.tralendar();
(function() {
  var cubes, list, math, num, number, opposite, race, square,
    __slice = [].slice;

  number = 42;

  opposite = true;

  if (opposite) {
    number = -42;
  }

  square = function(x) {
    return x * x;
  };

  list = [1, 2, 3, 4, 5];

  math = {
    root: Math.sqrt,
    square: square,
    cube: function(x) {
      return x * square(x);
    }
  };

  race = function() {
    var runners, winner;
    winner = arguments[0], runners = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return print(winner, runners);
  };

  if (typeof elvis !== "undefined" && elvis !== null) {
    alert("I knew it!");
  }

  cubes = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      num = list[_i];
      _results.push(math.cube(num));
    }
    return _results;
  })();

}).call(this);
