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
import React from "react";

function TermsDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="terms-dialog"
    >
      <DialogTitle>Terms and Conditions – NUD Assess</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "70vh" }}>
        <DialogContentText>
          <Stack rowGap={2}>
            <Typography variant="body1">Effective Date: 09/23/2025</Typography>
            <Typography variant="body1">
              Welcome to NUD Assess, a digital platform developed for the
              exclusive use of NU-Dasma faculty, students, and administrators.
              By accessing or using NUD Assess, you agree to the following terms
              and conditions.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              1. User Roles and Responsibilities
            </Typography>
            <Typography variant="body2">
              Faculty (Teachers): May create, manage, and assign quizzes and
              exams using the platform.
            </Typography>
            <Typography variant="body2">
              Students: May access assigned exams and submit responses via the
              mobile app.
            </Typography>
            <Typography variant="body2">
              Admins (Program Chairs): May manage faculty subject loads,
              department assignments, and permissions.
            </Typography>
            <Typography variant="body2">
              All users must use their official NU-Dasma organizational email to
              register and access the platform.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              2. Platform Features
            </Typography>
            <Typography variant="body2">
              NUD Assess uses generative AI (Google Gemini) to create Bloom’s
              Taxonomy-aligned quizzes based on uploaded reference materials.
            </Typography>
            <Typography variant="body2">
              Faculty may upload reference materials (e.g., documents, PDFs) to
              generate AI-powered quizzes.
            </Typography>
            <Typography variant="body2">
              Faculty may also attach images to individual questions to enhance
              clarity or context.
            </Typography>
            <Typography variant="body2">
              Admins may restrict faculty access to AI-powered features at their
              discretion.
            </Typography>
            <Typography variant="body2">
              Anti-cheating mechanisms are embedded in the mobile app, including
              screen-switch detection and screenshot prevention.
            </Typography>
            <Typography variant="body2">
              Real-time notifications are delivered to students via Firebase
              Cloud Messaging.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              3. Content Ownership
            </Typography>
            <Typography variant="body2">
              All AI-generated content, including quizzes and questions, is the
              intellectual property of NUD Assess and NU-Dasma.
            </Typography>
            <Typography variant="body2">
              Faculty may export quiz content for educational use within
              NU-Dasma.
            </Typography>

            <Typography variant="body1" color="black" fontWeight={600}>
              4. Usage Restrictions
            </Typography>
            <Typography variant="body2">
              Users must not misuse the platform for unauthorized activities,
              including cheating, data tampering, or content redistribution
              outside NU-Dasma.
            </Typography>
            <Typography variant="body2">
              Uploaded reference materials and images must comply with copyright
              laws and institutional guidelines. Users must not upload content
              that is illegal, plagiarized, or violates third-party rights.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              5. Payment and Licensing
            </Typography>
            <Typography variant="body2">
              The platform is free for individual users.
            </Typography>
            <Typography variant="body1" color="black" fontWeight={600}>
              6. Dispute Resolution
            </Typography>
            <Typography variant="body2">
              Disputes or violations of these terms will first be forwarded to
              the Disciplinary Office of NU-Dasma for review and resolution. If
              necessary, further action may be taken in accordance with
              institutional policies and applicable laws of the Republic of the
              Philippines.
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

export default TermsDialog;
