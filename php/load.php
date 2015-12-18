<?php
    
/*
 * Script: Datei laden.
 * Ließt den Inhalt einer Datei aus
 * und liefert ihn als String.
 */

// Get filename
$file = $_POST["file"];
$file = explode("/", $file);
$file = $file[0];
$file = "../view/$file.html";

// Echo file content
if (file_exists($file)) { echo file_get_contents($file); }
else { echo "error"; }

?>