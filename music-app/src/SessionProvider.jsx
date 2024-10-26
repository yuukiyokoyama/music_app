// 登録とログイン時に、取得したユーザー情報をGLOBALSTATEで管理して、他のコンポーネントでも利用できるようにする
import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import { authRepository } from "./repositories/auth"; // 認証関連の関数をインポート

// SessionContextでアプリケーション全体で認証状態（currentUser）を共有
const SessionContext = createContext();

// SessionProviderで子コンポーネントに認証状態を提供
const SessionProvider = (props) => {
  // currentUser の状態を管理するための useState フック
  // currentUser には現在ログインしているユーザーの情報が格納
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    setSesson();
  }, []);

  // セッション情報を設定する非同期関数
  const setSesson = async () => {
    // authRepository から現在のユーザー情報を取得
    const currentUser = await authRepository.getCurrentUser();
    // 取得したユーザー情報で currentUser 状態を更新
    setCurrentUser(currentUser);
  };

  // SessionContext.Provider を返す
  // value プロパティに currentUser と setCurrentUser を指定することで、子コンポーネントからこれらの値とメソッドにアクセスできるようになる
  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {props.children}
    </SessionContext.Provider>
  );
};

// props validationを追加
SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SessionContext, SessionProvider };
