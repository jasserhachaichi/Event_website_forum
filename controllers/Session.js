function getSessionHandler(Session) {
    const mySession = Session;

    let length_session = 0;
    for (const key in mySession) {
      if (mySession.hasOwnProperty(key)) {
        length_session++;
      }
    }

    if ((mySession === undefined || mySession === null) && (length_session == 0)) {
      return null;
    } else {
      return mySession;
    }
  }
  



module.exports= { getSessionHandler };
