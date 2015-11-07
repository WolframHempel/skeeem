define(function( require ){
	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );

	function ColorCone( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._stage.on( 'update', this._update, this );
		this._textureCanvas = document.createElement( 'canvas' );
		this._textureCanvas.width = settings.width;
		this._textureCanvas.height = settings.height;
		this._ctx = this._textureCanvas.getContext( '2d' );
		document.body.appendChild( this._textureCanvas );
		//this._texture = this._createTextures();


		//this._geometry = new THREE.CylinderGeometry( 2, 0, 3, 120, 10, false, 0.15 * Math.PI,  1.75 * Math.PI );
		this._geometry = this._createGeometry();
		// this._material = new THREE.MeshLambertMaterial( { 
		// 	//color: 0x00ff00,
		// 	map: this._texture,
		// 	wireframe: false 
		// } );
		this._material = new THREE.PointsMaterial( { 
			size: this._settings.pointSize,
			vertexColors: THREE.VertexColors,
			//map: this._texture,
			//wireframe: false 
		} );
		//this._mesh = new THREE.Mesh( this._geometry, this._material );
		this._points = new THREE.Points( this._geometry, this._material );

		this._stage.add( this._points );
		this._stage.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
		this._spotLight = new THREE.SpotLight( 0xffffff);
		this._spotLight.position.set( 0, 0, 3 );
		this._stage.add( this._spotLight );
		this._addLines();
	}

	ColorCone.prototype._addLines = function() {
		var geometry =  new THREE.Geometry();
		var y1 = this._settings.coneHeight * -0.5;
		var y2 = this._settings.coneHeight * 0.5;
		var xStart = this._settings.radius * Math.sin( this._settings.gapStart );
		var yStart = this._settings.radius * Math.cos( this._settings.gapStart );
		var xEnd = this._settings.radius * Math.sin( this._settings.gapEnd );
		var yEnd = this._settings.radius * Math.cos( this._settings.gapEnd );
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		var yBase = this._settings.colorSpace === 'HSV' ? y2: 0;
		material.opacity = 0.3;
		material.transparent = true;

		for( var a = this._settings.gapEnd; a < this._settings.gapStart + 2 * Math.PI; a += 0.1 ) {
			geometry.vertices.push( new THREE.Vector3( 
				this._settings.radius * Math.sin( a ), 
				yBase,
				this._settings.radius * Math.cos( a ) 
			));
		}

		geometry.vertices.push( new THREE.Vector3( xStart, yBase, yStart ) );
		geometry.vertices.push( new THREE.Vector3( 0, y1, 0 ) );
		geometry.vertices.push( new THREE.Vector3( xEnd, yBase, yEnd ) );
		geometry.vertices.push( new THREE.Vector3( 0, y2, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, y1, 0 ) );
		geometry.vertices.push( new THREE.Vector3( xStart, yBase, yStart ) );
		geometry.vertices.push( new THREE.Vector3( 0, y2, 0 ) );

		this._stage.add( new THREE.Line( geometry, material ) );
	};

	ColorCone.prototype._createGeometry = function() {
		var radiusTop = this._settings.radius;
		var height = this._settings.coneHeight;
		var rings = this._settings.rings;
		var pointDensity = this._settings.pointDensity;
		var innerRingDensity = this._settings.innerRingDensity;
		var alphaGapStart = this._settings.gapStart;
		var alphaGapEnd = this._settings.gapEnd;
		var rOuter;
		var ring;
		var f, r, x, y, z, alpha;
		var geometry = new THREE.Geometry();

		for( ring = 0; ring <= rings; ring++ ) {
			f = ring / rings;
			y = ( height * f ) - ( height / 2 );
			if( this._settings.colorSpace === 'HSV' ) {
				// Cone
				rOuter = radiusTop * f;
			} else {
				// BiCone
				rOuter = radiusTop * ( 1 - Math.abs( 1 - ( f * 2 ) ) );
			}
			
			for( r = rOuter; r > 0; r -= radiusTop / innerRingDensity ) {
				for( alpha = 0; alpha < Math.PI * 2; alpha += ( Math.PI * 2 ) / ( r * pointDensity ) ) {
					if( alpha < alphaGapStart || alpha > alphaGapEnd ) {
						x = Math.sin( alpha ) * r;
						z = Math.cos( alpha ) * r;
						geometry.vertices.push( new THREE.Vector3( x, y, z ) );
						geometry.colors.push( this._getColor( f, r / radiusTop, alpha ) );
					}
				}
			}
		}

		return geometry;
	};

	ColorCone.prototype._getColor = function( relativeHeight, relativeRadius, alpha ) {
		var deg = ( alpha / ( Math.PI * 2 ) * 360 );
		var rgb;

		if( this._settings.colorSpace === 'HSV' ) {
			rgb = tinycolor({ h: deg, s: 100 * relativeRadius, v: relativeHeight * 100 }).toRgb();
		}
		else {
			rgb = tinycolor({ h: deg, s: 100 * relativeRadius, l: relativeHeight * 100 }).toRgb();
		}

		return new THREE.Color( rgb.r / 255, rgb.g / 255, rgb.b / 255 );
	};

	ColorCone.prototype._createTextures = function() {
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
		texture.offset.x = 0.5;
		texture.offset.y = 0.5;xxx = this;
		//texture.repeat = new THREE.Vector2( 0, 1 );
		texture.needsUpdate  = true;

		return texture;
	};

	ColorCone.prototype._update = function() {
		//this._texture.offset.x += 0.01;
		// if( this._texture.offset.x > 1 ) {
		// 	this._texture.offset.x = 0;
		// }
		//this._texture.needsUpdate = true;
		// this._pointlight.position.z += 0.1;
		// this._pointlight.position.y -= 0.1;
		// this._mesh.rotation.y += 0.01;
		// this._mesh.rotation.y += 0.01;
	};

	return ColorCone;
});