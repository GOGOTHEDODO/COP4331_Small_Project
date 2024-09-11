<?php
include 'helperFunctions.php'; 

$inData = getRequestInfo();

$firstName = $inData['first_name'];
$lastName = $inData['last_name'];
$contactId = $inData['contact_id']; 
$email = $inData['email'];
$phone = $inData['phone'];
$user_id = $inData['user_id']; 

$conn = getDatabaseConnection();

if ($conn->connect_error) {
    http_response_code(500)
    returnWithError($conn->connect_error);
} else {
    // Verify the user exists and is logged in
    $userCheckStmt = $conn->prepare("SELECT user_id FROM Users WHERE user_id = ?");
    $userCheckStmt->bind_param("i", $user_id);
    $userCheckStmt->execute();
    $userCheckResult = $userCheckStmt->get_result();

    if ($userCheckResult->num_rows > 0) {
        // User is valid, proceed with updating the contact
        // Verify the contact belongs to the user
        $contactCheckStmt = $conn->prepare("SELECT contact_id FROM contacts WHERE contact_id = ? AND user_id = ?");
        $contactCheckStmt->bind_param("ii", $contactId, $user_id);
        $contactCheckStmt->execute();
        $contactCheckResult = $contactCheckStmt->get_result();

        if ($contactCheckResult->num_rows > 0) {
            // Contact exists for this user, proceed with updating
            $stmt = $conn->prepare("UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE contact_id = ? AND user_id = ?");
            $stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $contactId, $user_id);
            
            if ($stmt->execute()) {
                http_response_code(200)
                returnWithSuccess("Contact updated successfully.");
            } else {
                http_response_code(400)
                returnWithError("Error updating contact: " . $stmt->error);
            }

            $stmt->close();
        } else {
            http_response_code(400)
            returnWithError("Contact does not belong to this user.");
        }

        $contactCheckStmt->close();
    } else {
        http_response_code(400)
        returnWithError("Invalid user.");
    }

    $userCheckStmt->close();
    $conn->close();
}
?>
