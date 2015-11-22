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

		this._baseCameraPos = null;
		this._f = null;
		this._lookAtCenter = false;

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

	Stage.prototype.setCameraPosition = function( x, y, z, f, lookAtCenter ) {
		this._baseCameraPos = { x: x, y: y, z: z };

		this.camera.position.set( x, y, z );
		this._f = f;
		this._lookAtCenter = lookAtCenter;

		if( lookAtCenter ) {
			this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		}
	};

	Stage.prototype.add = function( object ) {
		this.scene.add( object );
	};

	Stage.prototype.render = function() {
		this.emit( 'update' );

		if( window.mousePosRelX !== undefined ) {
			this.camera.position.x = this._baseCameraPos.x + this._f * mousePosRelX;
			this.camera.position.y = this._baseCameraPos.y + this._f * mousePosRelY;
			
			if( this._lookAtCenter ) {
				this.camera.lookAt(  new THREE.Vector3( 0, 0, 0 ) );
			}
		}
		
		this.renderer.render( this.scene, this.camera );
		requestAnimationFrame( this.render.bind( this ) );
	};


	return Stage;
});