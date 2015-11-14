define(function(){

	var material = new THREE.LineBasicMaterial({ color: 0xffffff });
	material.opacity = 0.4;
	material.transparent = true;
	
	return function( coords ) {

		var i, c, geometry =  new THREE.Geometry();

		for( i = 0; i < coords.length; i++ ) {
			c = coords[ i ];
			geometry.vertices.push( new THREE.Vector3( c[ 0 ], c[ 1 ], c[ 2 ] ) );
			geometry.vertices.push( new THREE.Vector3( c[ 3 ], c[ 4 ], c[ 5 ] ) );
		}
		
		return new THREE.LineSegments( geometry, material );
	};
});