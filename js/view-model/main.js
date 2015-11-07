define(function( require ){
	var ko = require( 'ko' );
	var ColorCone = require( '../visualisations/color-cone' );
	var tinycolor = require( 'tinycolor' );
	
	function Main() {
		this.color = null;
		this._isUpdating = false;

		this.hsvHue = this._getObservable( 'hsv' );
		this.hsvSaturation = this._getObservable( 'hsv' );
		this.hsvValue = this._getObservable( 'hsv' );

		this.hslHue = this._getObservable( 'hsl' );
		this.hslSaturation = this._getObservable( 'hsl' );
		this.hslLightness = this._getObservable( 'hsl' );

		this.hexValue = this._getObservable( 'hex' );

		this._hsvCone = this._getColorCone( 'HSV' );
		this._update( 'initial' );
	}

	Main.prototype._getColorCone = function( colorSpace ) {
		return new ColorCone({
			container:  document.querySelector( '.' + colorSpace.toLowerCase() + ' .example' ),
			width: 300,
			height: 300,
			pointSize: 0.08,
			radius: 3,
			coneHeight: 4,
			rings: 30,
			pointDensity: 30,
			innerRingDensity: 10,
			gapStart: Math.PI * 1.75,
			gapEnd: Math.PI * 2,
			colorSpace: colorSpace
		});
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
		if( changeSource === 'initial' ) {
			this.color = tinycolor({ r: 66, g: 33, b: 99 });
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

		var hsv = this.color.toHsv();
		this.hsvHue( parseFloat( hsv.h.toFixed( 2 ) ) );
		this.hsvSaturation( this._format( hsv.s ) );
		this.hsvValue( this._format( hsv.v ) );

		var hsl = this.color.toHsl();
		this.hslHue( parseFloat( hsl.h.toFixed( 2 ) ) );
		this.hslSaturation( this._format( hsl.s ) );
		this.hslLightness( this._format( hsl.l ) );

		this.hexValue( this.color.toHexString() );

		this._isUpdating = false;
	};

	Main.prototype._format = function( input ) {
		return parseFloat( ( input * 100 ).toFixed( 2 ) );
	};

	return Main;
});