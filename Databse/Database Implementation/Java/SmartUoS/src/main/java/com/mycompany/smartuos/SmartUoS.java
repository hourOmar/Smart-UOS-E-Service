/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.smartuos;

/**
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
    private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/Smart_UoS";
    private static final String MYSQL_USER = "root";
    private static final String MYSQL_PASS = "YOUR_PASSWORD";
    private static final String MONGO_URI = "mongodb://localhost:27017";
    private static final String DB_NAME = "Smart_UoS";

    // ================= MYSQL =================
    public static Connection getMySQLConnection() throws SQLException {
        return DriverManager.getConnection(MYSQL_URL, MYSQL_USER, MYSQL_PASS);
    }

    // ================= MONGODB =================
    public static MongoDatabase getMongoDB() {
        MongoClient client = MongoClients.create(MONGO_URI);
        return client.getDatabase(DB_NAME);
    }

    public static GridFSBucket getBucket() {
        return GridFSBuckets.create(getMongoDB(), "documents");
    }

    public static MongoCollection<org.bson.Document> getTranscriptCollection() {
        return getMongoDB().getCollection("transcripts");
    }

    // ================= FILE CHOOSER =================
    public static String chooseFile() {
        JFileChooser chooser = new JFileChooser();
        int result = chooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            return chooser.getSelectedFile().getAbsolutePath();
        }
        return null;
    }

    public static ObjectId uploadFile(String filePath, int requestId) {
        try (Connection con = getMySQLConnection(); FileInputStream fileStream = new FileInputStream(filePath)) {

            GridFSBucket bucket = getBucket();

            String fileName = new File(filePath).getName();

            ObjectId fileId = bucket.uploadFromStream(fileName, fileStream);

            String fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

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
    public static String downloadFile(int requestId) {
        String tempPath = System.getProperty("java.io.tmpdir");

        try (Connection con = getMySQLConnection()) {

            String sql = "SELECT Mongo_File_ID, File_Name FROM Document "
                    + "WHERE Request_ID = ? LIMIT 1";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, requestId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String mongoId = rs.getString("Mongo_File_ID");
                String fileName = rs.getString("File_Name");

                String outputPath = tempPath + fileName;

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
    public static String extractText(String path) throws Exception {
        try (PDDocument doc = PDDocument.load(new File(path))) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);

            text = text.replaceAll("\\r", "\n");
            text = text.replaceAll("\\n+", "\n");
            text = text.replaceAll("\\s{2,}", " ");

            return text.trim();
        }
    }

    // ================= SAVE TRANSCRIPT =================
    public static void saveTranscript(String path, int studentId) throws Exception {

        String text = extractText(path);

        String gpa = "Unknown";
        
        Matcher m = Pattern.compile("Cumulative[\\s\\S]*?(\\d+\\.\\d{2})\\s*$").matcher(text);
        
        if (m.find()) {
            gpa = m.group(1);
        }

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

    public static void main(String[] args) throws Exception {

        int studentId = 1;
        int requestId = 407;

        System.out.println("=== SmartUoS System Started ===");

        // ================= 1. UPLOAD REASON FILE =================
        System.out.println("\nSelect REASON file:");
        String reasonPath = chooseFile();

        if (reasonPath != null) {
            System.out.println("Uploading reason file...");
            uploadFile(reasonPath, requestId);
        } else {
            System.out.println("No reason file selected.");
        }

        // ================= 2. DOWNLOAD & OPEN FILE =================
        System.out.println("\nDownloading file from database...");

        String downloadedPath = downloadFile(requestId);

        if (downloadedPath != null) {
            System.out.println("Opening downloaded file...");
            java.awt.Desktop.getDesktop().open(new File(downloadedPath));
        } else {
            System.out.println("No file found for this request.");
        }

        // ================= 3. UPLOAD TRANSCRIPT =================
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
