/*!
 * VisualEditor UserInterface MWParameterSearchWidget class.
 *
 * @copyright 2011-2014 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * Creates an ve.ui.MWParameterSearchWidget object.
 *
 * @class
 * @extends OO.ui.SearchWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.MWParameterSearchWidget = function VeUiMWParameterSearchWidget( template, config ) {
	// Configuration intialization
	config = ve.extendObject( {
		'placeholder': ve.msg( 'visualeditor-parameter-input-placeholder' )
	}, config );

	// Parent constructor
	OO.ui.SearchWidget.call( this, config );

	// Properties
	this.template = template;
	this.index = [];

	// Events
	this.template.connect( this, { 'add': 'buildIndex', 'remove': 'buildIndex' } );

	// Initialization
	this.$element.addClass( 've-ui-mwParameterSearchWidget' );
	this.buildIndex();
};

/* Inheritance */

OO.inheritClass( ve.ui.MWParameterSearchWidget, OO.ui.SearchWidget );

/* Events */

/**
 * @event select
 * @param {string|null} name Parameter name or null if no item is selected
 */

/* Methods */

/**
 * Handle select widget select events.
 *
 * @method
 * @param {string} value New value
 */
ve.ui.MWParameterSearchWidget.prototype.onQueryChange = function () {
	// Parent method
	OO.ui.SearchWidget.prototype.onQueryChange.call( this );

	// Populate
	this.addResults();
};

/**
 * Handle select widget select events.
 *
 * @method
 * @param {OO.ui.OptionWidget} item Selected item
 * @fires select
 */
ve.ui.MWParameterSearchWidget.prototype.onResultsSelect = function ( item ) {
	this.emit( 'select', item && item.getData() ? item.getData().name : null );
};

/**
 * Build a serchable index of parameters.
 *
 * @method
 * @param {ve.dm.MWTemplateSpecModel} spec Template specification
 */
ve.ui.MWParameterSearchWidget.prototype.buildIndex = function () {
	var i, len, name, label, aliases, description,
		spec = this.template.getSpec(),
		knownParams = spec.getParameterNames();

	this.index.length = 0;
	for ( i = 0, len = knownParams.length; i < len; i++ ) {
		name = knownParams[i];
		// Skip parameters already in use
		if ( this.template.hasParameter( name ) ) {
			continue;
		}
		label = spec.getParameterLabel( name );
		aliases = spec.getParameterAliases( name );
		description = spec.getParameterDescription( name );

		this.index.push( {
			// Query information
			'text': [ label, description ].join( ' ' ).toLowerCase(),
			'names': [ name ].concat( aliases ).join( '|' ).toLowerCase(),
			// Display information
			'name': name,
			'label': label,
			'aliases': aliases,
			'description': description
		} );
	}

	// Re-populate
	this.onQueryChange();
};

/**
 * Handle media query response events.
 *
 * @method
 */
ve.ui.MWParameterSearchWidget.prototype.addResults = function () {
	var i, len, item, textMatch, nameMatch,
		exactMatch = false,
		value = this.query.getValue().trim().replace( /[\|\{\}]/g, '' ),
		query = value.toLowerCase(),
		items = [];

	for ( i = 0, len = this.index.length; i < len; i++ ) {
		item = this.index[i];
		textMatch = item.text.indexOf( query ) >= 0;
		nameMatch = item.names.indexOf( query ) >= 0;
		if ( textMatch || nameMatch ) {
			items.push( new ve.ui.MWParameterResultWidget( item, { '$': this.$ } ) );
			if ( nameMatch ) {
				exactMatch = true;
			}
		}
	}

	if ( !exactMatch && value.length && !this.template.hasParameter( value ) ) {
		items.unshift( new ve.ui.MWParameterResultWidget( {
			'name': value,
			'label': value,
			'aliases': [],
			'description': ve.msg( 'visualeditor-parameter-search-unknown' )
		}, { '$': this.$ } ) );
	}

	if ( !items.length ) {
		items.push( new ve.ui.MWParameterResultWidget(
			{
				'name': null,
				'label': '',
				'aliases': [],
				'description': ve.msg( 'visualeditor-parameter-search-no-unused' )
			},
			{ '$': this.$, 'disabled': true }
		) );
	}

	this.results.addItems( items );
	if ( query.length ) {
		this.results.highlightItem( this.results.getFirstSelectableItem() );
	}
};
