<?php
	include 'helperFunctions.php'; 
	$inData = getRequestInfo();
	
	$username = $inData["username"];
	$password = $inData["password"]; 
	
	$conn = getDatabaseConnection();
	
	if( $conn->connect_error )
	{
		http_response_code(500);
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT user_id, first_name, last_name FROM Users WHERE user_name = ? AND password = ?");
		$stmt->bind_param("ss", $username, $password); 
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc() )
		{
			http_response_code(200);
			returnWithInfo( $row['first_name'], $row['last_name'], $row['user_id'] );
		}
		else
		{
			http_response_code(400);
			returnWithError("Invalid Login Credentials");
		}

		$stmt->close();
		$conn->close();
	}
?>
