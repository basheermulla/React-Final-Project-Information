import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function DateFieldComp({ callbackLabelInput }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateField']} sx={{ p: 0 }}>
                <DateField label="Input Purchased Date" onChange={(newDate) => callbackLabelInput(newDate)} />
            </DemoContainer>
        </LocalizationProvider>
    );
}