import styled from "styled-components";
import PropTypes from "prop-types"; // PropTypesをインポート
import { Link } from "react-router-dom";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2.5rem 1rem;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AppTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
`;

export const FormContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 28rem;
`;

export const FormCard = styled.div`
  background-color: white;
  padding: 2rem 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
`;

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const Input = styled.input`
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

export const SubmitButton = styled.button`
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

export const SignupLink = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
`;

// AuthFormコンポーネントの定義
// propsを分割代入で受け取り、必要な値と関数を取得
const AuthForm = ({
  type,
  email,
  setEmail,
  password,
  setPassword,
  name = "", // デフォルト値をここで指定
  setName = () => {}, // デフォルト値をここで指定
  onSubmit,
  isDisabled,
}) => {
  return (
    <PageContainer>
      <ContentWrapper>
        <AppTitle>Music App</AppTitle>
        <FormContainer>
          <FormCard>
            <FormContent>
              {/* サインアップの場合のみユーザー名入力フィールドを表示 */}
              {type === "signup" && (
                <InputGroup>
                  <Label htmlFor="username">ユーザー名</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="username"
                    name="username"
                    placeholder="ユーザー名"
                    required
                    type="text"
                  />
                </InputGroup>
              )}
              <InputGroup>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  value={email}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="パスワード"
                />
              </InputGroup>
              {/* 送信ボタン */}
              <SubmitButton onClick={onSubmit} disabled={isDisabled}>
                {/* フォームタイプに応じてボタンテキストを変更 */}
                {type === "signup" ? "登録" : "ログイン"}
              </SubmitButton>
              {/* サインイン画面の場合のみ、サインアップへのリンクを表示 */}
              {type === "signin" && (
                <SignupLink>
                  登録は
                  <Link to="/signup">こちら</Link>
                  から
                </SignupLink>
              )}
            </FormContent>
          </FormCard>
        </FormContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

AuthForm.propTypes = {
  type: PropTypes.oneOf(["signin", "signup"]).isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  name: PropTypes.string,
  setName: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default AuthForm;
