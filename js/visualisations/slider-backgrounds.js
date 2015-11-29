define(function( require ){

	var tinyColor = require( 'tinycolor' );
	var WIDTH = 200;

	function SliderBackgrounds() {
		this._hsvHueCanvas = this._getCanvas( 'hsv-hue' );
		this._hslHueCanvas = this._getCanvas( 'hsl-hue' );
		this._hsvSaturationCanvas = this._getCanvas( 'hsv-saturation' );
		this._hsvValueCanvas = this._getCanvas( 'hsv-value' );
		this._hslSaturationCanvas = this._getCanvas( 'hsl-saturation' );
		this._hslLightnessCanvas = this._getCanvas( 'hsl-lightness' );
		this._imageData = this._hsvSaturationCanvas.getImageData( 0, 0, WIDTH, 2 );
		this._initHueCanvas();
	}

	SliderBackgrounds.prototype.setColor = function( color ) {
		var hsvSaturationColors = [];
		var hsvValueColors = [];
		var hslSaturationColors = [];
		var hslLightnessColors = [];
		var x, f;
		var hsv = color.toHsv();
		var hsl = color.toHsl();

		for( x = 0; x < WIDTH; x++ ) {
			f = x / WIDTH;
			hsvSaturationColors.push( tinyColor({ h: hsv.h, s: f, v: hsv.v }).toRgb() );
			hsvValueColors.push( tinyColor({ h: hsv.h, s: hsv.s, v: f }).toRgb() );
			hslSaturationColors.push( tinyColor({ h: hsl.h, s: f, l: hsl.l }).toRgb() );
			hslLightnessColors.push( tinyColor({ h: hsl.h, s: hsl.s, l: f }).toRgb() );
		}

		this._applyGradient( this._hsvSaturationCanvas, hsvSaturationColors );
		this._applyGradient( this._hslSaturationCanvas, hslSaturationColors );
		this._applyGradient( this._hsvValueCanvas, hsvValueColors );
		this._applyGradient( this._hslLightnessCanvas, hslLightnessColors );
	};

	SliderBackgrounds.prototype._getCanvas = function( className ) {
		var canvas = document.createElement( 'canvas' );
		canvas.width = WIDTH;
		canvas.height = 2;
		document.querySelector( '.' + className + ' .slider-bg' ).appendChild( canvas );
		return canvas.getContext( '2d' );
	};

	SliderBackgrounds.prototype._applyGradient = function( canvas, data ) {
		for( x = 0; x < WIDTH; x++ ) {
			rgb = data[ x ];
			this._imageData.data[ (x * 4) ] = rgb.r;
			this._imageData.data[ (x * 4) + 1 ] = rgb.g;
			this._imageData.data[ (x * 4) + 2 ] = rgb.b;
			this._imageData.data[ (x * 4) + 3 ] = 255;
			this._imageData.data[ (x * 4) ] = rgb.r;
			this._imageData.data[ (x * 4) + 1 + WIDTH * 4 ] = rgb.g;
			this._imageData.data[ (x * 4) + 2 + WIDTH * 4 ] = rgb.b;
			this._imageData.data[ (x * 4) + 3 + WIDTH * 4 ] = 255;
		}

		canvas.putImageData( this._imageData, 0, 0 );
	};

	SliderBackgrounds.prototype._initHueCanvas = function() {
		var x, colors = [];

		for( x = 0; x < WIDTH; x++ ) {
			colors.push( tinyColor({ h: ( x / WIDTH ) * 360, s: 1, v: 1 }).toRgb() );
		}

		this._applyGradient( this._hslHueCanvas, colors );
		this._applyGradient( this._hsvHueCanvas, colors );
	};

	return SliderBackgrounds;
});