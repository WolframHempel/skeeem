define(function( require ){
	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );
	var PI = Math.PI;

	function RgbCube( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._geometry = this._createGeometry();
		this._stage.setCameraPosition( PI, PI, 5 );
		this._material = new THREE.PointsMaterial({ size: this._settings.pointSize, vertexColors: THREE.VertexColors });
		this._points = new THREE.Points( this._geometry, this._material );
		this._stage.add( this._points );
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
		var i, v;

		for( i = 0; i < this._geometry.vertices.length; i++ ) {
			v = this._geometry.vertices[ i ];
			if( v.x < cX || v.y < cY || v.origZ < cZ ) {
				this._geometry.vertices[ i ].z = this._geometry.vertices[ i ].origZ;
			} else {
				this._geometry.vertices[ i ].z = 999;
			}
		}
		
		var indicatorPosition = this._stage.toScreenCoords( new THREE.Vector3( cX, cY, cZ ) );

		this._activeColorIndicator.style.left = indicatorPosition.x + 'px';
		this._activeColorIndicator.style.top = indicatorPosition.y + 'px';

		this._geometry.verticesNeedUpdate = true;
	};


	RgbCube.prototype._addLines = function() {
		var geometry;
		var s = this._settings.side;
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		material.opacity = 0.4;
		material.transparent = true;

		geometry =  new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, 0, s ) );
		geometry.vertices.push( new THREE.Vector3( 0, s, s ) );
		geometry.vertices.push( new THREE.Vector3( 0, s, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		this._stage.add( new THREE.Line( geometry, material ) );

		geometry =  new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( s, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( s, 0, s ) );
		geometry.vertices.push( new THREE.Vector3( s, s, s ) );
		geometry.vertices.push( new THREE.Vector3( s, s, 0 ) );
		geometry.vertices.push( new THREE.Vector3( s, 0, 0 ) );
		this._stage.add( new THREE.Line( geometry, material ) );

		geometry =  new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( s, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		this._stage.add( new THREE.Line( geometry, material ) );

		geometry =  new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 0, 0, s ) );
		geometry.vertices.push( new THREE.Vector3( s, 0, s ) );
		this._stage.add( new THREE.Line( geometry, material ) );

		geometry =  new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 0, s, s ) );
		geometry.vertices.push( new THREE.Vector3( s, s, s ) );
		this._stage.add( new THREE.Line( geometry, material ) );

		geometry =  new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3( 0, s, 0 ) );
		geometry.vertices.push( new THREE.Vector3( s, s, 0 ) );
		this._stage.add( new THREE.Line( geometry, material ) );
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