<?php
include 'helperFunctions.php'; 
$inData = getRequestInfo();

$firstName = $inData["first_name"];
$username = $inData["username"];
$lastName = $inData["last_name"];
$password = $inData["password"];

$conn = getDatabaseConnection();

if ($conn === null) {
    http_response_code(500);
    returnWithError("Database connection failed");
} else {
    // Check if username already exists
    $stmt = $conn->prepare("SELECT user_id FROM Users WHERE user_name = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        http_response_code(400);
        returnWithError("Username already exists");
    } else {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("INSERT INTO Users (user_name, password, first_name, last_name) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $hashedPassword, $firstName, $lastName);
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            http_response_code(200);

            $userDetails = array(
                'username' => $username,
                'user_id' => $id
            );

            returnWithSuccess($userDetails);
        } else {
            http_response_code(500);
            returnWithError($stmt->error);
        }
    }

    $stmt->close();
    $conn->close();
}
?>
