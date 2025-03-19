// src/app/components/Sidebar.tsx
"use client";

import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid #ccc',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Image
            src="https://assets-global.website-files.com/6222ca42ea87e1bd1aa1d10c/62242940556df4e8146db519_white-logo.svg"
            alt="Harness logo"
            width={100}
            height={40}
          />
        </Box>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { xs: 'block', md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'black',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
            href="https://app.harness.io/auth/#/signup"
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: 'white',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': { borderColor: '#f0f0f0', color: '#f0f0f0' },
            }}
            href="https://www.harness.io/company/contact-sales"
          >
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Sidebar;