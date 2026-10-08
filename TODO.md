# TODO

## Firebase Hosting deploy
- [ ] Build: run `npm run build` to ensure `dist/` exists.
- [ ] Deploy: run `npx firebase-tools deploy --only hosting` (or `firebase deploy --only hosting`).
- [ ] Update `.firebaserc` `projects.default` from `YOUR_FIREBASE_PROJECT_ID` to your real Firebase project id.

## Login -> Admin continuous auth
- [x] Update `src/pages/LoginPage.jsx` to set `sessionStorage.setItem('portfolioAdminSession','admin')` on successful login.
- [x] Redirect user to `/admin` after login.
- [ ] Verify `/admin` loads without showing admin login form.
- [ ] Verify Logout on admin clears authorization.




