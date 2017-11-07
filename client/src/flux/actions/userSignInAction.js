import validator from 'validator';
import PostItDispatcher from '../Dispatcher';
import PostItActionTypes from '../ActionTypes';
import { getAuth } from '../firebaseHelpers';


/**
 *userSignInAction - signs in user & dispatches actions to get groups
 * @export
 * @function
 * 
 * @param {String} email
 * @param {String} password
 * 
 * @returns {Promise} sign in promise
 */
export default function SignInAction({ email, password }) {
  const auth = getAuth();

  if (validator.isEmail(email)) {
    return auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        PostItDispatcher.handleServerAction({
          type: PostItActionTypes.LOGIN_USER,
          user
        });
      })
      .catch(() => {
        PostItDispatcher.handleServerAction({
          type: PostItActionTypes.LOGIN_ERROR,
          errorMessage:
          'Ouch!, Your username or password is incorrect, please try again'
        });
      });
  }
  return Promise.resolve()
    .then(() => PostItDispatcher.handleServerAction({
      type: PostItActionTypes.LOGIN_ERROR,
      errorMessage: 'Invalid email address'
    }));
}

