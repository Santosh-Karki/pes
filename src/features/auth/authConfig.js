export const msalConfig = {
  auth: {
    clientId: `9246c67c-512f-46a5-b5db-314fd9d13171`,
    authority: `https://login.microsoftonline.com/680ffb06-000e-46a1-a455-ab68252c398d`,
    postLogoutRedirectUri: ``,
    // redirectUri: window.location.origin,
    redirectUri: 'http://localhost:3000/Admin'
  }
}

export const loginRequest = {
  scopes: ["User.Read"]
}