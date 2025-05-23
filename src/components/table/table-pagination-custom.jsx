import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

// ----------------------------------------------------------------------

export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  ...other
}) {
  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{ borderTopColor: 'transparent' }}
      />

      {/* {onChangeDense && (
        <FormControlLabel
          label="Щільно"
          control={
            <Switch checked={dense} onChange={onChangeDense} inputProps={{ id: 'dense-switch' }} />
          }
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: { sm: 'absolute' },
          }}
        />
      )} */}
    </Box>
  );
}
