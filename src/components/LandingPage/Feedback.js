import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
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
import featureShape2 from '../../assets/images/LandingPage/objects/bnbchain.svg';
import Snackbar from '../../utils/Snackbar';
import { secureInputHandler } from '../../utils/inputSanitizer';

// Define the orbiting animation
const orbitAnimation = keyframes`
  0% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
  }
  50% {
    transform: rotate(180deg) translateX(50px) rotate(-180deg);
  }
  100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
  }
`;

// Styled component for the orbiting image
const OrbitingImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: '10%',
  left: '0%',
  transform: 'translate(-50%, -50%)',
  width: '50px',
  height: 'auto',
  animation: `${orbitAnimation} 10s linear infinite`,
  pointerEvents: 'none',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    width: '150px',
    height: 'auto',
  },
}));

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

  React.useEffect(() => {
    const buttons = document.querySelectorAll('.rotating-gradient-wrapper');

    buttons.forEach((button, index) => {
      let angle = 0;

      const updateAnimation = () => {
        angle = (angle + 1) % 360;
        button.style.setProperty('--angle', `${angle + index * 120}deg`);
        requestAnimationFrame(updateAnimation);
      };

      button.style.setProperty('--angle', '0deg');
      requestAnimationFrame(updateAnimation);
    });
  }, []);

  const showSnackBar = (message, severity) => {
    Snackbar.handleShowSnackBar(message, severity);
  };

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const maxLength = parseInt(dataset.maxlength, 10) || 12; // Default to 12 if not provided

    // Apply the secure input handler logic
    const sanitizedValue = secureInputHandler(
      value,
      maxLength, // Max length
      /[a-zA-Z0-9 ]/g, // Allowed pattern
      showSnackBar
    );
  
    // Update the state with the sanitized value
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validation for required fields
    if (!formData.name.trim()) {
      setLoading(false);
      showSnackBar('Name cannot be empty.', 'warning');
      return;
    }

    if (!formData.email.trim()) {
      setLoading(false);
      showSnackBar('Email cannot be empty.', 'warning');
      return;
    }

    if (!formData.message.trim()) {
      setLoading(false);
      showSnackBar('Message cannot be empty.', 'warning');
      return;
    }

    if (!feedbackType.trim()) {
      setLoading(false);
      showSnackBar('Feedback type cannot be empty.', 'warning');
      return;
    }

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
      showSnackBar('Thank you for your feedback!','success');
      setFormData({ name: '', email: '', message: '', fileUrl: '' });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error sending email:', error.text);
      }
      showSnackBar('Failed to send feedback. Please try again later','error');
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
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -10,
          }}
        >
          <OrbitingImage src={featureShape2} alt="Orbiting Decoration" sx={{ filter: 'hue-rotate(160deg)' }} />
        </Box>
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
            variant="gradientText"
            gutterBottom
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
          width: '100%',
        }}
      >
            <Grid item xs={12} md={6} lg={10}>
              <Card
                  className="rotating-color"
                  sx={(theme) => ({
                    p: 3,
                    boxShadow: '0 8px 12px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    border: '1px solid transparent',
                    background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box, linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main}) border-box`,  
                  })}
              >
                  <CardContent>
                  <Box component="form" sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField 
                      id="filled-basic" 
                      name="name"
                      fullWidth
                      required
                      onChange={handleInputChange}      
                      inputProps={{
                        maxLength: 12,
                      }} 
                      value={formData.name}
                      label="Your Name" 
                      variant="filled" 
                      sx={{
                        '& .MuiFilledInput-root': {
                          backgroundColor: (theme) => theme.palette.action.hover, // Set custom background color
                          borderRadius: '4px', // Optional: Rounded corners
                          '&:hover': {
                            //backgroundColor: '#2c2c2c', // Darker background on hover
                            backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                          },
                          '&.Mui-focused': {
                            backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
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
                          backgroundColor: (theme) => theme.palette.action.hover, // Set custom background color
                          borderRadius: '4px', // Optional: Rounded corners
                          '&:hover': {
                            //backgroundColor: '#2c2c2c', // Darker background on hover
                            backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                          },
                          '&.Mui-focused': {
                            backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
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
                        backgroundColor: (theme) => theme.palette.action.hover, // Set custom background color
                        borderRadius: '4px', // Optional: Rounded corners
                        '&:hover': {
                          //backgroundColor: '#2c2c2c', // Darker background on hover
                          backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                        },
                        '&.Mui-focused': {
                          backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                        },
                      },
                    }}                
                  >
                    <InputLabel id="demo-simple-select-filled-label">Feedback Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={feedbackType}
                      onChange={(e) => {
                        secureInputHandler(
                          e.target.value,
                          12, // Max length
                          /[a-zA-Z0-9 ]/g, // Allowed pattern
                          showSnackBar,
                          setFeedbackType // Callback to update state
                        );      
                      }}      
                      inputProps={{
                        maxLength: 12,
                      }}
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
                    inputProps={{ 'data-maxlength': '2000' }} // Place `data-maxlength` here
                    sx={{
                      marginBottom: '16px',
                      '& .MuiFilledInput-root': {
                        backgroundColor: (theme) => theme.palette.action.hover, // Set custom background color
                        borderRadius: '4px', // Optional: Rounded corners
                        '&:hover': {
                          //backgroundColor: '#2c2c2c', // Darker background on hover
                          backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                        },
                        '&.Mui-focused': {
                          backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                        },
                      },
                    }}                         
                  />
                  <TextField 
                    id="filled-basic" 
                    name="fileUrl"
                    fullWidth
                    onChange={handleInputChange}
                    inputProps={{ 'data-maxlength': '100' }} // Place `data-maxlength` here
                    value={formData.fileUrl}
                    label="Attachment URL" 
                    variant="filled" 
                    helperText="upload to https://prnt.sc/ and paste the URL in the input above"
                    sx={{
                      '& .MuiFilledInput-root': {
                        backgroundColor: (theme) => theme.palette.action.hover, // Set custom background color
                        borderRadius: '4px', // Optional: Rounded corners
                        '&:hover': {
                          //backgroundColor: '#2c2c2c', // Darker background on hover
                          backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                        },
                        '&.Mui-focused': {
                          backgroundColor: (theme) => theme.palette.background.default, // Set custom background color
                        },
                      },
                    }}
                  />
                  <Divider sx={{ marginBottom: '20px'}} />
                  </CardContent>
                  <CardActions>
                    <Box
                      className="rotating-gradient-wrapper"
                      sx={(theme) => ({
                        width: '100%',
                        display: 'inline-block',
                        padding: '1px', // Space for the gradient border
                        borderRadius: '8px',
                        background: `linear-gradient(var(--angle, 0deg), #07e6f5, ${theme.palette.primary.main})`,
                      })}
                    >
                      <Button
                          fullWidth
                          endIcon={<SendIcon />}
                          onClick={handleSubmit}
                          disabled={loading}
                          sx={{
                            borderRadius: '8px',
                            background: (theme) => `${theme.palette.background.default} !important`,
                            color: (theme) => theme.palette.text.primary,
                            '&:hover': {
                              background: (theme) => `${theme.palette.action.hover} !important`,
                            },
                          }}
                      >
                          {loading ? 'Submitting...' : 'Submit Feedback'}
                      </Button>
                    </Box>
                  </CardActions>
              </Card>
            </Grid>
      </Grid>
    </Container>
  );
}
