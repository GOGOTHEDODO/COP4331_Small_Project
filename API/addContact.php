
<?php
include 'helperFunctions.php'; 

$inData = getRequestInfo();

$firstName = $inData['firstName'];
$lastName = $inData['lastName'];
$email = $inData['email'];
$phone = $inData['phone'];
$userId = $inData['userId'];

$conn = getDatabaseConnection()

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Verify the user exists and is logged in (you can expand this based on your authentication system)
    $userCheckStmt = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
    $userCheckStmt->bind_param("i", $userId);
    $userCheckStmt->execute();
    $userCheckResult = $userCheckStmt->get_result();

    if ($userCheckResult->num_rows > 0) {
        // User is valid, proceed with adding the contact
        $stmt = $conn->prepare("INSERT INTO contacts (user_id, first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $userId, $firstName, $lastName, $email, $phone, $address);
        
        if ($stmt->execute()) {
            returnWithSuccess("Contact added successfully.");
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