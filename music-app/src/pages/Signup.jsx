import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { authRepository } from "../repositories/auth"; // 認証関連の関数をインポート
import { SessionContext } from "../SessionProvider"; // セッション管理のコンテキストをインポート
import AuthForm from "../components/AuthForm";

const Signup = () => {
  // インプットタグに入力された情報を保持するstate
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useContextフックを使用して、SessionContextからcurrentUserとsetCurrentUserを取得
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const signup = async () => {
    // authRepository.signup メソッドは、name, email, password を使ってSupabaseの auth.signUp メソッドを呼び出し、新規ユーザーを登録をする
    const user = await authRepository.signUp(name, email, password);
    setCurrentUser(user);
  };

  // ユーザーがログインしていればホームにリダイレクト
  if (currentUser != null) return <Navigate replace to="/" />;

  // AuthFormコンポーネントを必要なpropsとともにレンダリング;
  return (
    <AuthForm
      type="signup"
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={signup}
      isDisabled={name === "" || email === "" || password === ""}
    />
  );
};
export default Signup;
