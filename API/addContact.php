<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'helperFunctions.php'; 

$inData = getRequestInfo();

$firstName = $inData['first_name'];
$lastName = $inData['last_name'];
$email = $inData['email'];
$phoneNumber = $inData['phone_number'];
$userId = $inData['user_id']; 

$conn = getDatabaseConnection();

if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
} else {
    // Verify the user exists and is logged in (you can expand this based on your authentication system)
    $userCheckStmt = $conn->prepare("SELECT user_id FROM Users WHERE user_id = ?");
    $userCheckStmt->bind_param("i", $userId);
    $userCheckStmt->execute();
    $userCheckResult = $userCheckStmt->get_result();

    if ($userCheckResult->num_rows > 0) {
        // User is valid, proceed with adding the contact
        $stmt = $conn->prepare("INSERT INTO contacts (user_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phoneNumber);
        
        if ($stmt->execute()) {
            $contactId = $conn->insert_id;
            http_response_code(200);
            returnWithSuccess("Contact added successfully. Contact ID: " . $contactId);
        } else {
            http_response_code(400);
            returnWithError("Error adding contact: " . $stmt->error);
        }

        $stmt->close();
    } else {
        http_response_code(400)
        returnWithError("Invalid user.");
    }

    $userCheckStmt->close();
    $conn->close();
}
