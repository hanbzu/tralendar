tralendar
=========

Data driven calendar generator in D3, suitable to do date picking and show available dates dynamically.

## Example
```javascript
// Using Browserify/Node.js to import the module and D3
var tralendar = require('tralendar'),
    d3 = require('d3')

// These are the dates that CAN be chosen
var rawData = [
    { date: '2023-07-15', chosen: false },
    { date: '2023-07-20', chosen: false },
    { date: '2023-07-21', chosen: true }, // It will appear chosen
    { date: '2023-08-12', chosen: false },
    { date: '2023-08-14', chosen: false }
]

// We need to create an associative map first
var dataMap = d3.map()

rawData.forEach(function(d) {
  dataMap.set(d.date, d)
})

// Note that the starts setting is optional (current date is the default)
var calendar = tralendar()
    .starts('2023-07-15') // ISO 8601 dates: 'YYYY-MM-DD'
    .span(35) // Number of days, at least
    .clickCallback(function(_) {
      console.log('clicked', _)
    })

// Select where it will go, add the data and generate!
d3.select('body')
  .datum(dataMap)
  .call(calendar)
```

As you can see above, in order to get notified when the user clicks on any valid day you have to provide a callback function.


## Output

This is what the generated HTML looks like:

```html
<ol class="tralendar">
  <li>
    <h1 class="monthname">July</h1>
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
  <li>
    <h1 class="monthname">August</h1>
    <ol>
      <li class="blank"></li>
      <li>1</li>
      <li>2</li>
      <li class="chosen">3</li>
      <li>4</li>
      <li>5</li>
      ...
    </ol>
  </li>
</ol>
```

This HTML ordered list structure can be transformed to a calendar structure using the CSS file provided or your own


## Dependencies

It uses of course [d3.js](http://d3js.org/) and [moment.js](http://momentjs.com/) internally for date handling.


## Contributing

Grunt is being used to manage tasks and [mocha](http://mochajs.org/) is used together with [chai](http://chaijs.com/) for tests. [benv](ttps://github.com/artsy/benv) provides a minimal browser environment for d3 generated html testig.


## License

MIT
