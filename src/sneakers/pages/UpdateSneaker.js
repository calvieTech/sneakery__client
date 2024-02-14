import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './SneakerForm.css';

const UpdateSneaker = () => {
  const [loadedSneaker, setLoadedSneaker] = useState();
  const params = useParams();
  const sneakerId = params.sneakerId;

  let url =
    process.env.NODE_ENV === 'development'
      ? `http://${window.location.hostname}:3001/api/sneakers/${sneakerId}`
      : `https://${window.location.hostname}:3001/api/sneakers/${sneakerId}`;

  const { isLoading, setIsLoading, error, setError, sendRequest, clearError } =
    useHttpClient();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchSneaker = async () => {
      let res;
      try {
        res = await sendRequest(url, 'GET', null, {
          'Content-Type': 'application/json',
        });
        const sneaker = res.sneaker;
        setLoadedSneaker(sneaker);
        setFormData(
          {
            title: {
              value: sneaker.title,
              isValid: true,
            },
            description: {
              value: sneaker.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    };
    fetchSneaker();
  }, [sendRequest, sneakerId, setFormData]);

  const sneakerUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await sendRequest(
        url,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.jwt,
        }
      );
    } catch (err) {
      console.log(err.message);
    }
    navigate(`/sneakery/${auth.userId}/sneakers`);
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedSneaker && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find any sneaker!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedSneaker && (
        <form className='sneaker-form' onSubmit={sneakerUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={loadedSneaker.title}
            initialValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid description (min. 6 characters).'
            onInput={inputHandler}
            initialValue={loadedSneaker.description}
            initialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE SNEAKER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateSneaker;
