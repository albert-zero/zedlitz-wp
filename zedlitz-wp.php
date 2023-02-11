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
    wp_enqueue_script(
        'language-selection',
        plugin_dir_url(__FILE__) . 'js/select-block.js',
        array('wp-blocks', 'wp-i18n', 'wp-editor'),
        true
    );
}

add_action('enqueue_block_editor_assets', 'loadBlock');

