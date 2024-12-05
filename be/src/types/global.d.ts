export type User = {
  id: number;
  email: string;
  password: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
  firstname: string;
  lastname: string;
  fb_act: string;
  fb_act_expire: string;
  tt_refresh_token: string;
  tt_act: string;
  tt_act_expire: string;
  yt_act: string;
  yt_act_expire: string;
  yt_refresh_token: string;
};

export type decodedTokenData = {
  id: number;
  firstName: string;
  lastName: string;
  exp: number;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      userData?: User
    }
  }
}
export { }; // Ensure this is treated as a module