import React, { useEffect, useState } from 'react';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import UsersList from '../components/UsersList';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let responseData =
          process.env.NODE_ENV === 'development'
            ? await sendRequest(
                `http://${window.location.hostname}:3001/api/users`
              )
            : await sendRequest(
                `https://${window.location.hostname}:3001/api/users`
              );

        setLoadedUsers(responseData.users);
      } catch (err) {
        throw new Error(err.message);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList usersList={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
