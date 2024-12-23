import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import SendIcon from '@mui/icons-material/Send';
import emailjs from 'emailjs-com';

const feedbackTypes = [
  { value: 'general', label: 'General Feedback' },
  { value: 'bug', label: 'Report a Bug' },
  { value: 'feature', label: 'Feature Request' },
];

export default function FeedbackSection() {
  const [feedbackType, setFeedbackType] = React.useState('general');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
    file: null,
  });
  const [loading, setLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    const serviceID = 'service_ladobfs';
    const templateID = 'template_lu95uf3';
    const userID = '0q-Ph8kYZfFzalaBU';

    const templateParams = {
      to_name: 'TCA_Admin',
      from_name: formData.name,
      from_email: formData.email,
      feedback_type: feedbackType,
      message: formData.message,
      file_link: formData.fileUrl || 'No file attached',
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, userID);
      setSuccessMessage('Thank you for your feedback!');
      setFormData({ name: '', email: '', message: '', fileUrl: '' });
    } catch (error) {
      console.error('Error sending email:', error.text);
      setSuccessMessage('Failed to send feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
        id="feedback"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
        >
        <Box
            sx={{
            textAlign: 'center',
            width: { xs: '100%', md: '60%' },
            }}
        >
            <Typography
            component="h2"
            variant="h4"
            gutterBottom
            sx={{ color: 'text.primary' }}
            >
            We Value Your Feedback
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Share your thoughts and help us improve. Your feedback matters to us.
            </Typography>
        </Box>

        <Grid
            container
            spacing={3}
            sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
            <Grid item xs={12} md={6}>
            <Card
                sx={{
                p: 3,
                boxShadow: '0 8px 12px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'divider',
                }}
            >
                <CardContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                    fullWidth
                    name="name"
                    label="Your Name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    sx={{ '& .MuiInputBase-input': { color: 'text.primary' } }}
                    />
                    <TextField
                    fullWidth
                    name="email"
                    label="Your Email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    sx={{ '& .MuiInputBase-input': { color: 'text.primary' } }}
                    />
                </Box>
                <TextField
                    fullWidth
                    select
                    label="Feedback Type"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                >
                    {feedbackTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    name="message"
                    label="Your Message"
                    multiline
                    variant="outlined"
                    value={formData.message}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    name="fileUrl"
                    label="Attachment URL"
                    placeholder="Paste your image URL here"
                    variant="outlined"
                    value={formData.fileUrl}
                    onChange={handleInputChange}
                    sx={{
                    mb: 2,
                    '& .MuiInputBase-input': { color: 'text.primary' },
                    '& .MuiFormLabel-root': { fontSize: '0.9rem', color: 'text.secondary' },
                    }}
                />
                <Typography
                    variant="caption"
                    sx={{
                    display: 'block',
                    color: 'text.secondary',
                    textAlign: 'center',
                    mt: 1,
                    }}
                >
                    If you want to include a file, upload it to{' '}
                    <Typography
                    component="a"
                    href="https://prnt.sc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                    https://prnt.sc/
                    </Typography>{' '}
                    and paste the URL in the input above.
                </Typography>
                <Divider sx={{ marginBottom: '20px'}} />
                </CardContent>
                <CardActions>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                </CardActions>
                {successMessage && (
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 2, color: loading ? 'text.disabled' : 'success.main' }}
                >
                    {successMessage}
                </Typography>
                )}
            </Card>
            </Grid>
        </Grid>
    </Container>
  );
}
