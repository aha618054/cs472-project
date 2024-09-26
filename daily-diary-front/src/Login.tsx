import React, { useState,useEffect } from 'react';
import userImg from '../src/assets/images/user.png'
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar
} from '@mui/material';
import { SendOutlined as SendOutlinedIcon } from '@mui/icons-material';


interface LoginProps {
    onLogin: (user: { username: string; name: string }) => void;
  }

const Login = ({ onLogin } :LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const usernameInput = document.querySelector('input[name="username"]');
    if (usernameInput) {
      (usernameInput as HTMLInputElement).focus(); // Set focus on the input
    }
  }, []);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dummyUsers = [
        { uid:101 ,username: 'admin', password: '123', name: 'Admin User' },
        { uid:102 ,username: 'john', password: '123', name: 'John Doe' },
        { uid:103 ,username: 'jane', password: '123', name: 'Jane Doe' },
      ];

      const user = dummyUsers.find(
        (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase() && u.password === password
      );

    
      if (user) {     
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        sessionStorage.setItem('uname',user.username)
        sessionStorage.setItem('uid',user.uid.toString())
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
  };

  return (
      <div>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ m: 2, p: 2 }}>
          <CardHeader 
          avatar={
            <Avatar
              alt="Login Image"
              src={userImg}
            />
          }
          title="Login" />
          <CardContent>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': {
                  mt: 1,
                  mb: 1,
                  width: '100%',
                },
                Button: { mt: 1 },
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={username}
                  placeholder="Enter username"               
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={password}         
                  onChange={(e) => setPassword(e.target.value)}        
                />
              </div>
              <div>         
  
                <Button                
                  variant="contained"
                  startIcon={<SendOutlinedIcon />}
                  type="submit"
                  sx={{ ml: 1, mt: 1 }}
                >
                  Login
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Container>
      </div>
    );
};

export default Login;