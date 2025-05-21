import { useState } from 'react';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { formatPatterns } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function PickerDateTime() {
  const [value, setValue] = useState(null);

  return (
    <DateTimePicker
      value={value}
      onChange={(newValue) => setValue(newValue)}
      format={formatPatterns.dateTime}
    />
  );
}
