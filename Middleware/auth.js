import admin from "./firebase-config.js";

/**
 * Used to very a users token
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res
      .status(401)
      .send("Unauthorized request, try logging out and logging back in");
  }

  try {
    req.user = await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .send("Unauthorized request, try logging out and logging back in");
  }
};

export const NO_USER = {
  user_id: "USER_NOT_FOUND",
};

export const getUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (idToken) {
      req.user = await admin.auth().verifyIdToken(idToken);
    } else {
      req.user = NO_USER;
    }
  } catch (error) {
    req.user = NO_USER;
    console.log(error);
  }

  next();
};
