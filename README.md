tralendar
=========

Data driven calendar generator in D3, suitable to do date picking and show available dates dynamically.

## Example
```javascript
// These are the dates that CAN be chosen together with any extra info
var rawData = [
    { date: '2014-07-15', extra: '' },
    { date: '2014-07-20', extra: '' },
    { date: '2014-07-21', extra: '' },
    { date: '2014-08-12', extra: '' },
    { date: '2014-08-14', extra: '' }
]

// We need to create an associative map first
var data = d3.nest()
    .key(function(d) { return d.date })
    .map(rawData.map(function(_) { return { date: _, extra: '' } }), d3.map)

var tralendar = d3.tralendar()
    .starts('2014-07-15') // ISO 8601 dates: 'YYYY-MM-DD'
    .span(35) // Number of days, at least
    .callback(function(_) {
      console.log('clicked', _)
    })

// Select where it will go, add the data and generate!
d3.select('body')
  .datum(data)
  .call(tralendar)
```

As you can see above, in order to get notified when the user clicks on any valid day you have to provide a callback function.


## Dependencies

It uses of course [d3.js](http://d3js.org/) and [moment.js](http://momentjs.com/) internally for date handling.

This is what the generated HTML looks like:

```html
<ol class="tralendar">
  <li>July, 2023
    <ol>
      <li class="blank"></li>
      <li>1</li>
      <li>2</li>
      <li class="disabled">3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
      <li>7</li>
      ...
    </ol>
  </li>
  <li>August, 2023
    <ol>
      <li class="blank"></li>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      ...
    </ol>
  </li>
</ol>
```

This HTML ordered list structure can be transformed to a calendar structure using the CSS file provided or your own

[
{ date: '2014-07-23', extra: '' },

]

{
  '2014-07-23': {
    text: 'hello'
  }
}

## Contributing

Grunt is being used to manage tasks and [mocha](http://visionmedia.github.io/mocha/) is used together with [chai](http://chaijs.com/) for tests. [benv](ttps://github.com/artsy/benv) provides a minimal browser environment for d3 generated html testig.

## License

MIT
