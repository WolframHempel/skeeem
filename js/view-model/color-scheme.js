define(function( require ){

	var ko = require( 'ko' );
	var Color = require( './color' );
	var tinycolor = require( 'tinycolor' );

	function ColorScheme() {
		this.colors = ko.observableArray();
		this.liWidth = ko.observable();
		this._init( 5 );
	}

	ColorScheme.prototype.add = function() {
		this._addRandomColor();
		this._update();
	};

	ColorScheme.prototype.remove = function( color ) {
		var index = this.colors.indexOf( color );
		this.colors.splice( index , 1 );
		this._update();
	};

	ColorScheme.prototype._init = function( initialColorCount ) {
		for( var i = 0; i < initialColorCount; i++ ) {
			this._addRandomColor();
		}

		this.liWidth( ( 100 / initialColorCount ) + '%');
	};

	ColorScheme.prototype._randomInt = function() {
		return Math.floor( Math.random() * 255 );
	};

	ColorScheme.prototype._addRandomColor = function() {
		var color = new Color( this );
		
		color.set(tinycolor({ 
			r: this._randomInt(),
			g: this._randomInt(),
			b: this._randomInt(),
		}));

		this.colors.push( color );
	};

	ColorScheme.prototype._update = function() {
		this.liWidth( ( 100 / this.colors().length ) + '%');
	};

	return ColorScheme;
});