import React from "react";
import { Box, Skeleton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

export default function SkeletonLoader({ num }: { num?: number }) {
    const items = Array.from({ length: num ?? 5 }); // Simulate 5 list items

    return (
        <List>
            {items.map((_, index) => (
                <ListItem key={index} alignItems="center">
                    <ListItemIcon>
                        <Skeleton variant="circular" width={40} height={40} />
                    </ListItemIcon>
                    <ListItemText
                        primary={<Skeleton variant="text" width="60%" />}
                        secondary={<Skeleton variant="text" width="40%" />}
                    />
                </ListItem>
            ))}
        </List>
    );
}