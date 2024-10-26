import { useContext, useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { authRepository } from "../repositories/auth"; // 認証関連の関数をインポート
import { SessionContext } from "../SessionProvider"; // セッション管理のコンテキストをインポート
import spotify from "../lib/spotify";
import SearchInput from "../components/Searchinput";
import SongList from "../components/SongList";
import Player from "../components/Player";
import SimilarSongsModal from "../components/SimilarSongsModal";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1a202c;
  color: white;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-bottom: 5rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LogoutButton = styled.button`
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
  padding: 0.5rem;
  color: #000;
  font-weight: bold;
  background-color: #edf2f8;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
  }
`;

const Section = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
`;

const Home = () => {
  // isLoading: 曲がロードされている間にtrue、完了するとfalseにすることで、ユーザーにロード中の状態を示す。
  const [isLoading, setIsLoading] = useState(false);
  // popularSongs: Spotify APIから取得した人気曲リストが入る。
  const [popularSongs, setPopularSongs] = useState([]);
  // isPlay: 現在、曲が再生中か停止中かを示す。再生中ならtrue、停止中ならfalse。
  const [isPlay, setIsPlay] = useState(false);
  // selectedSong: ユーザーが選んだ曲の情報が入る。プレイヤーで再生される曲になる。
  const [selectedSong, setSelectedSong] = useState();
  // keyword: 検索ボックスに入力されたキーワードを保持する。
  const [keyword, setkeyword] = useState("");
  // searchedSongs: キーワードに基づいて検索された曲のリストを保持する。
  const [searchedSongs, setSearchedSongs] = useState();
  // isModalOpen: 類似曲モーダルが表示されているかどうかを示すブール値。trueならモーダルが開く。
  const [isModalOpen, setIsModalOpen] = useState(false);
  // modalSelectedSong: 類似曲モーダルで表示する曲の情報。
  const [modalSelectedSong, setModalSelectedSong] = useState(null);
  const audioRef = useRef(null);
  // previousSong: 前に再生していた曲を覚えておくための状態。モーダルが閉じたときに使う。
  const [previousSong, setPreviousSong] = useState(null);
  // isModalPlaying: モーダルで再生中かどうかを示す。
  const [isModalPlaying, setIsModalPlaying] = useState(false);
  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items
      .map((item) => item.track)
      .filter((track) => track.preview_url); // プレビューURLがある曲のみをフィルタリング
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };

  const handleSongSelected = async (song) => {
    if (isModalPlaying) {
      setIsPlay(false);
      setIsModalPlaying(false);
    }

    setSelectedSong(song);
    setModalSelectedSong(song);
    setPreviousSong(song);
    setIsModalOpen(true);

    if (song.preview_url != null) {
      audioRef.current.src = song.preview_url; // <audio>タグのsrcにプレビューURLを設定
      playSong();
    } else {
      pauseSong();
    }
  };

  const handleModalSongPlay = (song) => {
    if (song === null) {
      pauseSong();
    } else if (song.preview_url) {
      setSelectedSong(song);
      audioRef.current.src = song.preview_url;
      playSong();
      setIsModalPlaying(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    pauseSong();
    setIsModalPlaying(false);

    if (previousSong) {
      setSelectedSong(previousSong);
    }
  };

  // playSong関数で曲を再生
  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  // pauseSong関数で再生を停止
  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };

  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      if (selectedSong?.preview_url) {
        audioRef.current.src = selectedSong.preview_url;
        playSong();
      }
    }
  };

  const handleInputChange = (e) => {
    setkeyword(e.target.value);
  };

  const searchSongs = async () => {
    if (keyword.trim() === "") {
      setSearchedSongs(null);
      return;
    }
    setIsLoading(true);
    const result = await spotify.searchSongs(keyword);
    const filteredSongs = result.items.filter((track) => track.preview_url); // プレビューURLがある曲のみをフィルタリング
    setSearchedSongs(filteredSongs);
    setIsLoading(false);
  };

  // useContext フックを使用して、SessionContext から currentUser と setCurrentUser を取得
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const signout = async () => {
    // authRepository.signout メソッドを呼び出してログアウト処理を行う
    await authRepository.signout();
    setCurrentUser(null);
  };

  // ユーザーが未ログインの場合、サインインページにリダイレクト
  if (currentUser == null) return <Navigate replace to="/signin" />;

  return (
    <PageContainer>
      <AppContainer>
        {/* メインコンテンツエリア */}
        <MainContent>
          {/* ヘッダーエリア */}
          <Header>
            {/* アプリのタイトル */}
            <Title>Music App</Title>
            <LogoutButton onClick={signout}>ログアウト</LogoutButton>
          </Header>

          {/* 検索入力エリア */}
          <SearchInput
            onInputChange={handleInputChange}
            onSubmit={searchSongs}
          />

          {/* 楽曲リストセクション */}
          <Section>
            {/* セクションタイトル（検索結果か人気曲を表示） */}
            <SectionTitle>{searchedSongs ? "検索結果" : "人気曲"}</SectionTitle>

            {/* 楽曲リストを表示 */}
            <SongList
              isLoading={isLoading}
              songs={searchedSongs || popularSongs}
              onSongSelected={handleSongSelected}
            />
          </Section>
        </MainContent>

        {/* 類似曲のモーダル */}
        <SimilarSongsModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedSong={modalSelectedSong}
          onSongPlay={handleModalSongPlay}
        />

        {/* プレイヤーコンポーネント */}
        {selectedSong != null && (
          <Player
            song={selectedSong}
            isPlay={isPlay}
            onButtonClick={toggleSong}
          />
        )}

        {/* オーディオプレイヤーの参照を使用 */}
        <audio ref={audioRef} />
      </AppContainer>
    </PageContainer>
  );
};
export default Home;
