import AppRoutes from "./routes/AppRoutes";
import React, { useState, useEffect } from 'react';
import Login from './Login'
import {
    Container,
    Card,  
    CardContent, 
    Button,   
  } from '@mui/material';
  import { ExitToApp as ExitToAppIcon, } from '@mui/icons-material';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ username: string; name: string } | null>(null);

    useEffect(() => {
        const authStatus = sessionStorage.getItem('isAuthenticated');
        const loggedInUser = sessionStorage.getItem('loggedInUser');        
        
        if (authStatus === 'true' && loggedInUser) {
          setIsAuthenticated(true);
          setCurrentUser(JSON.parse(loggedInUser)); 
        }
      }, []);
  

      const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('uname')
        sessionStorage.removeItem('uid')

        setIsAuthenticated(false);
        setCurrentUser(null);
    
      };
      
      const handleLogin = (user: { username: string; name: string }) => {
        setIsAuthenticated(true);
        setCurrentUser(user);
      };


    return (
        <div className="App">
            {isAuthenticated ? (
           <div>      
                <AppRoutes />        
                <Container maxWidth="xl">
                    <Card  sx={{ m: 2, p: 2 }}>             
                        <CardContent>
                        <Button         
                        onClick={handleLogout}       
                        variant="contained"
                        startIcon={<ExitToAppIcon />}                  
                        sx={{ ml: 1, mt: 1 }}
                        >
                        Logout
                        </Button>
                    
                        </CardContent>
                    </Card>
                </Container>        
          </div>
          ) : (
             <Login onLogin={handleLogin} />
         )}
        </div>
    );
}

export default App;
