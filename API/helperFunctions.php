<?php
// Database connection settings
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', ':Y7VUM2ed@Sq');
define('DB_NAME', 'SmallProjectDatabase');

// Function to create a new database connection
function getDatabaseConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        return null;
    }
    
    return $conn;
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"success":false,"message":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($data)
{
    if (is_array($data) || is_object($data)) {
        $retValue = json_encode(array_merge(['success' => true], $data));
    } else {
        $retValue = json_encode(['success' => true, 'message' => $data]);
    }
    sendResultInfoAsJson($retValue);
}


?>
