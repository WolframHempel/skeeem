define(function( require ){
	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );

	function HsvCone( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._stage.on( 'update', this._update, this );
		this._textureCanvas = document.createElement( 'canvas' );
		this._textureCanvas.width = 300;
		this._textureCanvas.height = 300;
		this._ctx = this._textureCanvas.getContext( '2d' );
		document.body.appendChild( this._textureCanvas );


		this._geometry = new THREE.CylinderGeometry( 2, 0, 3, 120, 10, false, 0.15 * Math.PI,  1.75 * Math.PI );
		this._material = new THREE.MeshLambertMaterial( { 
			//color: 0x00ff00,
			map: this._createTextures(),
			wireframe: false 
		} );
		this._mesh = new THREE.Mesh( this._geometry, this._material );
		this._stage.add( this._mesh );
		this._stage.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
		this._spotLight = new THREE.SpotLight( 0xffffff);
		this._spotLight.position.set( 0, 0, 3 );
		this._stage.add( this._spotLight );
	}

	HsvCone.prototype._createTextures = function() {
		var imageData = this._ctx.getImageData( 0, 0, this._settings.width, this._settings.height );
		var i, x, y, l, a2, b2, alpha, rgb, maxX, minX, maxY, minY,
			cx = this._settings.width / 2,
			cy = this._settings.height / 2,
			r = cx;
		//Uint8ClampedArray
		for( i = 0; i < imageData.data.length; i += 4 ) {
			x = ( i / 4 ) % imageData.width;
			y = Math.floor( (i / 4) / imageData.width );
			maxX = Math.max( x, cx );
			maxY =  Math.max( y, cy );
			minX = Math.min( x, cx );
			minY = Math.min( y, cy );
			a2 = Math.pow( cx - x, 2 );
			b2 = Math.pow( cy - y, 2 );
			l = Math.sqrt( a2 + b2 );
			alpha = Math.atan2(cy - y, cx - x) * 180 / Math.PI;
			rgb = tinycolor({ h: alpha + 180, s: 100 * ( l / r ), v: 100 }).toRgb();

			if( true /*l <= r*/ ) {
				imageData.data[ i ] = rgb.r;
				imageData.data[ i + 1 ] = rgb.g;
				imageData.data[ i + 2 ] = rgb.b;
				imageData.data[ i + 3 ] = 255;
			}
			
		}

		this._ctx.putImageData( imageData, 0, 0 );

		var texture = new THREE.Texture( this._textureCanvas );
		texture.mapping = THREE.SphericalReflectionMapping;
		texture.needsUpdate  = true;

		return texture;
	};

	HsvCone.prototype._update = function() {
		// this._pointlight.position.z += 0.1;
		// this._pointlight.position.y -= 0.1;
		// this._mesh.rotation.y += 0.01;
		// this._mesh.rotation.y += 0.01;
	};

	return HsvCone;
});