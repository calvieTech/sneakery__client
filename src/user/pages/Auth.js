import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = async () => {
    if (!isLoginMode) {
      await setFormData(
        {
          ...formState.inputs,
          username: undefined,
          avatar: undefined,
        },
        formState.inputs?.email?.isValid && formState.inputs?.password?.isValid
      );
    } else {
      await setFormData(
        {
          ...formState.inputs,
          username: {
            value: '',
            isValid: false,
          },
          avatar: {
            value: undefined,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    const inputs = formState.inputs;
    let res;
    let mode = isLoginMode ? 'login' : 'signup';

    let url =
      process.env.NODE_ENV === 'development'
        ? `http://${window.location.hostname}:3001/api/users/${mode}`
        : `https://${window.location.hostname}:3001/api/users/${mode}`;

    if (isLoginMode) {
      try {
        const { email, password } = inputs;

        res = await sendRequest(
          url,
          'POST',
          JSON.stringify({
            email: email.value,
            password: password.value,
          }),
          { 'Content-Type': 'application/json; charset=utf-8' }
        );
        auth.login(res.userId, res.jwt);
        navigate('/sneakery');
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      try {
        let formData = new FormData();
        const { avatar, username, email, password } = inputs;
        formData.append('avatar', avatar.value);
        formData.append('username', username.value);
        formData.append('email', email.value);
        formData.append('password', password.value);

        res = await sendRequest(url, 'POST', formData);
        auth.login(res.userId, res.jwt);
        navigate('/sneakery', { replace: true });
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoginMode ? (
          <h2>Login Required</h2>
        ) : (
          <h2> Registration Required</h2>
        )}
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <div>
              <Input
                element='username'
                id='username'
                type='text'
                label='Your Username'
                validators={[VALIDATOR_MINLENGTH(4)]}
                errorText='Please enter a username, atleast 4 characters'
                onInput={inputHandler}
              />
              <ImageUpload
                id='avatar'
                name='avatar'
                center
                onInput={inputHandler}
              />
            </div>
          )}
          <Input
            element='email'
            id='email'
            type='email'
            label='E-Mail'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
          />
          <Input
            element='password'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password, at least 6 characters.'
            onInput={inputHandler}
          />
          <br />
          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
