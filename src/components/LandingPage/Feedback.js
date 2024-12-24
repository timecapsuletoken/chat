import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
          maxWidth: { xs: '100%', md: '1200px' }, // Adjust maxWidth for larger screens
          width: '100%',
        }}
        >
        <Box
            sx={{
            textAlign: 'center',
            width: '100%',
            maxWidth: { xs: '100%', md: '60%', lg: '90%' }, // Larger grid on large screens
            mx: 'auto', // Center horizontally
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
        //spacing={3}
        sx={{ 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%' 
        }}
      >
            <Grid item xs={12} md={6} lg={10}>
              <Card
                  sx={{
                  p: 3,
                  boxShadow: '0 8px 12px rgba(0,0,0,0.1)',
                  border: '1px solid',
                  borderColor: 'divider',
                  }}
              >
                  <CardContent>
                  <Box component="form" sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField 
                      id="filled-basic" 
                      name="name"
                      fullWidth
                      required
                      onChange={handleInputChange}
                      value={formData.name}
                      label="Your Name" 
                      variant="filled" 
                      sx={{
                        '& .MuiFilledInput-root': {
                          backgroundColor: '#1c1c1c', // Set custom background color
                          borderRadius: '4px', // Optional: Rounded corners
                          '&:hover': {
                            backgroundColor: '#2c2c2c', // Darker background on hover
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#1c1c1c', // Keep background consistent when focused
                          },
                        },
                      }}
                    />
                    <TextField
                      id="filled-basic"
                      variant="filled"
                      fullWidth
                      name="email"
                      label="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      sx={{
                        '& .MuiFilledInput-root': {
                          backgroundColor: '#1c1c1c', // Set custom background color
                          borderRadius: '4px', // Optional: Rounded corners
                          '&:hover': {
                            backgroundColor: '#2c2c2c', // Darker background on hover
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#1c1c1c', // Keep background consistent when focused
                          },
                        },
                      }}
                    />
                  </Box>
                  <FormControl 
                    variant="filled" 
                    fullWidth 
                    required 
                    sx={{
                      mb: 2,
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#1c1c1c', // Set custom background color
                        borderRadius: '4px', // Optional rounded corners
                        '&:hover': {
                          backgroundColor: '#2c2c2c', // Darker background on hover
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#1c1c1c', // Keep background consistent on focus
                        },
                      },
                    }}                
                  >
                    <InputLabel id="demo-simple-select-filled-label">Feedback Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                    >
                      {feedbackTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    required
                    name="message"
                    id="outlined-multiline-static"
                    label="Your Message"
                    multiline
                    rows={4}
                    value={formData.message}
                    variant="filled"
                    onChange={handleInputChange}
                    sx={{
                      marginBottom: '16px',
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#1c1c1c', // Set custom background color
                        borderRadius: '4px', // Add rounded corners
                        '&:hover': {
                          backgroundColor: '#2c2c2c', // Change background on hover
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#1c1c1c', // Keep background consistent on focus
                        },
                      },
                    }}                         
                  />
                  <TextField 
                    id="filled-basic" 
                    name="fileUrl"
                    fullWidth
                    onChange={handleInputChange}
                    value={formData.fileUrl}
                    label="Attachment URL" 
                    variant="filled" 
                    helperText="upload to https://prnt.sc/ and paste the URL in the input above"
                    sx={{
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#1c1c1c', // Set custom background color
                        borderRadius: '4px', // Optional: Rounded corners
                        '&:hover': {
                          backgroundColor: '#2c2c2c', // Darker background on hover
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#1c1c1c', // Keep background consistent when focused
                        },
                      },
                    }}
                  />
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
