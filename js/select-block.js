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
		selected:{ type: 'string' },
	},
	supports: {
		"color":    true
	},

	edit: function( props ) {
		return wp.element.createElement("select", {
			  class: "zedlitz-language-selector",
			  id: "zedlitz-language-selector",
			  onchange: "doSelectLanguage(this)",
			}, 
			wp.element.createElement("option", {
			  value: "DE_de",
			}, "de"), 
			wp.element.createElement("option", {
			  value: "EN_en"
			}, "en"));
	},
	
	save: function( props ) {
		return wp.element.createElement("select", {
			  class: "zedlitz-language-selector",
			  id: "zedlitz-language-selector",
			  onchange: "doSelectLanguage(this)"
			}, 
			wp.element.createElement("option", {
			  value: "DE_de"
			}, "de"), 
			wp.element.createElement("option", {
			  value: "EN_en"
			}, "en"));    
	} } 
)

