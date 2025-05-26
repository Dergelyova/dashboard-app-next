import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function OrderDetailsToolbar({
  id,
  status,
  backHref,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
  isRefreshing,
}) {
  const popover = usePopover();

  return (
    <Box
      sx={{
        mb: { xs: 3, md: 5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          component={RouterLink}
          href={backHref}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>

        <Typography variant="h4">
          {isRefreshing ? 'Refreshing...' : `Order #${orderNumber}`}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          color="inherit"
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-2-fill" />}
          onClick={popover.onOpen}
        >
          Edit Status
        </Button>

        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuList>
            {statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === status}
                onClick={() => {
                  onChangeStatus(option.value);
                  popover.onClose();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </CustomPopover>
      </Stack>
    </Box>
  );
}
