define(function( require ){


	var Stage = require( '../objects/stage' );
	var data = require( '../data/graffiti-geometries' );

	function Scheme3D( settings ) {
		this._settings = settings;
		this._stage = new Stage( settings );
		this._loader = new THREE.JSONLoader();
		this._materials = [];
		this._createGeometries();
		this._stage.camera.position.x = 0.1;
		this._stage.camera.position.y = -0.05;
		this._stage.camera.position.z = 0.23;

		this._stage.camera.rotation.z = 0.1;

		//var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		//directionalLight.position.set( 0, 1, 0 );

		this._stage.add(  new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );
		this._setColors();
	}

	Scheme3D.prototype._createGeometries = function() {
		var material, geometry, i;

		for( i = 0; i < data.length; i++ ) {
			this._materials[ i ] = new THREE.MeshPhongMaterial( { color: 0xffffff } );
			geometry = this._loader.parse( data[ i ] ).geometry;
			this._stage.add( new THREE.Mesh( geometry, this._materials[ i ] ) );
		}
	};

	Scheme3D.prototype._setColors = function() {
		var c = function() { return Math.floor( Math.random() * 256 ); };
		for( var i = 0; i < this._materials.length; i++ ){
			this._materials[ i ].color.setRGB( Math.random(), Math.random(), Math.random() );
			this._materials[ i ].needsUpdate =true;
		}
	};

	return Scheme3D;
});