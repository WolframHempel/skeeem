define(function( require ){
	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );
	var PI = Math.PI;

	function ColorCone( settings ) {
		this._settings = settings;
		this._relativeCoords = [];
		this._isHsv = this._settings.colorSpace === 'HSV';
		this._stage = new Stage( settings );
		this._stage.on( 'update', this._update, this );
		this._geometry = this._createGeometry();
		this._stage.setCameraPosition( PI, PI, 5 );
		this._material = new THREE.PointsMaterial({ size: this._settings.pointSize, vertexColors: THREE.VertexColors });
		this._points = new THREE.Points( this._geometry, this._material );
		this._stage.add( this._points );
		this._stage.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
		this._spotLight = new THREE.SpotLight( 0xffffff);
		this._spotLight.position.set( 0, 0, 3 );
		this._stage.add( this._spotLight );
		this._addLines();
		this._activeColorIndicator = document.createElement( 'div' );
		this._activeColorIndicator.className = 'active-color-indicator';
		this._settings.container.appendChild( this._activeColorIndicator );
		
	}

	ColorCone.prototype.setColor = function( colorMap ) {
		var i, c, f, y, r, hue, indicatorPosition, hueOffset = ( colorMap.h / 360 ) * PI * 2;

		for( i = 0; i < this._relativeCoords.length; i++ ) {

			c = this._relativeCoords[ i ];			

			if( ( c[ 2 ] + hueOffset ) > 2 * PI ) {
				hue = ( c[ 2 ] + hueOffset ) - 2 * PI;
			} else {
				hue = c[ 2 ] + hueOffset;
			}

			if( c[ 0 ] > ( this._isHsv ? colorMap.v : colorMap.l ) && c[ 2 ] > Math.PI * 1.5 ) {
				this._geometry.vertices[ i ].z = 999;
			} else {
				this._geometry.vertices[ i ].z = this._geometry.vertices[ i ].origZ;
			}

			this._geometry.colors[ i ] = this._getColor( c[ 0 ], c[ 1 ], hue );
		}
		this._geometry.verticesNeedUpdate = true;
		this._geometry.colorsNeedUpdate = true;
		
		f = colorMap.v || colorMap.l;
		y = ( this._settings.coneHeight * f ) - ( this._settings.coneHeight / 2 );
		r = this._getRadius( f ) * colorMap.s;
		indicatorPosition = this._stage.toScreenCoords( new THREE.Vector3( 0, y, r ) );

		this._activeColorIndicator.style.left = indicatorPosition.x + 'px';
		this._activeColorIndicator.style.top = indicatorPosition.y + 'px';

		
	};

	ColorCone.prototype._addLines = function() {
		var geometry =  new THREE.Geometry();
		var y1 = this._settings.coneHeight * -0.5;
		var y2 = this._settings.coneHeight * 0.5;
		var xStart = this._settings.radius * Math.sin( this._settings.gapStart );
		var yStart = this._settings.radius * Math.cos( this._settings.gapStart );
		var xEnd = this._settings.radius * Math.sin( this._settings.gapEnd );
		var yEnd = this._settings.radius * Math.cos( this._settings.gapEnd );
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		var yBase = this._isHsv ? y2: 0;
		var a;
		
		material.opacity = 0.4;
		material.transparent = true;

		for( a = this._settings.gapEnd; a < this._settings.gapStart + 2 * PI; a += 0.1 ) {
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
		var vertex;
		var ring;
		var f, r, x, y, z, alpha;
		var geometry = new THREE.Geometry();

		for( ring = 0; ring <= rings; ring++ ) {
			f = ring / rings;
			y = ( height * f ) - ( height / 2 );
			rOuter = this._getRadius( f );
			
			
			for( r = rOuter; r > 0; r -= radiusTop / innerRingDensity ) {
				for( alpha = 0; alpha < PI * 2; alpha += ( PI * 2 ) / ( r * pointDensity ) ) {
					if( alpha < alphaGapStart || alpha > alphaGapEnd ) {
						x = Math.sin( alpha ) * r;
						z = Math.cos( alpha ) * r;
						vertex = new THREE.Vector3( x, y, z );
						vertex.origZ = z;
						geometry.vertices.push( vertex );
						this._relativeCoords.push([ f, r / rOuter, alpha ]);
						geometry.colors.push( this._getColor( f, r / radiusTop, alpha ) );
					}
				}
			}
		}

		return geometry;
	};

	ColorCone.prototype._getRadius = function( f ) {
		if( this._isHsv ) {
			// Cone
			return this._settings.radius * f;
		} else {
			// BiCone
			return this._settings.radius * ( 1 - Math.abs( 1 - ( f * 2 ) ) );
		}
	};

	ColorCone.prototype._getColor = function( relativeHeight, relativeRadius, alpha ) {
		var deg = ( alpha / ( PI * 2 ) * 360 );
		var rgb;
		var colorMap = { h: deg, s: 100 * relativeRadius };

		if( this._isHsv ) {
			colorMap.v = relativeHeight * 100;
		} else {
			colorMap.l = relativeHeight * 100;
		}

		rgb = tinycolor( colorMap ).toRgb();
		return new THREE.Color( rgb.r / 255, rgb.g / 255, rgb.b / 255 );
	};

	ColorCone.prototype._update = function() {

	};

	return ColorCone;
});