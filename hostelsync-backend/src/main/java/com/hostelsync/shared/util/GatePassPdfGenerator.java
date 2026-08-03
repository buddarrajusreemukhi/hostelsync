package com.hostelsync.shared.util;

import com.hostelsync.gatepass.entity.GatePass;
import com.hostelsync.gatepass.entity.GatePassReceipt;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Component
public class GatePassPdfGenerator {

    public ByteArrayInputStream generateReceiptPdf(GatePass gatePass, GatePassReceipt receipt) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Font.BOLD);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            // Title
            Paragraph title = new Paragraph("HOSTELSYNC - OFFICIAL GATE PASS", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Receipt No: " + receipt.getReceiptNumber(), subHeaderFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Table of Details
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);

            addTableRow(table, "Student Name:", gatePass.getStudent().getUser().getFullName(), labelFont, valueFont);
            addTableRow(table, "Roll Number:", gatePass.getStudent().getRollNumber(), labelFont, valueFont);
            addTableRow(table, "Department:", gatePass.getStudent().getDepartment(), labelFont, valueFont);
            addTableRow(table, "Destination:", gatePass.getDestination(), labelFont, valueFont);
            addTableRow(table, "Reason:", gatePass.getReason(), labelFont, valueFont);
            addTableRow(table, "Valid From:", gatePass.getFromTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), labelFont, valueFont);
            addTableRow(table, "Valid Until:", gatePass.getToTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), labelFont, valueFont);
            addTableRow(table, "Emergency Contact:", gatePass.getEmergencyContact(), labelFont, valueFont);
            addTableRow(table, "Approval Status:", gatePass.getStatus().name(), labelFont, valueFont);
            addTableRow(table, "Approved By:", gatePass.getApprovedBy() != null ? gatePass.getApprovedBy().getFullName() : "N/A", labelFont, valueFont);

            document.add(table);

            // QR Code Image
            if (receipt.getQrCodeData() != null && !receipt.getQrCodeData().isEmpty()) {
                byte[] qrBytes = Base64.getDecoder().decode(receipt.getQrCodeData());
                Image qrImage = Image.getInstance(qrBytes);
                qrImage.setAlignment(Element.ALIGN_CENTER);
                qrImage.scaleToFit(120, 120);
                qrImage.setSpacingBefore(15);
                document.add(qrImage);
            }

            Paragraph sig = new Paragraph("Digital Warden Approval Signature:\n" + receipt.getWardenDigitalSignature(), labelFont);
            sig.setAlignment(Element.ALIGN_CENTER);
            sig.setSpacingBefore(15);
            document.add(sig);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, labelFont));
        cell1.setPadding(6);
        PdfPCell cell2 = new PdfPCell(new Phrase(value, valueFont));
        cell2.setPadding(6);
        table.addCell(cell1);
        table.addCell(cell2);
    }
}
