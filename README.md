# ng-anim-svg

**anim-svg** is an AngularJS directive that implements declarative attribute animations on SVG elements.

Angular provides data-binding for arbitrary attributes in SVG documents using [ng-attr][ng-attr-url]. However, it does not natively support any convenient method to animate those attributes. This significantly limits Angular's ability to replace D3's jQuery-like DOM manipulation with cleaner, more readable template binding, which also serves to separate DOM manipulation from more readily unit-testable code.

To remedy that limitation, this directive adds support for template attribute animations in a familiar syntax similar to that used by D3 [transitions][d3-transition-url].

View a live demo on [Plnkr][plnkr-url].

## Installation

**anim-svg** is available through NPM:

```text
npm install ng-anim-svg
```

Or, via bower:

```text
bower install ng-anim-svg --save
```

Include `animSvg.min.js` in your build or directly with a `<script>` tag and require the module in your module definition:

```js
angular  
    .module('App', [  
        'anim-svg',  
        ... // other dependencies  
    ]);
```

## Usage

Taken from the Plnkr demo above, the below code is an example of a simple SVG `<rect>` element using `ng-attr` and `anim-svg` to data-bind attribute values to dynamic `$scope` [expressions][expression-url] using D3 [scale][scale-url] functions:

```html
<rect x="0"  
    ng-attr-y="{{ yScale($index) - (barHeight / 2) }}"  
    ng-attr-height="{{ barHeight }}"  
    width="0"  
    anim-svg  
    anim-duration="animDuration"  
    anim-delay="animDelay * $index"  
    anim-attr-width="xScale(grade.score)" />
```

The code above is equivalent to the following D3 code:

```js
svgEl.append('rect')  
    .attr('x', 0)  
    .attr('y', function(d, i) { return yScale(i) - (barHeight / 2); })  
    .attr('height', barHeight)  
    .attr('width', 0)  
    .transition()  
    .duration(animDuration)  
    .delay(animDelay)  
    .attr('width', function(d) { return xScale(d.score); });
```

Both code snippets above will result in an SVG `<rect>` such that:

- The `x` coordinate is 0 (far-left side of the SVG container)
- The `y` coordinate is the result of calling a pre-configured D3 linear scale with the index of the current datum, minus half of `barHeight` (to center the bar)
- The `height` is defined by `barHeight`
- The `width` starts at 0
- The `width` is animated over a number of milliseconds defined by `animDuration`
- The animation will wait a number of milliseconds defined by `animDelay` multiplied by the index of the current datum (D3 does this implicitly; `anim-svg` requires you to do it yourself using `$index`)
- The final value of `width` is the result of calling a pre-configured D3 linear scale with the `score` property of the current datum

Under the hood, the implementation of this directive uses the native SVG [&lt;animate&gt;][mdn-animate-url] tag. More complex SVG animations can be defined (and reused) by creating custom Angular attribute directives whose templates contain multiple `<animate>` tags.


## API Reference

`anim-svg`  
A no-value attribute that links the animation directive to the target element.

`anim-duration (Number)`  
Angular expression that defines, in milliseconds, how long the animation should last.  
The `anim-duration` expression is only evaluated once, when the directive is linked.

`[anim-delay] (Number): default 0`  
Angular expression that defines, in milliseconds, how long to wait before starting the animation.  
This can be used in concert with `ng-repeat` and the `$index` reference to stagger animations.  
For example, `anim-delay="$index * 250"` will cause each successive element to wait 250ms after the previous element before beginning an animation (as shown in the Plnkr example above).  
The `anim-delay` expression is only evaluated once, when the directive is linked.

`[anim-easing] (String): default '0.1 0.8 0.2 1'`  
Angular expression that evaluates to a `String` containing a four values defining a cubic Bézier function that controls interval pacing in the same format as the [keySplines][keySplines-url] attribute of the SVG `<animate>` tag.  
The `anim-easing` expression is only evaluated once, when the directive is linked.

`anim-attr-* (Number)`  
Angular expression that evaluates to a value defining the "destination" of the animation.  
Correlates to the [to][to-url] attribute of the SVG `<animate>` tag. The [from][from-url] value is taken from the current value of the attribute when the animation begins.  
For example, `anim-attr-x="250"` will animate the element from its current `x` position to `x="250"` over the duration and easing specified above.  
The value of `anim-attr-*` is `$watched`, so anytime the evaluated value of the expression changes, the element's attribute will be animated from its current value to the new value.

[ng-attr-url]: https://docs.angularjs.org/guide/interpolation#-ngattr-for-binding-to-arbitrary-attributes
[d3-transition-url]: https://github.com/d3/d3-transition#transition

[mdn-animate-url]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate 
[expression-url]: https://docs.angularjs.org/guide/expression
[scale-url]: https://github.com/d3/d3/blob/master/API.md#scales-d3-scale
[keySplines-url]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/keySplines
[to-url]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/to
[from-url]: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/from
