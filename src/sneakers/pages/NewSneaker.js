import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Input from '../../shared/components/FormElements/Input';
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

const NewSneaker = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  let url =
    process.env.NODE_ENV === 'development'
      ? `http://${window.location.hostname}:3001/api/sneakers`
      : `https://${window.location.hostname}:3001/api/sneakers`;
  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      sneakerImg: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const sneakerSubmitHandler = async (event) => {
    event.preventDefault();
    const inputs = formState.inputs;
    try {
      const formData = new FormData();
      const { sneakerImg, title, description } = inputs;

      formData.append('title', title.value);
      formData.append('description', description.value);
      formData.append('sneakerImg', sneakerImg.value);

      await sendRequest(url, 'POST', formData, {
        Authorization: 'Bearer ' + auth.jwt,
      });
      // Redirect the user to a different page
      navigate('/sneakery', { replace: true });
    } catch (err) {
      console.error(err.message);
      throw new Error(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='sneaker-form' onSubmit={sneakerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title.'
          onInput={inputHandler}
        />
        <Input
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description (at least 5 characters).'
          onInput={inputHandler}
        />
        <ImageUpload
          className='sneakerImg'
          id='sneakerImg'
          name='sneakerImg'
          onInput={inputHandler}
          center
        />
        <Button type='submit' disabled={!formState.isValid}>
          ADD SNEAKER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewSneaker;
