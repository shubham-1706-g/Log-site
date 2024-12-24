<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Collect form data
$name = $_POST['name'];
$mail = $_POST['mail'];
$sub = $_POST['subject'];
$msg = $_POST['message'];

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lform";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare SQL query
$sql = "INSERT INTO form_data (name, mail, sub, msg) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind the parameters
$stmt->bind_param("ssss", $name, $mail, $sub, $msg);

// Execute the query
if ($stmt->execute()) {
    // Basic email configuration
    $to = $mail;
    $subject = $sub;
    
    // Create email body
    $message = "
    <html>
    <head>
        <title>Form Submission</title>
    </head>
    <body>
        <h2>Thank you for your submission</h2>
        <p>We received the following information:</p>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $mail</p>
        <p><strong>Subject:</strong> $sub</p>
        <p><strong>Message:</strong> $msg</p>
    </body>
    </html>
    ";

    // Headers
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: your-email@gmail.com'; // Replace with your Gmail
    $headers[] = 'Reply-To: your-email@gmail.com'; // Replace with your Gmail
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    // Convert headers array to string
    $headers_str = implode("\r\n", $headers);

    // Try to send email and capture the result
    $mailSent = mail($to, $subject, $message, $headers_str);

    if($mailSent) {
        echo "Record added successfully and email sent.";
    } else {
        // Get mail configuration for debugging
        echo "Record added but email sending failed.<br>";
        echo "Debug information:<br>";
        echo "PHP mail enabled: " . (function_exists('mail') ? 'Yes' : 'No') . "<br>";
        echo "SMTP host: " . ini_get('SMTP') . "<br>";
        echo "SMTP port: " . ini_get('smtp_port') . "<br>";
    }
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>