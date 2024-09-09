<?php
include 'helperFunctions.php'; 
$inData = getRequestInfo();

$username = $inData["username"];
$password = $inData["password"];

// Replace with your database credentials
$conn = getDatabaseConnection()

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

?>