
<?php
	include 'helperFunctions.php'; 
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

    // change user and password to real info for db
	$conn = getDatabaseConnection()
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // potentially change query info
		$stmt = $conn->prepare("SELECT user_id ,first_name , last_name FROM Users WHERE user_name =? AND password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['first_name'], $row['last_name'], $row['user_id'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	

?>
