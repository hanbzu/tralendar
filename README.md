tralendar
=========

Data driven calendar generator in D3, suitable to do date picking and show available dates dynamically.

## Example
```javascript
// These are the dates that CAN be chosen together with any extra info
var rawData = [
    { date: '2023-07-15', extra: '', chosen = false },
    { date: '2023-07-20', extra: '', chosen = false },
    { date: '2023-07-21', extra: '', chosen = true }, // It will appear chosen
    { date: '2023-08-12', extra: '', chosen = false },
    { date: '2023-08-14', extra: '', chosen = false }
]

// We need to create an associative map first
var data = d3.nest()
    .key(function(d) { return d.date })
    .map(rawData, d3.map)

// Note that the starts setting is optional (current date is the default)
var tralendar = d3.tralendar()
    .starts('2023-07-15') // ISO 8601 dates: 'YYYY-MM-DD'
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

Grunt is being used to manage tasks and [mocha](http://visionmedia.github.io/mocha/) is used together with [chai](http://chaijs.com/) for tests. [benv](ttps://github.com/artsy/benv) provides a minimal browser environment for d3 generated html testig.


## License

MIT
