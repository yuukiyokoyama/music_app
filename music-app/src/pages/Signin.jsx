import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { authRepository } from "../repositories/auth"; // 認証関連の関数をインポート
import { SessionContext } from "../SessionProvider"; // セッション管理のコンテキストをインポート
import AuthForm from "../components/AuthForm"; // 認証フォームのコンポーネントをインポート

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useContextフックを使用して、SessionContextからcurrentUserとsetCurrentUserを取得
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const signin = async () => {
    // authRepository.signin メソッドを呼び出して、ユーザー認証を行う
    const user = await authRepository.signin(email, password);
    setCurrentUser(user);
  };

  // ユーザーがログインしていればホームにリダイレクト
  if (currentUser != null) return <Navigate replace to="/" />;

  // AuthFormコンポーネントを必要なpropsとともにレンダリング
  return (
    <AuthForm
      type="signin"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={signin}
      isDisabled={email === "" || password === ""}
    />
  );
};
export default Signin;