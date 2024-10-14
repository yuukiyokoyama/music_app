import PropTypes from "prop-types";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const SearchSection = styled.section`
  margin-bottom: 2.5rem;
`;

const SearchInputField = styled.input`
  background-color: #374151;
  width: 33.333%;
  padding: 0.5rem;
  border-radius: 0.5rem 0 0 0.5rem;
  outline: none;

  @media (max-width: 768px) {
    width: 84%;
  }
`;

const SearchButton = styled.button`
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const SearchInput = (props) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      props.onSubmit();
    }
  };

  return (
    <SearchSection>
      {/* 検索ボックス */}
      <SearchInputField
        onChange={props.onInputChange} // 入力内容が変更されたときに呼び出される関数
        onKeyDown={handleKeyPress} // ユーザーがキーを押したときに呼び出される関数
        placeholder="探したい曲を入力してください"
      />
      {/* 検索ボタン。クリックで検索を実行 */}
      <SearchButton onClick={props.onSubmit}>
        <FontAwesomeIcon icon={faSearch} />
      </SearchButton>
    </SearchSection>
  );
};

// PropTypesの設定
SearchInput.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchInput;
