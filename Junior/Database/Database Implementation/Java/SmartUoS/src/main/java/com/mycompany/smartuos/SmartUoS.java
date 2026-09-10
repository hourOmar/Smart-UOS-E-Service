/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.smartuos;

/**
 * SmartUoS System
 * This system integrates MySQL (structured data) and MongoDB (unstructured data)
 * to handle document uploads, downloads, and transcript processing.
 * 
 * @author QA
 */

import java.sql.*;
import java.io.*;
import javax.swing.JFileChooser;

import com.mongodb.client.*;
import com.mongodb.client.gridfs.*;

import org.bson.types.ObjectId;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.util.regex.*;

import java.util.Properties;
import java.io.FileInputStream;

public class SmartUoS {

    // ================= CONFIG =================
    // MySQL connection details (structured database)
    private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/Smart_UoS";
    private static final String MYSQL_USER = "root";
    private static final String MYSQL_PASS = "YOUR_PASSWORD";
    
    // MongoDB connection details (unstructured database)
    private static final String MONGO_URI = "mongodb://localhost:27017";
    private static final String DB_NAME = "Smart_UoS";

    // ================= MYSQL =================
    // Establish connection to MySQL database
    public static Connection getMySQLConnection() throws SQLException {
        return DriverManager.getConnection(MYSQL_URL, MYSQL_USER, MYSQL_PASS);
    }

    // ================= MONGODB =================
    // Connect to MongoDB database
    public static MongoDatabase getMongoDB() {
        MongoClient client = MongoClients.create(MONGO_URI);
        return client.getDatabase(DB_NAME);
    }

    // Get GridFS bucket for storing large files
    public static GridFSBucket getBucket() {
        return GridFSBuckets.create(getMongoDB(), "documents");
    }

    // Get collection for storing transcript data
    public static MongoCollection<org.bson.Document> getTranscriptCollection() {
        return getMongoDB().getCollection("transcripts");
    }

    // ================= FILE CHOOSER =================
    // Open file chooser for user to select a file
    public static String chooseFile() {
        JFileChooser chooser = new JFileChooser();
        int result = chooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            return chooser.getSelectedFile().getAbsolutePath();
        }
        return null;
    }

     /**
     * Upload file to MongoDB (GridFS) and store metadata in MySQL
     * @param filePath path of selected file
     * @param requestId related request ID
     * @return MongoDB ObjectId of uploaded file
     */
    
    public static ObjectId uploadFile(String filePath, int requestId) {
        try (Connection con = getMySQLConnection(); FileInputStream fileStream = new FileInputStream(filePath)) {

            GridFSBucket bucket = getBucket();

            // Extract file name from path
            String fileName = new File(filePath).getName();

            // Upload file to MongoDB
            ObjectId fileId = bucket.uploadFromStream(fileName, fileStream);

            // Extract file type (extension)
            String fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

            // Store metadata in MySQL
            String sql = "INSERT INTO Document (File_Name, File_Type, Upload_Date, Request_ID, Mongo_File_ID) "
                    + "VALUES (?, ?, NOW(), ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, fileName);
            ps.setString(2, fileType);
            ps.setInt(3, requestId);
            ps.setString(4, fileId.toString());
            ps.executeUpdate();

            System.out.println("Uploaded file with Mongo ID: " + fileId);
            return fileId;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // ================= DOWNLOAD =================
    /**
     * Download file from MongoDB using request ID from MySQL
     * @param requestId request identifier
     * @return local path of downloaded file
     */
    
    public static String downloadFile(int requestId) {
        String tempPath = System.getProperty("java.io.tmpdir");

        try (Connection con = getMySQLConnection()) {

            // Retrieve file info from MySQL
            String sql = "SELECT Mongo_File_ID, File_Name FROM Document "
                    + "WHERE Request_ID = ? LIMIT 1";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, requestId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String mongoId = rs.getString("Mongo_File_ID");
                String fileName = rs.getString("File_Name");

                String outputPath = tempPath + fileName;

                // Download file from MongoDB
                try (FileOutputStream out = new FileOutputStream(outputPath)) {
                    getBucket().downloadToStream(new ObjectId(mongoId), out);
                }

                return outputPath;
            }

        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        return null;
    }

    // ================= PDF TEXT EXTRACTION =================
    /**
     * Extract text from PDF using Apache PDFBox
     * @param path file path
     * @return cleaned extracted text
     */
    public static String extractText(String path) throws Exception {
        try (PDDocument doc = PDDocument.load(new File(path))) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);

            // Clean formatting
            text = text.replaceAll("\\r", "\n");
            text = text.replaceAll("\\n+", "\n");
            text = text.replaceAll("\\s{2,}", " ");

            return text.trim();
        }
    }

    // ================= SAVE TRANSCRIPT =================
    /**
     * Extract GPA from transcript and store it in MongoDB
     * @param path transcript file path
     * @param studentId student identifier
     */
    public static void saveTranscript(String path, int studentId) throws Exception {

        String text = extractText(path);

        String gpa = "Unknown";
        
        // Regex to extract GPA value from transcript
        Matcher m = Pattern.compile("Cumulative[\\s\\S]*?(\\d+\\.\\d{2})\\s*$").matcher(text);
        
        if (m.find()) {
            gpa = m.group(1);
        }

        // Store transcript data in MongoDB
        org.bson.Document doc = new org.bson.Document()
                .append("student_id", studentId)
                .append("gpa", gpa)
                .append("raw_text", text)
                .append("date", new java.util.Date());

        getTranscriptCollection().insertOne(doc);

        ObjectId id = doc.getObjectId("_id");

        System.out.println("Transcript saved to MongoDB");
        System.out.println("Transcript Mongo ID: " + id);
    }

    // ================= MAIN =================
    public static void main(String[] args) throws Exception {

        int studentId = 1;
        int requestId = 407;

        System.out.println("=== SmartUoS System Started ===");

         // 1. Upload reason file
        System.out.println("\nSelect REASON file:");
        String reasonPath = chooseFile();

        if (reasonPath != null) {
            System.out.println("Uploading reason file...");
            uploadFile(reasonPath, requestId);
        } else {
            System.out.println("No reason file selected.");
        }

        // 2. Download and open file
        System.out.println("\nDownloading file from database...");

        String downloadedPath = downloadFile(requestId);

        if (downloadedPath != null) {
            System.out.println("Opening downloaded file...");
            java.awt.Desktop.getDesktop().open(new File(downloadedPath));
        } else {
            System.out.println("No file found for this request.");
        }

        // 3. Upload transcript
        System.out.println("\nSelect TRANSCRIPT file:");
        String transcriptPath = chooseFile();

        if (transcriptPath != null) {
            System.out.println("Processing transcript...");
            saveTranscript(transcriptPath, studentId);
        } else {
            System.out.println("No transcript file selected.");
        }

        System.out.println("\n=== Program Finished Successfully ===");
    }
}
