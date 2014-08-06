/* global window */
if (typeof window.d3 === 'undefined') {
  throw new Error('missing d3');
}

// A namespace
d3.edge = {}

// We add the table module, which is a simple function returning a function. The outer
// function serves as the scoped closure for our module.
d3.edge.table = function module() {

	var fontSize = 10,
	    fontColor = 'red'

  // To get events out of the module
  // we use d3.dispatch, declaring a "hover" event
  var dispatch = d3.dispatch('customHover')
  
  function exports(_selection) {
    _selection.each(function(_data) {

      d3.select(this)
        .append('div')
        .style({ 'font-size': fontSize + 'px', color: fontColor })
        .html('Hello World: ' + _data)
        // we trigger the "customHover" event which will receive
        // the usual "d" and "i" arguments as it is equiva-lent to:
        // .on('mouseover', function(d, i) {
        //    return dispatch.customHover(d, i);
        // });
        .on('mouseover', dispatch.customHover)

    })
  }

  // A function is also an object. We can add stuff to it
  exports.fontSize = function(_) {
    if (!arguments.length) return fontSize
    fontSize = _
    return this // This allows the methods to be chainable
  }

  exports.fontColor = function(_) {
    if (!arguments.length) return fontColor
    fontColor = _
    return this
  }
   
  // We can rebind the custom events to the "exports" function
  // so it's available under the typical "on" method
  d3.rebind(exports, dispatch, 'on')
  return exports
}

var dataset = [ 10, 23, 4, 32 ]

// Setters can also be chained directly to the returned function
var table = d3.edge.table().fontSize('20').fontColor('green')

// We bind a listener function to the custom event
table.on('customHover', function(d, i) {
  console.log('customHover: ' + d, i);
});

d3.select('body')
  .datum(dataset)
  .call(table);
