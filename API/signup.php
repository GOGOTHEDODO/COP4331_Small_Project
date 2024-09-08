<?php

$inData = getRequestInfo();

$username = $inData["username"];
$password = $inData["password"];

// Replace with your database credentials
$conn = new mysqli("localhost", "admin", "password", "userInfo");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if username already exists
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        returnWithError("Username already exists");
    } else {
        // Insert new user into the database
        $stmt = $conn->prepare("INSERT INTO Users (Login, Password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            returnWithInfo($username, $id);
        } else {
            returnWithError($stmt->error);
        }
    }

    $stmt->close();
    $conn->close();
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
    $retValue = '{"id":0,"username":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($username, $id)
{
    $retValue = '{"id":' . $id . ',"username":"' . $username . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>