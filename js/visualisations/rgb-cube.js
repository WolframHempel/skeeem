define(function( require ){
	var three = require( 'three' );
	var Stage = require( '../objects/stage' );
	var tinycolor = require( 'tinycolor' );
	var PI = Math.PI;

	function RgbCube( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._geometry = this._createGeometry();
		this._stage.camera.position.set( PI, PI, 5 );
		this._stage.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
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
			if( v.x > cX && v.y > cY && v.z > cZ ) {
				this._geometry.colors[ i ].opacity = 0;
			} else {
				this._geometry.colors[ i ].opacity = 1;
			}
		}
	};


	RgbCube.prototype._getMaterial = function() {
		//http://jsfiddle.net/8mrH7/195/
		var vertexShader = 'attribute float alpha;varying float vAlpha;void main() {vAlpha = alpha;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_PointSize = 8.0;gl_Position = projectionMatrix * mvPosition;}';
		var fragmentShader = 'uniform vec3 color;varying float vAlpha;void main() {gl_FragColor = vec4( color, vAlpha );}';

		
	};

	RgbCube.prototype._addLines = function() {

	};

	RgbCube.prototype._createGeometry = function() {
		var geometry = new THREE.Geometry();
		var side = this._settings.side;
		var pointsPerSide = this._settings.pointsPerSide;
		var r, g, b, x, y, z;

		for( x = 0; x < side; x += side / pointsPerSide )
		for( y = 0; y < side; y += side / pointsPerSide )
		for( z = 0; z < side; z += side / pointsPerSide ) {
			geometry.vertices.push( new THREE.Vector3( x, y, z ) );
			geometry.colors.push( new THREE.Color( x / side, y / side, z / side ) );	
		}

		return geometry;
	};


	return RgbCube;
});