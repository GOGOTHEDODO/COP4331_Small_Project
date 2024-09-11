<?php
include 'helperFunctions.php'; 

$inData = getRequestInfo();

$firstName = $inData['first_name'];
$lastName = $inData['last_name'];
$email = $inData['email'];
$phone = $inData['phone'];
$user_id = $inData['user_id']; 

$conn = getDatabaseConnection();

if ($conn->connect_error) {
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
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
        
        if ($stmt->execute()) {
            // Retrieve the last inserted ID
            $contactId = $conn->insert_id;
            returnWithSuccess("Contact added successfully. Contact ID: " . $contactId);
        } else {
            returnWithError("Error adding contact: " . $stmt->error);
        }

        $stmt->close();
    } else {
        returnWithError("Invalid user.");
    }

    $userCheckStmt->close();
    $conn->close();
}
