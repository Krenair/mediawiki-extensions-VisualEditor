/*!
 * VisualEditor ContentEditable MWEntityNode class.
 *
 * @copyright 2011-2013 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * ContentEditable MediaWiki image node.
 *
 * @class
 * @extends ve.ce.ImageNode
 * @constructor
 * @param {ve.dm.MWImageNode} model Model to observe
 */
 ve.ce.MWImageNode = function VeCeMWImageNode( model ) {
	// Parent constructor
	ve.ce.ImageNode.call( this, model );

	// Initialization
	this.$.addClass( 've-ce-MWImageNode' );
	this.$image = this.$;
	this.$ = $( '<' + ( model.getAttribute( 'isLinked' ) ? 'a' : 'span' ) + '>' );

	// Initialization
	this.$.attr( 'contenteditable', false ).append( this.$image );
	this.onUpdate();
};

/* Inheritance */

ve.inheritClass( ve.ce.MWImageNode, ve.ce.ImageNode );

/* Static Properties */

ve.ce.MWImageNode.static.name = 'MWimage';

/* Methods */

ve.ce.MWImageNode.prototype.onUpdate = function () {
	// ...
};

/* Registration */

ve.ce.nodeFactory.register( ve.ce.MWImageNode );