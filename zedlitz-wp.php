<?php
/*
Plugin Name: zedlitz-wp
Plugin URI:  https://github.com/albert-zero/zedlitz-wp
Description: Plugin to support popups and localization
Version:     1.0.0
Author:      Albert Zedlitz
License:     free
*/

function loadBlock() {
    wp_enqueue_script( 'language-selection', 
        plugin_dir_url(__FILE__) . 'js/select-block.js',
        array('wp-blocks', 'wp-i18n', 'wp-editor'), true );
}
add_action('enqueue_block_editor_assets', 'loadBlock');

/**
 * Enqueue zedlitz popup.
 */
function zedlitz_modal_popup() {
    wp_register_script( 'zedlitz_scripts', plugin_dir_url(__FILE__) . '/js/zedlitz-popup.js',   false, null, true );
    wp_enqueue_script(  'zedlitz_scripts', '', array(), null );
    wp_enqueue_style(   'zedlitz-style',   plugin_dir_url(__FILE__) . '/css/zedlitz-popup.css', array(), null, 'all' );
    wp_localize_script( 'zedlitz_scripts', 'global_vars', array ( 'plugin_path' => plugin_dir_url(__FILE__) ));
}
add_action( 'wp_enqueue_scripts', 'zedlitz_modal_popup' );

