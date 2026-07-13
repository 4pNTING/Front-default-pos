// // React Imports

// // MUI Imports
// import Box from '@mui/material/Box'
// import IconButton from '@mui/material/IconButton'

// // Third-party Imports
// import { useDropzone } from 'react-dropzone'
// import CustomAvatar from '@/@core/components/mui/Avatar'
// import { useEmployeeStore } from '@/views/employee/store/employeeStore'


// const ProfileImageSelect = () => {
//     // States
//     const { toUpdateProfile, setToUpdateProfile } = useEmployeeStore();

//     // Hooks
//     const { getRootProps, getInputProps } = useDropzone({
//         multiple: false,
//         accept: {
//             'image/*': ['.png', '.jpg', '.jpeg']
//         },
//         onDrop: (acceptedFiles: File[]) => {
//             setToUpdateProfile(acceptedFiles[0]);
//         }
//     })

//     return (
//         <Box
//             {...getRootProps({ className: 'dropzone' })}
//             {...(toUpdateProfile && { sx: { height: 450 } })}
//             sx={{ position: 'relative', display: 'inline-block' }}
//         >
//             <input {...getInputProps()} />
//             {toUpdateProfile ? (
//                 <img style={{ width: 120, height: 120, borderRadius: '50%' }} key={toUpdateProfile?.name ?? "profile"} alt={toUpdateProfile?.name ?? "profile"} className='single-file-image' src={URL.createObjectURL(toUpdateProfile as any)} />
//             ) : (
//                 <CustomAvatar sx={{ cursor: "pointer" }} alt='user-profile' src={''} variant='circular' size={120}>
//                     <i className='tabler-user' style={{ fontSize: '90px', color: '#555' }} />
//                 </CustomAvatar>
//             )}
//             {/* Edit Icon */}
//             <IconButton
//                 size='small'
//                 sx={{
//                     position: 'absolute',
//                     bottom: 3,
//                     right: 3,
//                     backgroundColor: '#fff',
//                     borderRadius: '50%',
//                     boxShadow: 1
//                 }}
//             >
//                 <i className='tabler-edit' style={{ fontSize: '18px', color: '#555' }} />
//             </IconButton>
//         </Box>
//     )
// }

// export default ProfileImageSelect