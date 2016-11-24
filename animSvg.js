angular
    .module('anim-svg', [])
    .directive('animSvg', animSvg);

function animSvg($timeout, $window, $document) {
    var svgNS = 'http://www.w3.org/2000/svg',
        animAttrPfx = 'animAttr',
        animAttrRx = new RegExp('^' + animAttrPfx + '.*$'),
        domAttrPfx = 'anim-attr-',
        defaultEasing = '0.1 0.8 0.2 1';

    function link($scope, $element, $attrs) {
        var animAttrs = collectAnimAttrs($attrs),
            duration = $scope.$eval($attrs.animDuration),
            delay = $attrs.animDelay ? $scope.$eval($attrs.animDelay) : 0,
            easing = $attrs.animEasing ? $scope.$eval(animEasing) : defaultEasing;
        $scope.$watchGroup(
            animAttrs.map(function(animAttr) { return $attrs[animAttr.normalized]; }),
            function(animValsNew) {
                animate($element, animAttrs, animValsNew, duration, delay, easing);
            }
        );
    }

    function collectAnimAttrs($attrs) {
        var animAttrs = [],
            attr,
            match;
        for (attr in $attrs) {
            if ($attrs.hasOwnProperty(attr)) {
                if ((match = attr.match(animAttrRx))) {
                    animAttrs.push({
                        dom: $attrs.$attr[match[0]].replace(domAttrPfx, ''),
                        normalized: match[0]
                    });
                }
            }
        }
        return animAttrs;
    }

    function animate($element, attrs, values, duration, delay, easing) {
        for (var i = 0; i < attrs.length; i++) {
            $element.append(
                angular.element($document[0].createElementNS(svgNS, 'animate'))
                    .attr('attributeName', attrs[i].dom)
                    .attr('attributeType', 'XML')
                    .attr('from', $element.attr(attrs[i].dom))
                    .attr('to', values[i])
                    .attr('begin', ($window.performance.now() + delay) + 'ms')
                    .attr('dur', duration + 'ms')
                    .attr('calcMode', 'spline')
                    .attr('keyTimes', '0; 1')
                    .attr('keySplines', easing)
                    .on('beginEvent', onBegin.bind(null, $element, attrs[i].dom, values[i]))
                    .on('endEvent', onEnd)
            );
        }
    }

    function onBegin($element, attr, toValue, e) {
        $element.attr(attr, toValue);
    }

    function onEnd(e) {
        angular.element(e.target).remove();
    }

    return {
        restrict: 'A',
        link: link
    };
}
