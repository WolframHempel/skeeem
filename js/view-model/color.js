define(function( require ){

	var ko = require( 'ko' );

	function Color( colorScheme ) {
		this.id = 'x' + Math.random().toString().replace( '.', '' );
		this.rgb = ko.observable();
		this.hex = ko.observable();
		this.hsv = ko.observable();
		this.hsl = ko.observable();
		this.isHighlighted = ko.observable( false );
		this.isSelected = ko.observable( false );
		this.isDark = ko.observable( false );
		this.liWidth = colorScheme.liWidth;
		this.color = null;
		this._colorScheme = colorScheme;
	}

	Color.prototype.getRgb = function() {
		return this.color.toRgb();
	};

	Color.prototype.getArray = function() {
		var rgb = this.color.toRgb();
		return [ rgb.r, rgb.g, rgb.b ];
	};
	
	Color.prototype.select = function() {
		this._colorScheme.select( this );
	};

	Color.prototype.remove = function() {
		this._colorScheme.remove( this );
	};

	Color.prototype.set = function( tinyColor ) {
		this.color = tinyColor;
		this.rgb( tinyColor.toRgbString() );
		this.hex( tinyColor.toHexString().toUpperCase() );
		this.hsv( tinyColor.toHsvString() );
		this.hsl( tinyColor.toHslString() );
		this.isDark( tinyColor.toHsl().l < 0.4 );
		this._colorScheme.emit( 'update' );
	};

	return Color;
});