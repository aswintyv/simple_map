<?php
include('config.php');

$retVal = array();
$rows = array();
ini_set('auto_detect_line_endings',TRUE);
ini_set('display_errors', '1');
$mysqli = new mysqli($sql_host, $sql_user, $sql_password, $sql_db);

// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
$branch = $_GET['branch_name'];
$refresh = $_GET['refresh'];
$result = $mysqli->query("select * from clients where branch_name like '".$branch."'");
while ($row = $result->fetch_assoc()) {
	if(!$row['lat']){
		$response = json_decode(file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?address='.$row['village'].',+orissa,+india&sensor=true'));
		$entry = $response->results[0];
		if(!$entry){
			print_r('value not found: '.$data[1]);
		}
		$lat = $entry->geometry->location->lat;
		$lng = $entry->geometry->location->lng;
		$mysqli->query("update clients set lat = $lat, `long` = $lng where id = ".$row['id']);
		$row['lat'] = $lat;
		$row['long'] = $lng;
	}
	$rows[] = $row;
}
$retVal['success'] = $rows;


$result = $mysqli->query("select * from branches where name like '".$branch."'");
if($row = $result->fetch_assoc()){

$retVal['branch'] = $row;

}


print_r(json_encode($retVal));

?>