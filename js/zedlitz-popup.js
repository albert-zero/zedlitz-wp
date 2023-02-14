 "use strict";
/**
 *   Author: Albert Zedlitz
 *   Date  : 31.12.2022
 *
 *   Implementig a popup dialog for thumbnail images  
     and translation using json file

 * var href = myScript.pluginsUrl + '/path/to/resource';
 */

/**
 *   Start script on load 
 *   This is the method called for each page by environment
 */
window.addEventListener( "load", zedlitz_setup );

/**
 *   Add an event to the specified element, enabling a popup on click 
 */
async function loadTranslationFile() {
	/* global_vars is created by the calling PHP script, which sets the plugin path */
	return fetch(global_vars.plugin_path + "locales/content.json")
			.then((aResponse) => aResponse.text())
			.then((aJsnText)  => sessionStorage.setItem("translation_jsn_txt", aJsnText));
}

/**
 * callback for the language selector. The selected value is stored into 
 * the session storage to be consistent for all pages
 * <seöect ... onchange="doSelectLanguage(this)" ...>...</select>
 */			
function doSelectLanguage(aLocaleSelector) {
    sessionStorage.setItem("language", aLocaleSelector.value);
    doTranslate(false);
}

/**
 * Translate a table. The data- attribute is to positioned to the table cell,
 * so we do some special adoptions:
 * The table get a specific msgid key starting with "table-keys"
 * The msgstr is a set of keys, one for each table cell
 * The msgid/msgstr pair of these keys have to be defined in another place
 */			
async function doTranslateNested(aElement, aTranslationJsnObj, aValue, aTag) {
	const aKeys  = aValue.split(",");
	const aCells = aElement.getElementsByTagName(aTag);
	var   aKey;
	for (var i = 0; i < aCells.length && i < aKeys.length; i++) {
	    aKey = aKeys[i].trim();
	    if (aKey in aTranslationJsnObj) {
			aCells[i].innerHTML = aTranslationJsnObj[aKey];
		}
	}
}

/**
 * Translate a page depending on the language
 * Lazy parameter is set, if the original page in the original language is displayed
 * In this case the function initializes the translation and returns
 */			
async function doTranslate(bLazy = true) {
	var aTranslationJsnStr = sessionStorage.getItem("translation_jsn_txt");
	var aTranslationJsnObj = null;

    try {
	    // Load translation table
		if (aTranslationJsnStr == null || aTranslationJsnStr == "null") {
			await loadTranslationFile();
			aTranslationJsnStr = sessionStorage.getItem("translation_jsn_txt");
			sessionStorage.setItem("language", "de_DE");
		}
		
	    // Load locale: We need no translation for de_DE (in lazy mode)
	    // The locale selector has to be switched to the correct value
		var aLocale           = sessionStorage.getItem("language");
		var aLocaleSelector   = document.getElementById("zedlitz-language-selector");
		
		aLocaleSelector.value = aLocale; 
		
		if (aLocale == "de_DE" && bLazy) {
			return;
		}
		
	    aTranslationJsnObj = JSON.parse(aTranslationJsnStr);
	    
	    // Check if language is supported
	    if (!(aLocale in aTranslationJsnObj)) {
			return;
		}
	    aTranslationJsnObj = aTranslationJsnObj[aLocale];
	     
	    // Find tagged elements and translate
	    var aElementList = document.querySelectorAll("[data-zedlitz-i18n]");
	    var i, aKey, aVal;
	    for (i = 0; i < aElementList.length; i++) {
		    aKey = aElementList[i].getAttribute("data-zedlitz-i18n");
			if (aKey in aTranslationJsnObj) {
		    	aVal =  aTranslationJsnObj[aKey];	
				if (aKey.match(/^table-keys/)) {
					doTranslateNested(aElementList[i], aTranslationJsnObj, aVal, "TD");
				}
				else if (aKey.match(/^menu-keys/)) {
					doTranslateNested(aElementList[i], aTranslationJsnObj, aVal, "SPAN");
				}
				else if (aKey.match(/^caption-keys/)) {
					doTranslateNested(aElementList[i], aTranslationJsnObj, aVal, "FIGCAPTION");
				}
				else {
		    		aElementList[i].innerHTML = aVal;
		    	}
		    }
	    }
	} catch ( error ) {
		console.log( "faild to load localization " + error );		
	}    	
}

/**
 *  Setup is called for any page and assigns a popup function to 
 *  HTML elements with specified class zedlitz-img-detail
 */			
async function zedlitz_setup() {	
	var aElems = document.getElementsByClassName("zedlitz-img-detail");
 	for (var i = 0; i < aElems.length; i++) {
 		aElems[i].addEventListener("click", zedlitz_img_detail);
 	}
 	
 	// Translate the page content
	doTranslate();
}

/**
 *  Implementing a dynammic popup to an existing page
 */			
function zedlitz_img_detail() {
	try {
		// Create elements for the popup
      	var aThump   = this.querySelector("img");

		var aDialog  = document.createElement("dialog");
 		var aClose   = document.createElement("span");
 		var aImage   = document.createElement("img");
		
 		// Find the source of the image shown in the thumbnail
 		// <path>-150x150<extension> 
 		var aInxName = aThump.src.lastIndexOf("-");
 		var aInxExt  = aThump.src.lastIndexOf(".");
 		aImage.src   = aThump.src.substring(0, aInxName).concat(aThump.src.substring(aInxExt));
 		aClose.innerHTML = "X";
 		
 		// Adjust the vertical scrolling
 		var aPosition = document.scrollingElement.scrollTop;
 		aPosition     = Math.ceil(aPosition);
		aDialog.style.transform = "translateY(" + aPosition + "px)";
 		// alert(aDialog.style.transform);
 		
 		// assign class definion for CSS
 		aDialog.classList.add( "zedlitz-img-popup" );
 		aImage.classList.add(  "zedlitz-img-small" );
 		aClose.classList.add(  "zedlitz-img-popup-close" );
 		
 		// Activate the close bÃºtton
 		aClose.addEventListener("click", () => { aDialog.remove() } );

 		// Display the popup
 		aDialog.appendChild( aImage );
 		aDialog.appendChild( aClose );
 	    document.body.appendChild(aDialog);

 	    aDialog.showModal();
	} catch( error ) {
		console.log( error )
	}		
}
