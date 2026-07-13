import { AxiosError } from 'axios';

const axiosErrorMessage = ({ error }: { error: AxiosError }) => {
  if (error?.response?.data) {
    var data = error?.response?.data as AxiosError;
    return data?.message ?? error?.message;
  } else {
    return error?.message ?? 'Error developer';
  }
};

const graphErrorHelper = (error: any) => {
  try {
    if (!error) return 'Unknown error occurred';
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphqlErrorMessage = error.graphQLErrors
        .map((errorA: any) => errorA.message)
        .join(', ');
      return graphqlErrorMessage;
    } else if (error.networkError) {
      return error.networkError.message;
    } else {
      return error.message;
    }
  } catch (e) {
    return e;
  }
};

export { axiosErrorMessage, graphErrorHelper };
