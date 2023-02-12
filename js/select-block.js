 "use strict";
/**
 *   Author: Albert Zedlitz
 *   Date  : 31.12.2022
 *
 *   Implementig a select-options block  
     and translation using json file
 */
wp.blocks.registerBlockType('zedlitz/selector', {
	title:     'Language Selector',
	icon:      'editor-ul',
	category:  'widgets',
	attributes: {
		selected:{ 
			type:    'string', 
			default: 'de_DE'
		},
	},

	edit: function( props ) {
		function onĆhangeSelection(element) {
			props.setAttributes( { selected : element.value } );
			doSelectLanguage(element);
		};

		return wp.element.createElement("select", {
			  class: "zedlitz-language-selector",
			  id:    "zedlitz-language-selector",
			  onchange: "onĆhangeSelection(this)",
			}, 
			wp.element.createElement("option", {
			  value: "de_DE"
			}, "de"), 
			wp.element.createElement("option", {
			  value: "en_EN"
			}, "en"));
	},
	
	save: function( props ) {
		return wp.element.createElement("select", {
			  class: "zedlitz-language-selector",
			  id:    "zedlitz-language-selector",
			  onchange: "doSelectLanguage(this)"
			}, 
			wp.element.createElement("option", {
			  selected: ( props.attributes.selected == "de_DE" ),
			  value: "de_DE"
			}, "de"), 
			wp.element.createElement("option", {
			  selected: ( props.attributes.selected == "en_EN" ),
			  value: "en_EN"
			}, "en"));    
	} } 
)

