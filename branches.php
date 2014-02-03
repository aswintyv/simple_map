<?php
include('config.php');
$retVal = array();
ini_set('auto_detect_line_endings',TRUE);
error_reporting(E_ALL);
ini_set('display_errors', '1');
$mysqli = new mysqli($sql_host, $sql_user, $sql_password, $sql_db);

// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

$rows = array();

$result = $mysqli->query("select * from branches where lat is not null");
if($result){
	while($row = $result->fetch_assoc()){
		$rows[] = $row;	
	}
	$retVal['success'] = $rows;		
}

$result = $mysqli->query("select * from branches where lat is null");
if($result){
	if($result->num_rows){
		$retVal['message'] = "Some branches are either pending geocoding or could not geocode.";
	}
}


print_r(json_encode($retVal));

/**

if (($handle = fopen("branches.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		
		if ($result = $mysqli->query("select * from branches where name like '".$data[1]."'")) {
			if($result->num_rows){
				$retVal[] = $result->fetch_assoc();
			}
			else{
				$response = json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?address='.$data[1].',+orissa,+india&sensor=true'));
				$entry = $response->results[0];
				if(!$entry){
					print_r('value not found: '.$data[1]);
				}
				$lat = $entry->geometry->location->lat;
				$lng = $entry->geometry->location->lng;
				$mysqli->query("INSERT INTO branches(id, name, lat, `long`, location) VALUES (null, '".$data[1]."',".$lat.",".$lng.",'".$data[1]."')");
			}
		}		
    }
    print_r(json_encode($retVal));
    fclose($handle);
}

**/

?>