<?php
/*
Plugin Name: zedlitz-wp
Plugin URI:  https://github.com/albert-zero/zedlitz-wp
Description: Plugin to support popups and localization
Version:     1.2.5
Author:      Albert Zedlitz
License:     free
*/

// Activate the language selection custom block
function loadBlock() {
    wp_enqueue_script( 'language-selection', 
        plugin_dir_url(__FILE__) . 'js/select-block.js',
        array('wp-blocks', 'wp-i18n', 'wp-editor'), true );
}
add_action('enqueue_block_editor_assets', 'loadBlock');

// Activate the popup and translation functions
function zedlitz_modal_popup() {
    wp_register_script( 'zedlitz_scripts', plugin_dir_url(__FILE__) . '/js/zedlitz-popup.js',   false, null, true );
    wp_enqueue_script(  'zedlitz_scripts', '', array(), null );
    wp_enqueue_style(   'zedlitz-style',   plugin_dir_url(__FILE__) . '/css/zedlitz-popup.css', array(), null, 'all' );
    wp_localize_script( 'zedlitz_scripts', 'global_vars', 
            array ( 'plugin_path' => plugin_dir_url(__FILE__) ));
}
add_action( 'wp_enqueue_scripts', 'zedlitz_modal_popup' );

// Activate the auto upate
include plugin_dir_path( __FILE__ ) . '/update.php';

function zedlitz_activate_update() {
    $plugin_dir  = WP_PLUGIN_DIR . '/zedlitz-wp';
    $plugin_data = get_plugin_data( $plugin_dir );
    $plugin_current_version = $plugin_data['Version'];
    $plugin_remote_path     = 'http://eezz.biz/update/update.php';
    $plugin_slug            = plugin_basename(__FILE__);
    new zedlitz_update_class($plugin_current_version, $plugin_remote_path, $plugin_slug);
}
add_action('init', 'zedlitz_activate_update');
