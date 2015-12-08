requirejs.config({
    baseUrl: '.',
    paths: {
    	'emitter': 'js/utils/event-emitter',
    	'tinycolor': 'bower_components/tinycolor/dist/tinycolor-min',
    	'ko': 'bower_components/knockout/dist/knockout'
    }
});

(function(){
	var override = document.location.search.indexOf( 'no-chrome' ) !== -1;
	var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') !== -1 && navigator.userAgent.toLowerCase().indexOf('edge') === -1;

	if( !override && !isChrome ) {
		document.getElementById( 'chrome-warning' ).style.display = 'block';
	} else {
		require(['./bower_components/three.js/three.min.js', ], function(){
			require([ './js/view-model/main', 'ko' ], function( MainViewModel, ko ){
				ko.applyBindings( new MainViewModel() );
				
				window.addEventListener( 'mousemove', function( event ){
					window.mousePosRelX = ( -1 + ( 2 * ( event.pageX / window.innerWidth ) ) );
					window.mousePosRelY = ( -1 + ( 2 * ( event.pageY / window.innerHeight ) ) );
				});
			});
		});
	}
})();