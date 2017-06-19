module.exports = (app, firebase) => {
  app.get('/groups', (req, res) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // user is signed in
        const userId = user.uid;
        const db = firebase.database();

        // instantiate empty Map to hold groups
        const groups = new Map();

        // get user's groups
        const groupsReference = db.ref(`/users/${userId}/groups/`);
        groupsReference.on('value', (snapshot) => {
          const groupKeys = [];

          // get the keys for each user's group
          snapshot.forEach(groupSnapshot => (
            groupKeys.push(groupSnapshot.key)
          ));

          // map to promises to asynchronously collect group info
          const promises = groupKeys.map(groupKey => (
            new Promise((resolve) => {
              const groupReference = db.ref(`groups/${groupKey}`);
              groupReference.on('value', (snap) => {
                // add group info to list of groups
                groups.set(groupKey, snap.val());
                resolve();
              });
            })
          ));
          // collect resolved promises
          Promise.all(promises)
          .then(() => {
            res.send({
              message: 'Returned groups',
              userGroups: groups
            });
          })
          .catch((err) => {
            res.status(401).send({
              message: `Something went wrong ${err.message}`,
            });
          });
        });
      } else {
        res.status(403).send({
          // user is not signed in
          message: 'You are not signed in right now!'
        });
      }
    });
  });
};

