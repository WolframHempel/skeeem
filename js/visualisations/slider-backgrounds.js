define(function( require ){

	var tinyColor = require( 'tinycolor' );
	var WIDTH = 200;

	function SliderBackgrounds() {
		this._hueCanvas = document.getCSSCanvasContext( '2d', 'hue', WIDTH, 2 );
		this._hsvSaturationCanvas = document.getCSSCanvasContext( '2d', 'hsv-saturation', WIDTH, 2 );
		this._hsvValueCanvas = document.getCSSCanvasContext( '2d', 'hsv-value', WIDTH, 2 );
		this._hslSaturationCanvas = document.getCSSCanvasContext( '2d', 'hsl-saturation', WIDTH, 2 );
		this._hslLightnessCanvas = document.getCSSCanvasContext( '2d', 'hsl-lightness', WIDTH, 2 );
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

		this._applyGradient( this._hueCanvas, colors );
	};

	return SliderBackgrounds;
});