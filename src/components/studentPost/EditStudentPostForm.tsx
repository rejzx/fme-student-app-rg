'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { Box, Button, Container, Switch, TextField, Typography, Snackbar, IconButton } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { StudentPostSchema } from '@/src/schemas';
import { createOrUpdatePost } from '@/src/actions/createOrUpdatePost';

interface EditStudentPostFormProps {
  studentPost: z.infer<typeof StudentPostSchema> | null;
}

const EditStudentPostForm = ({ studentPost }: EditStudentPostFormProps) => {
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  // Initialize the form with default values based on existing post data or defaults for new post
  const { register, handleSubmit, setValue, formState: { errors }, reset, control } = useForm<z.infer<typeof StudentPostSchema>>({
    resolver: zodResolver(StudentPostSchema),
    defaultValues: studentPost || {
      content: '',
      isActive: true,
      education: [],
      workExperiences: [],
      skills: []
    }
  });

  const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({ control, name: "workExperiences" });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });

  // Set form values when the studentPost is available or updated
  useEffect(() => {
    if (studentPost) {
      setValue('content', studentPost.content);
      setValue('isActive', studentPost.isActive);
      setValue('id', studentPost.id);
      setValue('education', studentPost.education);
      setValue('workExperiences', studentPost.workExperiences);
      setValue('skills', studentPost.skills);
    }
  }, [studentPost, setValue]);

  const onSubmit = async (data: z.infer<typeof StudentPostSchema>) => {
    const { id, ...postData } = data;
    const response = await createOrUpdatePost({ ...postData, id });
    if (response.success) {
      router.push('/post?success=true'); // Navigate with success query parameter
      router.refresh();
    } else {
      setMessage(response.error || 'Failed to update the post');
      setOpenSnackbar(true); // Open the snackbar on error
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {studentPost ? 'Edit Post' : 'Create Post'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="content"
            label="Content"
            multiline
            rows={4}
            {...register('content')}
            error={Boolean(errors.content)}
            helperText={(errors.content && typeof errors.content.message === 'string') ? errors.content.message : ''}
          />
          {workExperienceFields.map((field, index) => (
            <Box key={field.id}>
              <TextField {...register(`workExperiences.${index}.company`)} label="Company" fullWidth margin="normal" />
              <TextField {...register(`workExperiences.${index}.position`)} label="Position" fullWidth margin="normal" />
              <TextField {...register(`workExperiences.${index}.location`)} label="Location" fullWidth margin="normal" />
              <TextField {...register(`workExperiences.${index}.startDate`)} label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
              <TextField {...register(`workExperiences.${index}.endDate`)} label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
              <IconButton onClick={() => removeWorkExperience(index)}><RemoveCircleOutlineIcon /></IconButton>
            </Box>
          ))}
          <Button type="button" onClick={() => appendWorkExperience({ company: '', position: '', location: '', startDate: '', endDate: '' })} startIcon={<AddCircleOutlineIcon />}>
            Add Work Experience
          </Button>
          {educationFields.map((field, index) => (
            <Box key={field.id}>
              <TextField {...register(`education.${index}.degree`)} label="Degree" fullWidth margin="normal" />
              <TextField {...register(`education.${index}.institution`)} label="Institution" fullWidth margin="normal" />
              <TextField 
                {...register(`education.${index}.yearOfGraduation`, { valueAsNumber: true })} // Ensure this is handled as a number
                label="Year of Graduation" 
                fullWidth 
                margin="normal" 
                type="number" // Ensure this is a number input
              />
              <IconButton onClick={() => removeEducation(index)}><RemoveCircleOutlineIcon /></IconButton>
            </Box>
          ))}
          <Button type="button" onClick={() => appendEducation({ degree: '', institution: '', yearOfGraduation: new Date().getFullYear() })} startIcon={<AddCircleOutlineIcon />}>
            Add Education
          </Button>
          {skillFields.map((field, index) => (
            <Box key={field.id}>
              <TextField {...register(`skills.${index}.skillName`)} label="Category" fullWidth margin="normal" />
              <TextField {...register(`skills.${index}.level`)} label="Level" fullWidth margin="normal" />
              <IconButton onClick={() => removeSkill(index)}><RemoveCircleOutlineIcon /></IconButton>
            </Box>
          ))}
          <Button type="button" onClick={() => appendSkill({ skillName: '', level: '' })} startIcon={<AddCircleOutlineIcon />}>
            Add Skill
          </Button>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                checked={field.value}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {studentPost ? 'Update Post' : 'Create Post'}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: 'red' } }}  // Style the Snackbar content in red
      />
    </Container>
  );
};

export default EditStudentPostForm;
