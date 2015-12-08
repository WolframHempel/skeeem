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
		this._hexCodeRegExp = /^\#[0-9A-F]{6}$/;
		this._hashUpdateTimeout = null;
		this._init( 5 );
	}

	ColorScheme.prototype.updateHash = function() {
		if( this._hashUpdateTimeout === null ) {
			this._hashUpdateTimeout = setTimeout( this.updateHash.bind( this ), 50 );
			return;
		}

		this._hashUpdateTimeout = null;
		document.location.hash = this.colors().map(function( color ){
			return color.getHex();
		}).join( ',' );
	};

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

	ColorScheme.prototype.highlight = function( highlightedColor ) {
		var index = this.colors.indexOf( highlightedColor );
		var isHighlighted = highlightedColor.isHighlighted();

		this.emit( 'highlight', index, isHighlighted );
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
		var colorsFromHash = this._getColorsFromHash();
		var i;

		if( colorsFromHash ) {
			for( i = 0; i < colorsFromHash.length; i++ ) {
				this._addColor( tinycolor( colorsFromHash[ i ] ) );
			}
		} else {
			for( i = 0; i < initialColorCount; i++ ) {
				this._addRandomColor();
			}
		}

		this.liWidth( ( 100 / this.colors().length ) + '%');
		this.select( this.colors()[ 1 ] );
	};

	ColorScheme.prototype._getColorsFromHash = function() {
		if( !document.location.hash ) {
			return null;
		}

		var colors = document.location.hash.split( ',' );

		for( var i = 0; i < colors.length; i++ ) {
			if( !this._hexCodeRegExp.test( colors[ i ] ) ) {
				return null;
			}
		}

		return colors;
	};

	ColorScheme.prototype._randomInt = function() {
		return Math.floor( Math.random() * 255 );
	};

	ColorScheme.prototype._addRandomColor = function() {
		this._addColor(tinycolor({ 
			r: this._randomInt(),
			g: this._randomInt(),
			b: this._randomInt(),
		}));
	};

	ColorScheme.prototype._addColor = function( tinyColorInstance ) {
		var color = new Color( this );
		color.set( tinyColorInstance );
		this.colors.push( color );
	};

	ColorScheme.prototype._update = function() {
		this.liWidth( ( 100 / this.colors().length ) + '%');
		this.emit( 'update' );
		this.updateHash();
	};

	return ColorScheme;
});