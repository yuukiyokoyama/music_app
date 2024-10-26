import { supabase } from "../lib/supabase";

const handleError = (error, methodName) => {
  console.error(`${methodName} Error:`, error.message);
  throw new Error(`エラーが発生しました: ${error.message}`);
};

export const authRepository = {
  // signUp メソッド: 新規ユーザー登録を行う非同期関数
  async signUp(name, email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error; // エラーをスロー
      return { ...data.user, userName: data.user.user_metadata.name }; // 成功時の戻り値
    } catch (error) {
      handleError(error, "SignUp"); // エラーハンドリング
    }
  },

  // signin メソッド: ユーザーログインを行う非同期関数
  async signin(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error; // エラーをスロー
      return {
        ...data.user,
        userName: data.user.user_metadata.name,
      }; // 成功時の戻り値
    } catch (error) {
      handleError(error, "Signin"); // エラーハンドリング
    }
  },

  // getCurrentUser メソッド: 現在のユーザー情報を取得する非同期関数
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error; // エラーをスロー
      if (!data.session) return null; // セッションがない場合は null を返す

      return {
        ...data.session.user,
        userName: data.session.user.user_metadata.name,
      }; // 成功時の戻り値
    } catch (error) {
      handleError(error, "GetCurrentUser"); // エラーハンドリング
    }
  },

  // signout メソッド: ユーザーログアウトを行う非同期関数
  async signout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error; // エラーをスロー
      return true; // 成功時の戻り値
    } catch (error) {
      handleError(error, "Signout"); // エラーハンドリング
    }
  },
};
