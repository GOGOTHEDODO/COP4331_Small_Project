<?php
	include 'helperFunctions.php'; 
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

    // change user and password to real info for db
	$conn = getDatabaseConnection();
	if( $conn->connect_error )
	{
		// Return 500 Internal Server Error for connection issues
		http_response_code(500);
		returnWithError( $conn->connect_error );
	}
	else
	{
        // potentially change query info
		$stmt = $conn->prepare("SELECT user_id, first_name, last_name FROM Users WHERE user_name = ? AND password = ?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc() )
		{
			// Return 200 OK for successful login
			http_response_code(200);
			returnWithInfo( $row['first_name'], $row['last_name'], $row['user_id'] );
		}
		else
		{
			// Return 400 Bad Request for invalid login credentials
			http_response_code(400);
			returnWithError("Invalid Login Credentials");
		}

		$stmt->close();
		$conn->close();
	}
?>
