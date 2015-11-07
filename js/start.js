requirejs.config({
    baseUrl: '.',
    paths: {
    	'emitter': 'js/utils/event-emitter',
    	'tinycolor': 'bower_components/tinycolor/dist/tinycolor-min',
    	'ko': 'bower_components/knockout/dist/knockout'
    }
});

require(['./bower_components/three.js/three.min.js', ], function(){
	require([ './js/view-model/main', 'ko' ], function( MainViewModel, ko ){
		ko.applyBindings( new MainViewModel() );
	});
});