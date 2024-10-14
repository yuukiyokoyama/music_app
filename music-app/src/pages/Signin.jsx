import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import styled from "styled-components";
import { authRepository } from '../repositories/auth'; // 認証関連の関数をインポート
import { SessionContext } from '../SessionProvider'; // セッション管理のコンテキストをインポート

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2.5rem 1rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AppTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
`;

const FormContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 28rem;
`;

const FormCard = styled.div`
  background-color: white;
  padding: 2rem 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  appearance: none;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &:focus {
    outline: none;
    ring: 2px solid #6366f1;
    border-color: #6366f1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #6366f1;
  &:hover {
    background-color: #4f46e5;
  }
  &:focus {
    outline: none;
    ring: 2px solid #6366f1;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SignupLink = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
`;

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

  return (
    <PageContainer>
      <ContentWrapper>
        <AppTitle>Music App</AppTitle>
        <FormContainer>
          <FormCard>
            <FormContent>
              <InputGroup>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="メールアドレス"
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="password">パスワード</Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="パスワード"
                />
              </InputGroup>
              <SubmitButton
                onClick={signin}
                disabled={email === "" || password === ""}
              >
                ログイン
              </SubmitButton>
              <SignupLink>
                登録は
                <Link to="/signup">こちら</Link>
                から
              </SignupLink>
            </FormContent>
          </FormCard>
        </FormContainer>
      </ContentWrapper>
    </PageContainer>
  );
}

export default Signin;
