import React, { useContext, useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { Context } from '@siiges-ui/shared';
import setHandler from '../../utils/handlers/set-anchor';
import StyledBadge from '../../styles/Navbar/MenuNavbarStyle';
import GetFile from '../../utils/handlers/getFile';

export default function MenuNavbar() {
  const { removeAuth, session } = useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [imageUrl, setImageUrl] = useState(null);
  const getProfilePhoto = async () => {
    try {
      GetFile({
        tipoEntidad: 'PERSONA',
        entidadId: session.id,
        tipoDocumento: 'FOTOGRAFIA_PERSONA',
      }, async (url) => {
        if (url) {
          if (!url.startsWith('http')) {
            // eslint-disable-next-line no-param-reassign
            url = `http://${url}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const blob = await response.blob();
          const imageObjectUrl = URL.createObjectURL(blob);
          setImageUrl(imageObjectUrl);
        } else {
          // Manejo cuando la url es null o undefined
          setImageUrl(undefined);
        }
      });
    } catch (error) {
      console.error('Error llamando a GetFile', error);
      // Manejo de errores, puedes definir una URL de imagen por defecto si prefieres
      setImageUrl(undefined);
    }
  };

  useEffect(() => {
    getProfilePhoto();
  }, [session]);
  return (
    <>
      <IconButton
        onClick={(event) => setHandler(setAnchorEl, event.currentTarget)}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-testid="menu-test"
      >
        <Stack direction="row" spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar
              alt={session.nombre}
              src={imageUrl}
            >
              TS
            </Avatar>
          </StyledBadge>
        </Stack>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={() => setHandler(setAnchorEl, null)}
        onClick={() => setHandler(setAnchorEl, null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href="/usuarios/perfilUsuario">
          <MenuItem>
            <Avatar
              alt={session.nombre}
              src={imageUrl}
            >
              TS
            </Avatar>
            {session.nombre}
          </MenuItem>
        </Link>
        <Divider />
        <Link href="/notificaciones">
          <MenuItem>
            <ListItemIcon>
              <MarkEmailUnreadOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Notificaciones
          </MenuItem>
        </Link>
        <Link href="/">
          <MenuItem onClick={() => removeAuth()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
