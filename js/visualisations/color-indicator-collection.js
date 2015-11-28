define(function( require ){

	var ColorIndicator = require( './color-indicator' );

	function ColorIndicatorCollection( container, getPositionForColor ) {
		this._colorIndicators = {};
		this._container = container;
		this._getPositionForColor = getPositionForColor;
	}

	ColorIndicatorCollection.prototype.setColorScheme = function( colorScheme ) {
		this._colorScheme = colorScheme;
		this._colorScheme.on( 'update', this._update, this );
		this._update();
	};

	ColorIndicatorCollection.prototype._update = function() {
		var colors = this._colorScheme.colors();
		var i, colorId, index;

		for( i = 0; i < colors.length; i++ ) {
			if( this._colorIndicators[ colors[ i ].id ] === undefined ) {
				this._colorIndicators[ colors[ i ].id ] = new ColorIndicator( this._container, colors[ i ], this._getPositionForColor );
			}
		}

		for( colorId in this._colorIndicators ) {
			index = colors.indexOf( this._colorIndicators[ colorId ].color );
			
			if( index === -1 ) {
				this._colorIndicators[ colorId ].destroy();
				delete this._colorIndicators[ colorId ];
			}
		}
	};

	return ColorIndicatorCollection;
});