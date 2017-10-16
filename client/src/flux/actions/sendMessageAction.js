import PostItDispatcher from '../Dispatcher';
import PostItActionTypes from '../ActionTypes';
import { getDatabase, getAuth } from '../firebaseFunctions';
import sendNotifications from '../../utility/sendNotifications';
import getUsersEmailsNumbers from '../../utility/getUsersEmailsNumbers';

/* eslint object-shorthand: 0 */

/**
 * sendMessageAction - sends a new message to a group
 * @param {*} messageDetails
 * @return {void}
 */
export default ({ message, sender, groupId, priorityLevel }) => {
  const auth = getAuth();
  const database = getDatabase();

  auth.onAuthStateChanged((user) => {
    if (user) {
      const newMessageKey = database.ref(`groups/${groupId}/messages/`)
        .push(true).key;

      const promise = new Promise((resolve) => {
        database.ref(`messages/${newMessageKey}`).set({
          message,
          sender,
          priority: priorityLevel
        });
        resolve();
      });
      promise
        .then(() => {
          PostItDispatcher.handleServerAction({
            type: PostItActionTypes.SENT_MESSAGE
          });
          getUsersEmailsNumbers({
            database() {
              return database;
            }
          }, groupId,
          priorityLevel, sendNotifications);
        });
    } else {
      PostItDispatcher.handleServerAction({
        type: PostItActionTypes.FAILED_SEND_MESSAGE
      });
    }
  });
};