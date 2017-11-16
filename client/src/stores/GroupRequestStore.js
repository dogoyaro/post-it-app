import { EventEmitter } from 'events';
import ActionTypes from '../ActionTypes';
import Dispatcher from '../Dispatcher';
import RequestList from '../models/groupList';

const CHANGE_EVENT = 'requestChange';

let requests = new RequestList();

const addNewRequests = (newRequestList) => {
  requests = requests.merge(newRequestList);
};

/**
 * RequestStoreClass holds Store logic for groups
 * @return {void}
 *
 */
class RequestStoreClass extends EventEmitter {
  /**
   * addChangeListener
   * @memberof RequestStoreClass
   * 
   * @param {Function} callback
   * 
   * @return {void}
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * removeChangeListener
   * @memberof RequestStoreClass
   * 
   * @param {Function} callback
   * 
   * @return {void}
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  /* eslint class-methods-use-this: 0 */

  /**
   * @return {Map} requests
   */
  getRequests() {
    return requests;
  }
}


const GroupRequestStore = new RequestStoreClass();

Dispatcher.register((payload) => {
  const action = payload.action;
  let groupId;
  let requestsMap;

  switch (action.type) {
  case ActionTypes.RECEIVE_REQUESTS:
    requestsMap = new Map(action.requests);
    addNewRequests(requestsMap);
    GroupRequestStore.emit(CHANGE_EVENT);
    break;

  case ActionTypes.DELETE_REQUEST:
    groupId = action.id;
    requests = requests.delete(groupId);
    GroupRequestStore.emit(CHANGE_EVENT);
    break;

  case ActionTypes.CLEAR_GROUP_REQUEST_STORE:
    requests = new RequestList();
    break;

  default:
    return true;
  }
});
export default GroupRequestStore;
