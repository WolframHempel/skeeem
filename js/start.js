requirejs.config({
    baseUrl: '.',
    paths: {
    	'emitter': 'js/utils/event-emitter',
    	'tinycolor': 'bower_components/tinycolor/dist/tinycolor-min'
    }
});

require(['./bower_components/three.js/three.min.js', ], function(){
	require([ './js/visualisations/color-cone' ], function( ColorCone ){
		new ColorCone({
			container:  document.body,
			width: 600,
			height: 600,
			pointSize: 0.05,
			radius: 3,
			coneHeight: 4,
			rings: 30,
			pointDensity: 30,
			innerRingDensity: 10,
			gapStart: Math.PI * 1.75,
			gapEnd: Math.PI * 2,
			colorSpace: 'HSL'
		});
	});
});