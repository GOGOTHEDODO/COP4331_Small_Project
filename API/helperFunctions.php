<?php
// Database connection settings
define('DB_HOST', 'localhost');
define('DB_USER', 'admin');
define('DB_PASSWORD', 'password');
define('DB_NAME', 'userInfo');

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

function returnWithSuccess($msg)
{
    $retValue = '{"success":true,"message":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}

?>
