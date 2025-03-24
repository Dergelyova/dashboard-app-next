import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface OrderDetailsCustomerProps {
  name: string;
  email?: string;
  contactNumber: string;
  comment: string;
}

export function OrderDetailsCustomer({ ...props }: OrderDetailsCustomerProps) {
  return (
    <>
      <CardHeader
        title="Клієнт"
        // action={
        //   <IconButton>
        //     <Iconify icon="solar:pen-bold" />
        //   </IconButton>
        // }
      />
      <Box sx={{ p: 3, display: 'flex' }}>
        <Avatar sx={{ width: 48, height: 48, mr: 2 }} />

        <Stack spacing={0.5} sx={{ typography: 'body2', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2">{props.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{props.contactNumber}</Box>
          {!!props.email && <Box sx={{ color: 'text.secondary' }}>{props.email}</Box>}
          {/* 
          <div>
            IP address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.ipAddress}
            </Box>
          </div> */}

          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Box>
    </>
  );
}
