define(function( require ){
	var three = require( 'three' );
	var Emitter = require( 'emitter' );

	function Stage( settings ) {
		Emitter.call( this );
		this.settings = settings;
		
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, this.settings.width / this.settings.height, 0.1, 1000 );
		this.camera.position.z = 5;
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		this.renderer.domElement.onmousemove = this._setMouseCoords.bind( this );
		this.renderer.setSize( this.settings.width, this.settings.height );
		this.settings.container.appendChild( this.renderer.domElement );
		this.render();		
	}

	Stage.prototype.toScreenCoords = function ( position, camera, jqdiv ) {

		var pos = position.clone();
		projScreenMatrix = new THREE.Matrix4();
		projScreenMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
		pos.applyProjection( projScreenMatrix );
		return { 
			x: ( pos.x + 1 ) * this.settings.width / 2,
			y: ( - pos.y + 1) * this.settings.height / 2
		};

	};

	Stage.prototype.add = function( object ) {
		this.scene.add( object );
	};

	Stage.prototype.render = function() {
		this.emit( 'update' );
		this.renderer.render( this.scene, this.camera );
		requestAnimationFrame( this.render.bind( this ) );
	};

	Stage.prototype._setMouseCoords = function( event ) {
		// this.camera.position.x = -3 + ( 6 * ( event.layerX / this.settings.width ) );
		// this.camera.position.y = 3 - ( 6 * ( event.layerY / this.settings.height ) );
		// this.camera.lookAt(  new THREE.Vector3( 0, 0, 0 ) );
	};

	return Stage;
});