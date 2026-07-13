/* eslint-disable import/order */
'use client';
import type { Operation } from '@apollo/client';
import {ApolloClient,ApolloLink,ApolloProvider,HttpLink,InMemoryCache,Observable,} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { signOut } from 'next-auth/react';

const TIMEOUT_DURATION = 20000;

const laoWorld = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
});

type LinkConditionPair = {
  condition: (operation: Operation) => boolean;
  link: HttpLink;
};

function getApolloLink(pairs: LinkConditionPair[]): ApolloLink {
  if (pairs.length === 1) {
    return pairs[0].link;
  } else {
    const [firstPair, ...restPairs] = pairs;
    return ApolloLink.split(
      firstPair.condition,
      firstPair.link,
      getApolloLink(restPairs)
    );
  }
}

interface ApolloWrapperProps {
  children: React.ReactNode;
  session?: any;
  dic: any;
}

export const ApolloWrapper: React.FC<ApolloWrapperProps> = ({
  children,
  session,
  dic,
}) => {
  const timeoutLink = new ApolloLink(
    (operation: Operation, forward: any): Observable<any> => {
      return new Observable((observer) => {
        const timeout = setTimeout(() => {
          observer.error(
            new Error(`${dic.timeoutError} (${TIMEOUT_DURATION}ms)`)
          );
        }, TIMEOUT_DURATION);

        forward(operation).subscribe({
          next: (result: any) => {
            clearTimeout(timeout);
            observer.next(result);
          },
          error: (err: any) => {
            clearTimeout(timeout);
            observer.error(err);
          },
          complete: () => {
            clearTimeout(timeout);
            observer.complete();
          },
        });
      });
    }
  );

  const authLink = setContext((_, { headers }) => {
    const token = session?.authorization ?? '';
    console.log(`::::token`, token)
    // console.log(token);

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
        platform: 'mms_svc',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        if (error.extensions?.code === 'UNAUTHENTICATED') {
          // Handle 401 error: Redirect to login
          // signOut({ callbackUrl: '/login' });
        }
      }
    }

    if (networkError && (networkError as any).statusCode === 401) {
      // Handle 401 error from network
      // signOut({ callbackUrl: '/login' });
    }
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      authLink,
      errorLink,
      timeoutLink,
      getApolloLink([
        {
          condition: (operation: Operation) => {
            return operation.operationName.toLowerCase().includes('gateway');
          },
          link: laoWorld,
        },
      ]),
    ]),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
