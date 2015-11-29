define(function( require ){

	var ko = require( 'ko' );
	var Color = require( './color' );
	var tinycolor = require( 'tinycolor' );
	var Emitter = require( 'emitter' );

	function ColorScheme() {
		Emitter.call( this );
		this.colors = ko.observableArray();
		this.liWidth = ko.observable();
		this.selectedColor = null;
		this._init( 5 );
	}

	ColorScheme.prototype.getArray = function() {
		return this.colors().map(function( color ){
			return color.getArray();
		});
	};

	ColorScheme.prototype.select = function( selectedColor ) {
		var colors = this.colors();
		var i;

		for( i = 0; i < colors.length; i++ ) {
			colors[ i ].isSelected( colors[ i ] === selectedColor );
		}

		this.selectedColor = selectedColor;
		this.emit( 'selection-changed' );
	};

	ColorScheme.prototype.add = function() {
		this._addRandomColor();
		this._update();
	};

	ColorScheme.prototype.remove = function( color ) {
		var index = this.colors.indexOf( color );
		this.colors.splice( index , 1 );
		this._update();
		var nextColor = this.colors()[ Math.max( index - 1, 0 ) ];
		requestAnimationFrame( this.select.bind( this, nextColor ) );
	};

	ColorScheme.prototype._init = function( initialColorCount ) {
		for( var i = 0; i < initialColorCount; i++ ) {
			this._addRandomColor();
		}

		this.liWidth( ( 100 / initialColorCount ) + '%');
		this.select( this.colors()[ 1 ] );
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
		this.emit( 'update' );
	};

	return ColorScheme;
});