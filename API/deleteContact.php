<?php
include 'helperFunctions.php'; 

$inData = getRequestInfo();

$contactId = $inData['contact_id'];
$userId = $inData['user_id'];

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
        // Verify the contact exists and belongs to the user
        $contactCheckStmt = $conn->prepare("SELECT contact_id FROM contacts WHERE contact_id = ? AND user_id = ?");
        $contactCheckStmt->bind_param("ii", $contactId, $userId);
        $contactCheckStmt->execute();
        $contactCheckResult = $contactCheckStmt->get_result();

        if ($contactCheckResult->num_rows > 0) {
            // Contact is valid, proceed with deletion
            $stmt = $conn->prepare("DELETE FROM contacts WHERE ID = ? AND user_id = ?");
            $stmt->bind_param("ii", $contactId, $userId);
            
            if ($stmt->execute()) {
                returnWithSuccess("Contact deleted successfully.");
            } else {
                returnWithError("Error deleting contact: " . $stmt->error);
            }

            $stmt->close();
        } else {
            returnWithError("Contact not found or does not belong to user.");
        }

        $contactCheckStmt->close();
    } else {
        returnWithError("Invalid user.");
    }

    $userCheckStmt->close();
    $conn->close();
}
