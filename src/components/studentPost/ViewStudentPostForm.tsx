'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Container, Snackbar, SnackbarContent, IconButton, Divider, Paper, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StudentPostSchema } from '@/src/schemas';
import { z } from 'zod';

interface ViewStudentPostProps {
  studentPost: z.infer<typeof StudentPostSchema> | null;
}

const ViewStudentPost: React.FC<ViewStudentPostProps> = ({ studentPost }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (success === 'true') {
      setOpenSnackbar(true);
    }
  }, [success]);

  if (!studentPost) {
    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography component="h1" variant="h5">
            My Post
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            You have not created any posts yet. Create your first post to engage your audience.
          </Typography>
          <Button onClick={() => router.push('/post/edit')} variant="contained" sx={{ mt: 3 }}>
            Create Your First Post
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            My CV
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {studentPost.isActive ? 'Active' : 'Inactive'}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 4 }}>
            {studentPost.content}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Work Experiences
            </Typography>
            <Divider />
            {studentPost.workExperiences?.map((experience, index) => (
              <Box key={index} sx={{ marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {/* Work Experience #{index + 1} */}
                </Typography>
                <Typography variant="body2">
                  <strong>Company:</strong> {experience.company}
                </Typography>
                <Typography variant="body2">
                  <strong>Position:</strong> {experience.position} - {experience.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {experience.startDate} to {experience.endDate}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Education
            </Typography>
            <Divider />
            {studentPost.education?.map((edu, index) => (
              <Box key={index} sx={{ marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {/* Education #{index + 1} */}
                </Typography>
                <Typography variant="body2">
                  <strong>Degree:</strong> {edu.degree} - {edu.institution}
                </Typography>
                <Typography variant="body2">
                  <strong>Graduation Year:</strong> {edu.yearOfGraduation}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Skills
            </Typography>
            <Divider />
            {studentPost.skills?.map((skill, index) => (
              <Box key={index} sx={{ marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {/* Skill #{index + 1} */}
                </Typography>
                <Typography variant="body2">
                  <strong>Skill:</strong> {skill.skillName}
                </Typography>
                <Typography variant="body2">
                  <strong>Level:</strong> {skill.level}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button onClick={() => router.push('/post/edit')} variant="contained">
            Edit
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          message="Post updated successfully!"
          sx={{ backgroundColor: 'green' }}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </Container>
  );
};

export default ViewStudentPost;
