// // React Imports

// // MUI Imports
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// // MUI Imports
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';

// // Third-party Imports
// import { useForm, Controller } from 'react-hook-form';

// // Component Imports
// import CustomTextField from '@core/components/mui/TextField';
// import { useLazyQuery, useMutation } from '@apollo/client';
// import { useEffect } from 'react';
// import { Autocomplete, InputAdornment } from '@mui/material';
// import classNames from 'classnames';
// import { RolesFormProps } from '../type/roleTypes';
// import { useRoleStore } from '../store/roleStore';
// import { CreateRoleInput } from '@/gql/models/graphql';

// // Vars
// const initialData = {
//   laName: '',
//   enName: '',
//   systemCode: '',
//   menus: [],
// };
// const FormCreateRole = (props: RolesFormProps) => {
//   // hook
//   const [mutatePos] = useMutation('' as any);
//   const [levelQuery] = useLazyQuery('' as any, {
//     fetchPolicy: 'network-only',
//   });
//   //   const { levels, loading: loadingLevel, queryLevel } = useLevelStore();
//   // Props
//   const { handleClose, dictionary, lang } = props;
//   const dic = dictionary;
//   // Hooks
//   const {
//     control,
//     reset,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CreateRoleInput>({
//     defaultValues: initialData,
//   });

//   const { loading } = useRoleStore((state) => state);

//   const onSubmit = (value: CreateRoleInput) => {
//     // submitPosition({ form: value, props: { ...props, mutatePosition: mutatePos, onSuccess: handleReset } });
//   };

//   const handleReset = () => {
//     reset(initialData);
//     handleClose();
//   };

//   useEffect(() => {
//     queryLevel({
//       props: { queryLevel: levelQuery, dictionary: props.dictionary },
//     });
//   }, []);

//   return (
//     <div className="w-screen h-screen max-w-[650px] flex items-center justify-center">
//       <Card className="h-screen sm:h-auto">
//         <div className="flex items-center justify-between plb-5 pli-6">
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'flex-start',
//               justifyContent: 'center',
//             }}
//           >
//             <i className="tabler-browser-plus" />
//             <Typography paddingLeft={'10px'} variant="h5">
//               {dic.addNewRole}
//             </Typography>
//           </div>
//           <IconButton disabled={loading} size="small" onClick={handleReset}>
//             <i className="tabler-x text-2xl text-textPrimary" />
//           </IconButton>
//         </div>
//         <Divider />
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <Controller
//                   name="laName"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       disabled={loading}
//                       fullWidth
//                       label={`${dic.position} (${dic.lao}) *`}
//                       placeholder="ex: ຫົວໜ້າ..."
//                       {...(errors.laName && {
//                         error: true,
//                         helperText: dic.thisFieldIsRequiredExclamination,
//                       })}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Controller
//                   name="enName"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       disabled={loading}
//                       fullWidth
//                       label={`${dic.position}  (${dic.english}) *`}
//                       placeholder="ex: Head of..."
//                       {...(errors.enName && {
//                         error: true,
//                         helperText: dic.thisFieldIsRequiredExclamination,
//                       })}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Controller
//                   name="systemCode"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => (
//                     <CustomTextField
//                       {...field}
//                       disabled={loading}
//                       fullWidth
//                       label={`${dic.code}`}
//                       placeholder="ex: SuperAdmin..."
//                       {...(errors.systemCode && {
//                         error: true,
//                         helperText: dic.thisFieldIsRequiredExclamination,
//                       })}
//                     />
//                   )}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={12}>
//                 <div className="flex items-center justify-between">
//                   <Typography>{dic.menuList}</Typography>
//                   <Button>
//                     <i className="tabler-plus text-base" />
//                     <Typography ml={'5px'} fontSize={'13px'}>
//                       {dic.addNew}
//                     </Typography>
//                   </Button>
//                 </div>
//                 <Controller
//                   name="menus"
//                   control={control}
//                   rules={{ required: true }}
//                   render={({ field }) => {
//                     const menus = field.value;
//                     if (menus.length <= 0) {
//                       return (
//                         <div className="flex-col w-full h-full flex items-center justify-center rounded border">
//                           <i className="tabler-clipboard-list text-2xl" />
//                           <Typography py={'5px'} variant={'subtitle1'}>
//                             {dic.noListData}
//                           </Typography>
//                           <Button size="small" variant={'outlined'}>
//                             <i className="tabler-plus text-base" />
//                             <Typography ml={'5px'} fontSize={'13px'}>
//                               {dic.addNew}
//                             </Typography>
//                           </Button>
//                         </div>
//                       );
//                     } else {
//                       return <>{menus.length}</>;
//                     }
//                   }}
//                 />
//               </Grid>
//               <Grid
//                 item
//                 xs={12}
//                 className="w-full flex gap-4 justify-end mt-20"
//               >
//                 <Button
//                   disabled={loading}
//                   variant="tonal"
//                   color="secondary"
//                   type="reset"
//                   onClick={() => reset()}
//                 >
//                   <i className="tabler-restore text-base mr-2" />
//                   {dic.reset}
//                 </Button>
//                 <Button disabled={loading} variant="contained" type="submit">
//                   {loading ? (
//                     <i className="tabler-loader animate-spin text-base mr-2" />
//                   ) : (
//                     <i className="tabler-upload text-base mr-2" />
//                   )}
//                   {dic.save}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FormCreateRole;
