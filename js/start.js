requirejs.config({
    baseUrl: '.',
    paths: {
    	'emitter': 'js/utils/event-emitter',
    	'tinycolor': 'bower_components/tinycolor/dist/tinycolor-min'
    }
});

require(['./bower_components/three.js/three.min.js', ], function(){
	require([ './js/visualisations/hsv-cone' ], function( HsvCone ){
		new HsvCone({
			container:  document.body,
			width: 300,
			height: 300
		});
	});
});