define(function( require ){
	
	function Scheme2d( settings ) {
		this._settings = settings;
		this._canvas = document.createElement( 'canvas' );
		this._canvas.width = this._settings.width;
		this._canvas.height = this._settings.height;
		this._settings.container.appendChild( this._canvas );
		this._ctx = this._canvas.getContext( '2d' );
		this._colorFieldCount = ( settings.width / settings.side ) * ( settings.height * settings.side ) * 2;
		this._triangleIndices = null;
		this._colorLength = 0;
		this._colorIndices = null;
	}

	Scheme2d.prototype.setColors = function( colors ) {
		var x, y, i = 0, s = this._settings.side;

		if( this._colorLength !== colors.length ) {
			this._createColorIndices( colors.length );
			this._createTriangleIndices( colors.length );
			this._colorLength = colors.length;
		}

		this._clear();

		for( x = 0; x < this._settings.width; x += this._settings.side )
		for( y = 0; y < this._settings.height; y += this._settings.side ) {

			this._ctx.fillStyle = this._getColor( colors, i );
			this._ctx.fillRect( x, y, 50, 50 );
			this._ctx.fillStyle = this._getColor( colors, i + 1 );
			this._ctx.beginPath();
			
			if( this._triangleIndices[ i ] ) {
				this._ctx.moveTo( x, y );
				this._ctx.lineTo( x + s, y );
				this._ctx.lineTo( x, y + s );
			} else {
				this._ctx.moveTo( x + s, y );
				this._ctx.lineTo( x, y );
				this._ctx.lineTo( x + s, y + s );
			}
			
			this._ctx.closePath();
			this._ctx.fill();

			i++;
		}
	};

	Scheme2d.prototype._getColor = function( colors, index ) {
		return 'rgb(' + colors[ this._colorIndices[ index ] ].join( ',' ) + ')';
	};

	Scheme2d.prototype._createTriangleIndices = function( colorsLength ) {
		this._triangleIndices = [];

		for( var i = 0; i < this._colorFieldCount / 2; i++ ) {
			this._triangleIndices.push( Math.random() > 0.5 );
		}
	};

	Scheme2d.prototype._createColorIndices = function( colorsLength ) {
		this._colorIndices = [];
		console.log( 'CREATE' );

		for( var i = 0; i < this._colorFieldCount; i++ ) {
			this._colorIndices.push( Math.floor( Math.random() * colorsLength ) );
		}
	};

	Scheme2d.prototype._clear = function() {
		this._ctx.clearRect( 0, 0, this._settings.width, this._settings.height );
	};

	return Scheme2d;
});