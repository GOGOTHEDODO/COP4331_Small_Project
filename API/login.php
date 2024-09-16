<?php
include 'helperFunctions.php'; 
$inData = getRequestInfo();

$username = $inData["username"];
$password = $inData["password"]; 

$conn = getDatabaseConnection();

if ($conn->connect_error) {
    http_response_code(500);
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, password FROM Users WHERE user_name = ?");
    $stmt->bind_param("s", $username); 
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $hashedPassword = $row['password'];

        if (password_verify($password, $hashedPassword)) {
            http_response_code(200);
            $userDetails = array(
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'user_id' => $row['user_id']
            );

            returnWithSuccess($userDetails);
        } else {
            http_response_code(400);
            returnWithError("Invalid Login Credentials");
        }
    } else {
        http_response_code(400);
        returnWithError("Invalid Login Credentials");
    }

    $stmt->close();
    $conn->close();
}
?>
