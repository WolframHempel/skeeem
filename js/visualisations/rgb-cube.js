define(function( require ){
	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );
	var getLine = require( '../utils/line-segment-factory' );
	var PI = Math.PI;

	function RgbCube( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._geometry = this._createGeometry();
		this._stage.setCameraPosition( PI, PI, 5 );
		this._material = new THREE.PointsMaterial({ size: this._settings.pointSize, vertexColors: THREE.VertexColors });
		this._points = new THREE.Points( this._geometry, this._material );
		this._stage.add( this._points );
		this._lineVertices = {};
		this._lineGeometry = null;
		//this._stage.add( new THREE.Mesh( this._createGeometry(), new THREE.MeshLambertMaterial({ wireframe: true })));
		this._stage.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
		this._spotLight = new THREE.SpotLight( 0xffffff);
		this._spotLight.position.set( 0, 0, 3 );
		this._stage.add( this._spotLight );
		this._addLines();
		this._activeColorIndicator = document.createElement( 'div' );
		this._activeColorIndicator.className = 'active-color-indicator';
		this._settings.container.appendChild( this._activeColorIndicator );
	}

	RgbCube.prototype.setColor = function( rgb ) {
		var side =  this._settings.side;
		var cX = ( rgb.r / 255 ) * side;
		var cY = ( rgb.g / 255 ) * side;
		var cZ = ( rgb.b / 255 ) * side;
		var i, v, indicatorPosition;

		for( i = 0; i < this._geometry.vertices.length; i++ ) {
			v = this._geometry.vertices[ i ];
			if( v.x < cX || v.y < cY || v.origZ < cZ ) {
				this._geometry.vertices[ i ].z = this._geometry.vertices[ i ].origZ;
			} else {
				this._geometry.vertices[ i ].z = 999;
			}
		}
		this._lineVertices.t.fl.x = cX;
		this._lineVertices.t.fr.z = cZ;
		this._lineVertices.t.fc.x = cX;
		this._lineVertices.t.fc.z = cZ;


		this._lineVertices.c.b.x = cX;
		this._lineVertices.c.b.y = cY;
		this._lineVertices.c.b.z = cZ;

		
		this._lineVertices.c.r.y = cY;
		this._lineVertices.c.r.z = cZ;

		this._lineVertices.c.l.x = cX;
		this._lineVertices.c.l.y = cY;

		this._lineVertices.c.f.y = cY;

		indicatorPosition = this._stage.toScreenCoords( new THREE.Vector3( cX, cY, cZ ) );
		this._activeColorIndicator.style.left = indicatorPosition.x + 'px';
		this._activeColorIndicator.style.top = indicatorPosition.y + 'px';

		this._geometry.verticesNeedUpdate = true;
		this._lineGeometry.verticesNeedUpdate = true;
	};


	RgbCube.prototype._addLines = function() {
		var s =  this._settings.side;
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		var geometry =  new THREE.Geometry();
		
		material.opacity = 0.3;
		material.transparent = true;
	
		var v = { // vertices
			b: { // bottom
				b: new THREE.Vector3( 0, 0, 0 ), // back
				l: new THREE.Vector3( 0, 0, s ), // left
				r: new THREE.Vector3( s, 0, 0 ), // right
				f: new THREE.Vector3( s, 0, s ) // front
			},
			t: { // bottom
				b: new THREE.Vector3( 0, s, 0 ), // back
				l: new THREE.Vector3( 0, s, s ), // left
				r: new THREE.Vector3( s, s, 0 ), // right
				fl: new THREE.Vector3( s, s, s ), // front left
				fr: new THREE.Vector3( s, s, s ), // front right
				fc: new THREE.Vector3( s, s, s ), // front center
			},
			c: { // center
				b: new THREE.Vector3( s, s, s ), // center point
				r: new THREE.Vector3( s, s, 0 ), // center right
				l: new THREE.Vector3( 0, s, s ), // center left
				f: new THREE.Vector3( s, s, s ), // center front
			}
		};

		geometry.vertices = [
			//bottom square
			v.b.b, v.b.l,
			v.b.b, v.b.r,
			v.b.r, v.b.f,
			v.b.l, v.b.f,
			v.b.l, v.t.l,
			v.b.r, v.t.r,

			//top
			v.t.b, v.t.l,
			v.t.b, v.t.r,
			v.t.r, v.t.fr,
			v.t.l, v.t.fl,
			v.t.fl, v.t.fc,
			v.t.fr, v.t.fc,

			//center
			v.t.fc, v.c.b,
			v.c.b, v.c.r,
			v.c.b, v.c.l,
			v.c.r, v.t.fr,
			v.c.l, v.t.fl,
			v.c.l, v.c.f,
			v.c.r, v.c.f,
			v.c.f, v.b.f
		];

		this._lineVertices = v;
		this._lineGeometry = geometry;

		this._stage.add( new THREE.LineSegments( geometry, material ) );
	};

	RgbCube.prototype._createGeometry = function() {
		var geometry = new THREE.Geometry();
		var side = this._settings.side;
		var pointsPerSide = this._settings.pointsPerSide;
		var r, g, b, x, y, z, vector;

		for( x = 0; x < side; x += side / pointsPerSide )
		for( y = 0; y < side; y += side / pointsPerSide )
		for( z = 0; z < side; z += side / pointsPerSide ) {
			vector = new THREE.Vector3( x, y, z );
			vector.origZ = z;
			geometry.vertices.push( vector );
			geometry.colors.push( new THREE.Color( x / side, y / side, z / side ) );	
		}

		return geometry;
	};


	return RgbCube;
});