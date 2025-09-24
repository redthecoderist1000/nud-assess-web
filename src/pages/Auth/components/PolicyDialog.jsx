import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

function PolicyDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Privacy Policy - NUD Assess</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "70vh" }}>
        <DialogContentText>
          <Stack rowGap={2}>
            <Typography variant="body1">Effective Date: 09/23/2025</Typography>
            <Typography variant="body1">
              NUD Assess is committed to protecting your privacy. This policy
              outlines how we collect, use, and safeguard your personal
              information.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              1. Information We Collect
            </Typography>
            <Typography variant="body2">
              Personal Data: Name and NU-Dasma organizational email address.
            </Typography>
            <Typography variant="body2">
              Uploaded Content: Reference materials and images submitted by
              faculty for quiz generation or question enhancement.
            </Typography>
            <Typography variant="body2">
              Usage Data: Activity logs related to quiz creation, exam
              participation, and platform interactions.
            </Typography>
            <Typography variant="body2">
              Classlist: Generated classlist from NUIS, containing class
              information and enrolled students.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              2. How We Use Your Data
            </Typography>
            <Typography variant="body2">
              To authenticate users and manage access.
            </Typography>
            <Typography variant="body2">
              Uploaded reference materials are used solely for generating
              educational content via AI models.
            </Typography>
            <Typography variant="body2">
              Images attached to questions are stored securely and used only
              within the context of assigned exams.
            </Typography>
            <Typography variant="body2">
              To generate AI-powered quizzes based on uploaded materials.
            </Typography>
            <Typography variant="body2">
              To maintain academic integrity through anti-cheat features.
            </Typography>
            <Typography variant="body2">
              To deliver real-time notifications via Firebase Cloud Messaging.
            </Typography>
            <Typography variant="body2">
              Imported classlists are only used to automatically create class
              and add members and are not stored in the system.
            </Typography>

            <Typography variant="body1" color="black" fontWeight={600}>
              3. Data Storage and Security
            </Typography>
            <Typography variant="body2">
              Data is stored securely using Supabase, which provides database
              and authentication services.
            </Typography>
            <Typography variant="body2">
              Uploaded images are stored in Supabase with the same security
              protocols as personal data.
            </Typography>
            <Typography variant="body2">
              We implement industry-standard security protocols to protect your
              data.
            </Typography>

            <Typography variant="body1" color="black" fontWeight={600}>
              4. Data Sharing
            </Typography>
            <Typography variant="body2">
              We do not share personal data with third parties.
            </Typography>
            <Typography variant="body2">
              AI services are provided via Google Gemini and Vertex AI, but no
              personal data is transmitted to these services.
            </Typography>

            <Typography variant="body1" color="black" fontWeight={600}>
              5. User Rights
            </Typography>
            <Typography variant="body2">
              Users may update their name and password via the platform.
            </Typography>
            <Typography variant="body2">
              Account deletion is not permitted to preserve academic records and
              institutional integrity.
            </Typography>

            <Typography variant="body1" color="black" fontWeight={600}>
              6. Cookies and Tracking
            </Typography>
            <Typography variant="body2">
              NUD Assess does not use cookies or tracking technologies.
            </Typography>

            <Typography variant="body1" color="black" fontWeight={600}>
              7. Children’s Data
            </Typography>
            <Typography variant="body2">
              Students under 18 may use the platform only if they are enrolled
              in NU-Dasma’s Senior High School or College programs.
            </Typography>
            <Typography variant="body2">
              Use of the platform implies institutional consent.
            </Typography>
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PolicyDialog;
