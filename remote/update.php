<?php 
if (isset($_POST['action'])) {
  switch ($_POST['action']) {
    case 'version':
      echo '1.2.5';
      break;

    case 'info':
      $obj = new stdClass();
      $obj->name         = 'ZedlitzArt';
      $obj->slug         = 'zedlitz-wp.php';
      $obj->plugin_name  = 'zedlitz-wp.php';
      $obj->new_version  = '1.2.5';
      $obj->requires     = '6.0';
      $obj->tested       = '6.2';
      $obj->downloaded   = 1;
      $obj->last_updated = '2023-01-03';
      $obj->sections = array(
        'description'       => 'Add new content to ZedlitzArt',
        'changelog'         => 'New feature: Auto-Update'
      );

      $obj->download_link = 'http://eezz.biz/update/update.php';
      echo serialize($obj);

    case 'license':
      echo 'false';
      break;
  }
} else {
	$file = 'zedlitz-wp.zip';
	if (file_exists($file)) {
		header('Cache-Control: public');
		header('Content-Description: File Transfer');
		header('Content-Type: application/zip');
		readfile($file);
	}
	else {
		http_response_code(404);
	}
}

