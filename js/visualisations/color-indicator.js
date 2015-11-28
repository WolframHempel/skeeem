define(function( require ){

	function ColorIndicator( container, color, getPositionForColor ) {
		this.color = color;
		this.color.isSelected.subscribe( this._setSelected.bind( this ) );
		this._container = container;
		this._getPositionForColor = getPositionForColor;
		this._animationFrameId = null;
		this._element = document.createElement( 'div' );
		this._element.className = 'color-indicator';
		this._element.addEventListener( 'click', this._onClick.bind( this ), false );
		this._element.addEventListener( 'mouseover', this._onMouseOver.bind( this ), false );
		this._element.addEventListener( 'mouseout', this._onMouseOut.bind( this ), false );
		this._container.appendChild( this._element );
		this._updatePosition();
		this._setSelected();
	}

	ColorIndicator.prototype._setSelected = function() {
		if( this.color.isSelected() ) {
			this._element.classList.add( 'selected' );
		} else {
			this._element.classList.remove( 'selected' );
		}
	};

	ColorIndicator.prototype._onClick = function() {
		this.color.select();
	};

	ColorIndicator.prototype._onMouseOver = function() {
		this.color.isHighlighted( true );
	};

	ColorIndicator.prototype._onMouseOut = function() {
		this.color.isHighlighted( false );
	};
	
	ColorIndicator.prototype._updatePosition = function() {
		var position = this._getPositionForColor( this.color );
		this._element.style.left = position.x + 'px';
		this._element.style.top = position.y + 'px';
		this._animationFrameId = requestAnimationFrame( this._updatePosition.bind( this ) );
	};

	ColorIndicator.prototype.destroy = function() {
		cancelAnimationFrame( this._animationFrameId );
	};

	return ColorIndicator;
});