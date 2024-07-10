import React from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Grid } from '@mui/material/';
import Typography from '@mui/material/Typography';
import { Button } from './Button';
import Box from '@mui/material/Box';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Web3Provider } from "../providers/Web3Provider";
import { ConnectKitButton } from "connectkit";
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    const theme = useTheme();

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    height: '60px',
                    width: '100%',
                    backgroundColor: 'white',
                    paddingY: '0px',
                    boxShadow: {
                        xs: 'none', // No box shadow on small screens
                        md: '0px 1px 7px rgba(0, 0, 0, 0.02)', // Box shadow on medium and larger screens
                    },
                    zIndex: '10',
                    position: 'relative',
                    borderBottom: '0.5px solid black',
                    paddingX: {xs:'20px', sm:'5px', md:'0px'}
                }}
            >
                <Grid container sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Grid item xs={4} sm={2} sx={{ borderRight: '1px solid black', paddingY: '10px' }}>
                        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: {xs:'left', md:'center'} }}>
                            <MailOutlineIcon style={{ fill: '#000000', marginRight: '10px' }} />
                            <Link to='/'>
                                <Typography variant="h6" color="black">ZKEmail Recovery</Typography>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item sm={6} sx={{ display: { xs: 'none', sm: 'flex' }, borderRight: '0.5px solid black', paddingLeft: '25px', paddingY: '10px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="primary" href='https://prove.email/blog' target='_blank' sx={{ marginRight: theme.spacing(2), textTransform: 'none' }}>Blog</Button>
                            <Button color="primary" href='https://zkemail.gitbook.io/zk-email' target='_blank' sx={{ marginRight: theme.spacing(2), textTransform: 'none' }}>Docs</Button>
                            <Button color="primary" href='https://prove.email/' target='_blank' sx={{ marginRight: theme.spacing(2), textTransform: 'none' }}>Demos</Button>
                            <Button color="primary" href='https://t.me/zkemail' target='_blank' sx={{ marginRight: theme.spacing(2), textTransform: 'none' }}>Contact</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={4} sx={{ paddingY: '10px', display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant="outlined"
                                href='https://prove.email/blog/recovery'
                                target='_blank'
                                sx={{
                                    display: { xs: 'none', lg: 'block' },
                                    marginRight: theme.spacing(2),
                                    textTransform: 'none',
                                    borderRadius: '26px',
                                    ':hover': {
                                        backgroundColor: '#E0F6FF', // Background color on hover
                                    },
                                    ':focus': {
                                        outline: 'none', // Remove outline on focus
                                    },
                                    ':active': {
                                        outline: 'none', // Remove outline on active
                                    }
                                }}>Learn More</Button>
                            <Web3Provider>
                                <ConnectKitButton />
                            </Web3Provider>
                        </Box>
                    </Grid>
                </Grid>
            </AppBar>
        </>
    );
};

export default NavBar;
