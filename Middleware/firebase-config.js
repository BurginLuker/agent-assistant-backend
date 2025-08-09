const config = {
  "type": "service_account",
    "project_id": "listing-web-abb",
    "private_key_id": "9661751f63ec701c836e1661e44390757ac936fb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzHZ67h2Gvzki2\neXsFukUhw0eQfPjiGGL+9YY5Ep215brKIEra7Tqf7ca37mzz+ztUoLRYsmCYX4QK\nkMvyhagE8gw52LBhy0Scob6tDR5wfPpyvrXBk9sodUBUccKB9GwXclwQqSvVYLA1\nO+Em6BS6W/EP2OLgS2svWjzvu0INM0jDnq857d/8goAPMgGkJJvkuOz1PXpViosr\nc+Yine8kNS3LP5eH8UnWxKVuHUSKYPbMnFRAAZUUO1/O5lzQlrFI0mG9VgKg4wBh\nnxm9Eh47TQNkGxHYY3f3MM7mGhckht9okaW9Qv/l2yWgJ5ZuMie2t++O3cskZGVU\ni79hH3SXAgMBAAECggEACRlI7iDMnb1+ZG/xB75JyGh0SGA41Q9vvqDio8qQzWPb\n+cGV29+E2glI+MtOqJQ2FDCiXgZtsWqEuXQCkDwpkrATCUCQhonotIY45USPK8qw\nKZ0LfEe9BdCdpyHXmM9oSvFJwPo/BPSyRCSvECa7oCiPKy1q1QGvx7TZ90RNcNXO\nIL/Pjq3Qfq+HpBXZWYgMrDPIt9c8wIl6RZq8qH0wtled++HwsQZcYMNg+SOD9f/k\neD6ycixEdCi/jqyseEmebPI8evVsiv42Oju7Re/RABV2CMYpQp1yg2esV9hPGcAy\nxV6wi6mOk7dlo7K9Lb810gUXaqbMDUsQBR+PTbAz+QKBgQDkFUwOHihBhHJdLZoj\neMKiKQ0BI82HP8GNI36qdtK+4afyVslnWTnRht/A6X2hce2gVh59Rfek3UkikffC\nHjGgCW27Xwiw3CWt2NnZxlGrgJ4A3yyOE5UBaipvxAXn36y6XC6mwbbkHsjLpQAc\n7B7ZFoG+PqQS2wEcJ0A6Y/9yvwKBgQDJCfzXSFfWIQPE8ZnpHFguYzf+WnGo5c9W\njs6zZM360I2xtVeafnrEmKgTRQF3iF8NZqak445RbgbbOh7R4reZVgBBPCeaC1/q\nRHBKvfUC8VjQIlyJoU2QAIV2OeeqfYo/e4sG5scH7iMMjVsbZrI1MaeX+gV0DBfD\nOPBJshLsKQKBgCTs1b1LYJUKzkELivLHMCt0nehbVYDZ74nb/zu1tPS2L6xqJH0Y\n0uV7AmqG4pHqkd/tUU5Sr37/XEG+g+/nV31jSWKWRh/r5CW6/7nkA4DSd8IIX3w4\n61ypRWmGwLYDXkFlfx/8KJHR8gwWEGieSXg3zpVwKrvqvMlECX/qhIadAoGBAIZz\njYuVMFle3xx50Etcz4TGio4rgtRITbA/9fF4O2HA1OLCuwHyEL0ms1Gf1ulQZPGb\nc1vXbDj9csxvRGluTQfZwnXee0XE0bLlbowuGoyLSLB6KpVJMYxbLObytwMIzsrC\nHyrQcM/W7c3ZQ9NBjXGR8dnsNnV0GPhRPjKrS4hxAoGAaFdpHf1KOig+OMVHZTSp\n2fG/oYx7MDex43jd/kp8/ZOzScwjsbI0adit5aXrgQKzwPYtxkIA6yBOOx9xyrDS\n/CE4Us9nBXLut5wGmDF4Fc2C+4kkxVIAkV6YvXfIpr58yerFKNagvNunzuCCtgdD\ncnnrBz/nI9HCmzuyP4bRr1o=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@listing-web-abb.iam.gserviceaccount.com",
    "client_id": "116418862805600758295",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40listing-web-abb.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
import admin from "firebase-admin";

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(config),
});

export const db = admin.firestore();

// Export the initialized admin object
export default admin;
