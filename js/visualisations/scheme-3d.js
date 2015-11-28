define(function( require ){


	var Stage = require( '../objects/stage' );
	var data = require( '../data/graffiti-geometries' );

	function Scheme3D( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._loader = new THREE.JSONLoader();
		this._materials = [];
		this._createGeometries();
		// this._stage.camera.position.x = 0.1;
		// this._stage.camera.position.y = -0.05;
		// this._stage.camera.position.z = 0.23;

		this._stage.setCameraPosition( 0.1, -0.05, 0.23, 0.1, false );
		this._stage.camera.rotation.z = 0.1;
		this._stage.updateCamera = false;

		//var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		//directionalLight.position.set( 0, 1, 0 );

		this._stage.add(  new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
	}

	Scheme3D.prototype.setColors = function( colors ) {
		var c, i;
		
		for( i = 0; i < this._materials.length; i++ ){
			c = colors[ i % colors.length ];
			this._materials[ i ].color.setRGB( c[ 0 ] / 255, c[ 1 ] / 255, c[ 2 ] / 255 );
			this._materials[ i ].needsUpdate =true;
		}
	};

	Scheme3D.prototype._createGeometries = function() {
		var material, geometry, i;

		for( i = 0; i < data.length; i++ ) {
			this._materials[ i ] = new THREE.MeshPhongMaterial( { color: 0xffffff } );
			geometry = this._loader.parse( data[ i ] ).geometry;
			this._stage.add( new THREE.Mesh( geometry, this._materials[ i ] ) );
		}
	};



	return Scheme3D;
});