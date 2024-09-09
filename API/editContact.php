<?php
include 'helperFunctions.php'; 

$inData = getRequestInfo();

$contactId = $inData['contactId']; 
$firstName = $inData['firstName'];
$lastName = $inData['lastName'];
$email = $inData['email'];
$phone = $inData['phone'];
$userId = $inData['userId']; 

$conn = getDatabaseConnection()

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Verify the user exists and is logged in
    $userCheckStmt = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
    $userCheckStmt->bind_param("i", $userId);
    $userCheckStmt->execute();
    $userCheckResult = $userCheckStmt->get_result();

    if ($userCheckResult->num_rows > 0) {
        // User is valid, proceed with updating the contact
        // Verify the contact belongs to the user
        $contactCheckStmt = $conn->prepare("SELECT ID FROM contacts WHERE user_id = ?");
        $contactCheckStmt->bind_param("i", $userId);
        $contactCheckStmt->execute();
        $contactCheckResult = $contactCheckStmt->get_result();

        if ($contactCheckResult->num_rows > 0) {
            // Contact exists for this user, proceed with updating
            $stmt = $conn->prepare("UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?");
            $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $userId);
            
            if ($stmt->execute()) {
                returnWithSuccess("Contact updated successfully.");
            } else {
                returnWithError("Error updating contact: " . $stmt->error);
            }

            $stmt->close();
        } else {
            returnWithError("Contact does not belong to this user.");
        }

        $contactCheckStmt->close();
    } else {
        returnWithError("Invalid user.");
    }

    $userCheckStmt->close();
    $conn->close();
}
?>
