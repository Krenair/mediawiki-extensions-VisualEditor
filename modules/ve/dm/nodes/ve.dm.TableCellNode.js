/*!
 * VisualEditor DataModel TableCellNode class.
 *
 * @copyright 2011-2012 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * DataModel table cell node.
 *
 * @class
 * @extends ve.dm.BranchNode
 * @constructor
 * @param {ve.dm.BranchNode[]} [children] Child nodes to attach
 * @param {Object} [element] Reference to element in linear model
 */
ve.dm.TableCellNode = function VeDmTableCellNode( children, element ) {
	// Parent constructor
	ve.dm.BranchNode.call( this, 'tableCell', children, element );
};

/* Inheritance */

ve.inheritClass( ve.dm.TableCellNode, ve.dm.BranchNode );

/* Static Properties */

ve.dm.TableCellNode.defaultAttributes = {
	'style': 'data'
};

/**
 * Node rules.
 *
 * @see ve.dm.NodeFactory
 * @static
 * @property
 */
ve.dm.TableCellNode.rules = {
	'isWrapped': true,
	'isContent': false,
	'canContainContent': false,
	'hasSignificantWhitespace': false,
	'childNodeTypes': null,
	'parentNodeTypes': ['tableRow']
};

ve.dm.TableCellNode.static.name = 'tableCell';

ve.dm.TableCellNode.static.matchTagNames = [ 'td', 'th' ];

ve.dm.TableCellNode.static.toDataElement = function ( domElement ) {
	var style = domElement.nodeName.toLowerCase() === 'th' ? 'header' : 'data';
	return { 'type': 'tableCell', 'attributes': { 'style': style } };
};

ve.dm.TableCellNode.static.toDomElement = function ( dataElement ) {
	var tag = dataElement.attributes && dataElement.attributes.style === 'header' ? 'th' : 'td';
	return document.createElement( tag );
};

/* Registration */

ve.dm.nodeFactory.register( 'tableCell', ve.dm.TableCellNode );
