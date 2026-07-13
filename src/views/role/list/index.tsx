'use client'
// MUI Imports
import Grid from '@mui/material/Grid'
import { RolesListProps } from '../type/roleTypes'
import RoleListTable from './RoleListTable'

// Type Imports
// Component Imports

// props



const RoleList = ({ props }: { props: RolesListProps }) => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <RoleListTable props={props} />
            </Grid>
        </Grid>
    )
}

export default RoleList
