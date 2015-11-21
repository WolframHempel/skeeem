define(function( require ){

	var ko = require( 'ko' );

	function Color( colorScheme ) {
		this.rgb = ko.observable();
		this.hex = ko.observable();
		this.hsv = ko.observable();
		this.hsl = ko.observable();
		this.isDark = ko.observable( false );
		this.liWidth = colorScheme.liWidth;

		this._colorScheme = colorScheme;
		this._color = null;
	}

	Color.prototype.remove = function() {
		this._colorScheme.remove( this );
	};

	Color.prototype.set = function( tinyColor ) {
		this._color = tinyColor;
		this.rgb( tinyColor.toRgbString() );
		this.hex( tinyColor.toHexString().toUpperCase() );
		this.hsv( tinyColor.toHsvString() );
		this.hsl( tinyColor.toHslString() );

		var rgb = tinyColor.toRgb();
		var sum = rgb.r + rgb.g + rgb.b;

		this.isDark( sum < 382.5 );
	};

	return Color;
});