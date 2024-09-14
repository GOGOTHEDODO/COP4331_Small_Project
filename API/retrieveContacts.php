<?php
include 'helperFunctions.php'; 

$inData = getRequestInfo();

$user_id = $inData['user_id']; 
$searchTerm = isset($inData['search_term']) ? $inData['search_term'] : null; 

$conn = getDatabaseConnection();

if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
} else {
    // Verify the user exists and is logged in
    $userCheckStmt = $conn->prepare("SELECT user_id FROM Users WHERE user_id = ?");
    $userCheckStmt->bind_param("i", $user_id);
    $userCheckStmt->execute();
    $userCheckResult = $userCheckStmt->get_result();

    // Check valid user
    if ($userCheckResult->num_rows > 0) {
        if ($searchTerm) {
            // Search for specific contact
            $searchTerm = '%' . strtolower($searchTerm) . '%';
            $stmt = $conn->prepare("SELECT * FROM contacts WHERE user_id = ? AND (LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ?)");
            $stmt->bind_param("iss", $user_id, $searchTerm, $searchTerm);
        } else {
            // Retrieve all contacts for the user
            $stmt = $conn->prepare("SELECT * FROM contacts WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $contacts = array();
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
            http_response_code(200);
            returnWithSuccess($contacts);
        } else {
            http_response_code(400);
            returnWithError("No contacts found.");
        }

        $stmt->close();
    } else {
        http_response_code(400);
        returnWithError("Invalid user.");
    }

    $userCheckStmt->close();
    $conn->close();
}
?>
