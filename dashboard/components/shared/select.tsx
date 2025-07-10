import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Box
} from '@mui/material';
import { Option } from '@/lib/interfaces/options';



interface SelectProps {
    label: string;
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    fullWidth?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium';
}

function CustomSelect({
    label,
    options,
    value,
    onChange,
    fullWidth = true,
    disabled = false,
    size = 'medium'
}: SelectProps) {
    const handleChange = (event: SelectChangeEvent<typeof value>) => {
        onChange(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120, my: 1 }}>
            <FormControl fullWidth={fullWidth} size={size}>
                <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
                <Select
                    labelId={`select-label-${label}`}
                    id={`select-${label}`}
                    value={value}
                    label={label}
                    onChange={handleChange}
                    disabled={disabled}
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CustomSelect;