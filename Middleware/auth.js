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
    await admin.auth().verifyIdToken(idToken);
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .send("Unauthorized request, try logging out and logging back in");
  }
};
