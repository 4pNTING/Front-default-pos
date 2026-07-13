import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LineLoader() {
    return (
        <Box sx={{ width: '100%', height: '2px' }}>
            <LinearProgress sx={{ height: '2px' }} />
        </Box>
    );
}