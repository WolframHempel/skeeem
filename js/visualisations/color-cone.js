define(function( require ){
	'use strict';

	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );
	var PI = Math.PI;

	function ColorCone( settings ) {
		this._settings = settings;
		this._relativeCoords = [];
		this._isHsv = this._settings.colorSpace === 'HSV';
		this._vertices = null;
		this._stage = new Stage( settings );
		this._geometry = this._createGeometry();
		this._connectingLineGeometry = null;
		this._stage.setCameraPosition( PI, PI, 5, 0.5, true );
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
		var i, c, f, y, r, a, hue, indicatorPosition, hueOffset = ( colorMap.h / 360 ) * PI * 2;

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

		r = this._getRadius( f );
		
		for( i = 0; i < this._circleLine.vertices.length; i++ ) {
			a = ( ( i / this._circleLine.vertices.length ) * Math.PI * 0.5 ) + ( Math.PI * 1.5 );
			this._circleLine.vertices[ i ].x = r * Math.sin( a );
			this._circleLine.vertices[ i ].y = y;
			this._circleLine.vertices[ i ].z = r * Math.cos( a );
		}

		this._vertices.c.a.y = y;
		this._vertices.c.a.z = r;

		this._vertices.c.b.x = r * -1;
		this._vertices.c.b.y = y;

		this._vertices.c.c.y = y;

		this._circleLine.verticesNeedUpdate = true;
		this._connectingLineGeometry.verticesNeedUpdate = true;
	};

	ColorCone.prototype._addLines = function() {
		this._circleLine =  new THREE.Geometry();
		this._connectingLineGeometry = new THREE.Geometry();
		var radiusGeometry = new THREE.Geometry();
		
		var y1 = this._settings.coneHeight * -0.5;
		var y2 = this._settings.coneHeight * 0.5;
		
		var xA = this._settings.radius * Math.sin( this._settings.gapEnd );
		var yA = this._settings.radius * Math.cos( this._settings.gapEnd );

		var xB = this._settings.radius * -1;
		var yB = 0;
		
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		var yBase = this._isHsv ? y2: 0;
		var a, v;
		
		material.opacity = 0.3;
		material.transparent = true;

		for( a = this._settings.gapEnd; a < Math.PI * 1.5; a += 0.1 ) {
			this._circleLine.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			radiusGeometry.vertices.push( new THREE.Vector3( 
				this._settings.radius * Math.sin( a ), 
				yBase,
				this._settings.radius * Math.cos( a ) 
			));
		}

		v = {
			t: {
				a: new THREE.Vector3( xA, yBase, yA ),
				b: new THREE.Vector3( xB, yBase, yB ),
				c: new THREE.Vector3( 0, y2, 0 )
			},
			b: new THREE.Vector3( 0, y1, 0 ), // bottom point
			c: {
				a: new THREE.Vector3( 0, 0, 0 ),
				b: new THREE.Vector3( 0, 0, 0 ),
				c: new THREE.Vector3( 0, 0, 0 ),
			}
		};

		this._connectingLineGeometry.vertices = [
			//bottom triangle
			v.b, v.c.a,
			v.c.a, v.c.c,
			v.c.b, v.c.c,
			v.b, v.t.c,

			//top
			v.t.a, v.t.c,
			v.t.b, v.t.c,
			v.c.b, v.t.b,
			v.b, v.t.a
		];
		this._vertices = v;
		this._stage.add( new THREE.LineSegments( this._connectingLineGeometry, material ) );
		this._stage.add( new THREE.Line( this._circleLine, material ) );
		this._stage.add( new THREE.Line( radiusGeometry, material ) );
	};

	ColorCone.prototype._createGeometry = function() {
		var radiusTop = this._settings.radius;
		var height = this._settings.coneHeight;
		var rings = this._settings.rings;
		var pointDensity = this._settings.pointDensity;
		var innerRingDensity = this._settings.innerRingDensity;
		var alphaGapStart = this._settings.gapStart;
		var alphaGapEnd = this._settings.gapEnd;
		var geometry = new THREE.Geometry();
		var f, r, x, y, z, alpha, rOuter, vertex, ring;

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
			return this._settings.radius * f; // Cone
		} else {
			return this._settings.radius * ( 1 - Math.abs( 1 - ( f * 2 ) ) ); // BiCone
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

	return ColorCone;
});