define(function( require ){
	var ko = require( 'ko' );
	var ColorScheme = require( './color-scheme' );
	var ColorCone = require( '../visualisations/color-cone' );
	var RgbCube = require( '../visualisations/rgb-cube' );
	var Scheme3D = require( '../visualisations/scheme-3d' );
	var Scheme2D = require( '../visualisations/scheme-2d' );
	var SliderBackgrounds = require( '../visualisations/slider-backgrounds' );
	var tinycolor = require( 'tinycolor' );
	
	function Main() {
		this.color = null;
		this._isUpdating = false;

		this.aboutVisible = ko.observable( false );

		this.currentVis = ko.observable( '3d' );
		this.currentVis.subscribe( this._applyScheme.bind( this ) );

		this.hsvHue = this._getObservable( 'hsv' );
		this.hsvSaturation = this._getObservable( 'hsv' );
		this.hsvValue = this._getObservable( 'hsv' );

		this.hslHue = this._getObservable( 'hsl' );
		this.hslSaturation = this._getObservable( 'hsl' );
		this.hslLightness = this._getObservable( 'hsl' );

		this.rgbRed = this._getObservable( 'rgb' );
		this.rgbGreen = this._getObservable( 'rgb' );
		this.rgbBlue = this._getObservable( 'rgb' );
		
		this.colorScheme = new ColorScheme();
		this.colorScheme.on( 'selection-changed', this._update.bind( this, 'selection' ) );
		this.colorScheme.on( 'update', this._applyScheme.bind( this ) );
		this.colorScheme.on( 'highlight', this._setHighlight.bind( this ) );

		this.sliderBackgrounds = null;

		this.hexValue = this._getObservable( 'hex' );

		this._hsvCone = this._getColorCone( 'HSV' );
		this._hslCone = this._getColorCone( 'HSL' );
		this._rgbCube = this._getRgbCube();

		this._schemeVisualisations = {
			'3d': this._getScheme3D(),
			'2d': this._getScheme2D(),
			'1d': this._getScheme1D()
		};

		setTimeout( this._init.bind( this ), 10 );
	}

	Main.prototype._init = function() {
		this.sliderBackgrounds = new SliderBackgrounds();
		this._update( 'selection' );
		this._applyScheme();
		setTimeout( this._loadFinished.bind( this ), 100 );
	};

	Main.prototype._loadFinished = function() {
		document.body.classList.remove( 'loading' );
	};

	Main.prototype._getCurrentVis = function() {
		return this._schemeVisualisations[ this.currentVis() ];
	};
	
	Main.prototype._getRgbCube = function() {
		var rgbCube = new RgbCube({
			container:  document.querySelector( '.rgb .example' ),
			width: 300,
			height: 300,
			pointSize: 0.08,
			side: 2.5,
			pointsPerSide: 20
		});

		rgbCube.colorIndicatorCollection.setColorScheme( this.colorScheme );

		return rgbCube;
	};

	Main.prototype._getScheme3D = function() {
		return new Scheme3D({
			container:  document.querySelector( '.schemes .scheme_3d' ),
			width: 1000,
			height: 400,
		});
	};

	Main.prototype._getScheme2D = function() {
		return new Scheme2D({
			container:  document.querySelector( '.schemes .scheme_2d' ),
			width: 700,
			height: 250,
			side: 50,
			is2d: true
		});
	};

	Main.prototype._getScheme1D = function() {
		return new Scheme2D({
			container:  document.querySelector( '.schemes .scheme_1d' ),
			width: 700,
			height: 250,
			is2d: false
		});
	};


	Main.prototype._getColorCone = function( colorSpace ) {
		var colorCone = new ColorCone({
			container:  document.querySelector( '.' + colorSpace.toLowerCase() + ' .example' ),
			width: 300,
			height: 300,
			pointSize: 0.08,
			radius: 3,
			coneHeight: 4,
			rings: 50,
			pointDensity: 30,
			innerRingDensity: 12,
			gapStart: Math.PI * 0,
			gapEnd: Math.PI * 0.25,
			colorSpace: colorSpace
		});

		colorCone.colorIndicatorCollection.setColorScheme( this.colorScheme );

		return colorCone;
	};

	Main.prototype._applyScheme = function() {
		this._getCurrentVis().setColors( this.colorScheme.getArray() );
	};

	Main.prototype._setHighlight = function( index, isHighlighted ) {
		this._getCurrentVis().highlightColor( index, isHighlighted );
	};

	Main.prototype._getObservable = function( changeSource ) {
		var observable = ko.observable();
		observable.subscribe( this._update.bind( this, changeSource ) );
		return observable;
	};

	Main.prototype._update = function( changeSource ) {
		if( this._isUpdating === true ) {
			return;
		}

		this._isUpdating = true;
		if( changeSource === 'selection' ) {
			this.color = this.colorScheme.selectedColor.color;
		}
		else if( changeSource === 'hsv' ) {
			this.color = tinycolor({
				h: this.hsvHue(),
				s: this.hsvSaturation() / 100,
				v: this.hsvValue() / 100
			});
		}
		else if( changeSource === 'hsl' ) {
			this.color = tinycolor({
				h: this.hslHue(),
				s: this.hslSaturation() / 100,
				l: this.hslLightness() / 100
			});
		}
		else if( changeSource === 'rgb' ) {
			this.color = tinycolor({
				r: this.rgbRed(),
				g: this.rgbGreen(),
				b: this.rgbBlue()
			});
		} else if( changeSource === 'hex' ) {
			this.color = tinycolor( this.hexValue() );
		}

		var hsv = this.color.toHsv();
		this._hsvCone.setColor( hsv );
		this.hsvHue( parseFloat( hsv.h.toFixed( 2 ) ) );
		this.hsvSaturation( this._format( hsv.s ) );
		this.hsvValue( this._format( hsv.v ) );

		var hsl = this.color.toHsl();
		this._hslCone.setColor( hsl );
		this.hslHue( parseFloat( hsl.h.toFixed( 2 ) ) );
		this.hslSaturation( this._format( hsl.s ) );
		this.hslLightness( this._format( hsl.l ) );

		var rgb = this.color.toRgb();
		this._rgbCube.setColor( rgb );
		this.rgbRed( rgb.r );
		this.rgbGreen( rgb.g );
		this.rgbBlue( rgb.b );

		this.hexValue( this.color.toHexString() );

		this.sliderBackgrounds.setColor( this.color );

		if( changeSource !== 'selection' ) {
			this.colorScheme.selectedColor.set( this.color );
		}

		this._isUpdating = false;
	};

	Main.prototype._format = function( input ) {
		return parseFloat( ( input * 100 ).toFixed( 2 ) );
	};

	return Main;
});