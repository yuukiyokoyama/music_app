import { supabase } from "../lib/supabase";
export const authRepository = {
  // signUp メソッド: 新規ユーザー登録を行う非同期関数
  async signUp(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error != null) throw new Error(error.message);
    return { ...data.user, userName: data.user.user_metadata.name };
  },

  // signin メソッド: ユーザーログインを行う非同期関数
  async signin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return {
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },

  // getCurrentUser メソッド: 現在のユーザー情報を取得する非同期関数
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();
    if (error != null) throw new Error(error.message);
    if (data.session == null) return;

    // セッションがある場合、ユーザーデータを返す
    return {
      ...data.session.user,
      userName: data.session.user.user_metadata.name,
    };
  },

  // signout メソッド: ユーザーログアウトを行う非同期関数
  async signout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  },
};
