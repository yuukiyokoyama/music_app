import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import spotify from "../lib/spotify";
import {
  faPlayCircle,
  faStopCircle,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: #111827;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 48rem;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #1f2937;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  padding-right: 2rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    color: white;
    background-color: #1f2937;
  }
`;

const ModalContent = styled.div`
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(80vh - 80px);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
`;

const SongsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

const SongCard = styled.div`
  background-color: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
`;

const SongImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${SongCard}:hover & {
    opacity: 1;
  }
`;

const SongInfo = styled.div`
  padding: 0.75rem;
`;

const SongTitle = styled.h3`
  font-weight: 500;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ArtistName = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const SimilarSongsModal = ({
  isOpen, // モーダルが開いているかどうかを示すフラグ
  onClose, // モーダルを閉じるための関数
  selectedSong, // 選択された曲の情報
  onSongPlay, // 再生する際に呼ばれる関数
}) => {
  const [similarSongs, setSimilarSongs] = useState([]); // 類似曲を格納するstate
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を示すstate
  const [playingSong, setPlayingSong] = useState(null); // 再生中の曲を格納するstate

  useEffect(() => {
    const fetchSimilarSongs = async () => {
      // 選択された曲がない場合は何もせずに終了
      if (!selectedSong) return;

      setIsLoading(true);
      try {
        const features = await spotify.getAudioFeatures(selectedSong.id);
        let allRecommendedTracks = [];

        const firstBatch = await spotify.getRecommendations(
          // Spotify APIから類似曲を取得
          selectedSong.id, // 選択された曲のIDを使用
          features // 曲のオーディオ特徴量を引数として渡す
        );
        allRecommendedTracks = firstBatch; // 取得した類似曲をallRecommendedTracksに保存

        // 選択した曲を除外してユニークな曲だけを抽出
        const uniqueSongs = Array.from(
          new Map(
            allRecommendedTracks
              .filter((song) => song.id !== selectedSong.id && song.preview_url)
              .map((song) => [song.id, song])
          ).values()
        );

        // 類似曲が5曲未満の場合は、追加で曲を取得
        if (uniqueSongs.length < 5) {
          const secondBatch = await spotify.getRecommendations(
            selectedSong.id,
            features
          );

          // 追加の曲を重複を避けて取得
          secondBatch
            .filter(
              (song) =>
                song.id !== selectedSong.id &&
                !uniqueSongs.some((existingSong) => existingSong.id === song.id)
            )
            .forEach((song) => {
              if (uniqueSongs.length < 5) {
                uniqueSongs.push(song);
              }
            });
        }

        // 最終的に5曲を確保
        const finalSongs = uniqueSongs.slice(0, 5);

        if (finalSongs.length === 5) {
          setSimilarSongs(finalSongs); // 類似曲のリストをstateに保存
        } else {
          const thirdBatch = await spotify.getRecommendations(selectedSong.id, {
            ...features,
            popularity: 50,
          });

          const additionalSongs = thirdBatch.filter(
            (song) =>
              song.id !== selectedSong.id &&
              !finalSongs.some((existingSong) => existingSong.id === song.id)
          );

          const completeSongs = [...finalSongs, ...additionalSongs]
            .filter((song) => song.preview_url)
            .slice(0, 5);
          setSimilarSongs(completeSongs);
        }
      } catch (error) {
        console.error("Error fetching similar songs:", error);
      }
      setIsLoading(false);
    };

    if (isOpen) {
      fetchSimilarSongs(); // モーダルが開かれた時に類似曲を取得する関数を呼び出し
    }
  }, [selectedSong]);

  // 同じ曲が再度クリックされた場合は停止し、異なる曲が選択された場合はその曲を再生する処理
  const handleSongClick = (song) => {
    if (playingSong?.id === song.id) {
      setPlayingSong(null);
      onSongPlay(null);
    } else {
      setPlayingSong(song);
      onSongPlay(song);
    }
  };

  // モーダルの背景部分をクリックした時にモーダルを閉じる処理
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // モーダルが閉じているか、選択された曲がない場合は何も表示しない
  if (!isOpen || !selectedSong) return null;

  return (
    //  モーダル全体を覆うオーバーレイ
    <ModalOverlay onClick={handleOverlayClick}>
      {/* モーダルの本体 */}
      <ModalContainer>
        {/* ヘッダー部分 */}
        <ModalHeader>
          {/* 曲のタイトル */}
          <ModalTitle>「{selectedSong.name}」に似た曲</ModalTitle>
          {/* 閉じるボタン */}
          <CloseButton onClick={onClose} aria-label="Close modal">
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          {/* コンテンツ部分 */}
          {isLoading ? ( // ローディング中の場合はスピナーを表示
            <LoadingContainer>
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </LoadingContainer>
          ) : similarSongs.length < 5 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading more similar songs...</p>
            </div>
          ) : (
            // 類似曲のグリッド表示
            <SongsGrid>
              {similarSongs.map((song) => (
                <SongCard key={song.id} onClick={() => handleSongClick(song)}>
                  <ImageContainer>
                    <SongImage src={song.album.images[0].url} alt={song.name} />
                    <PlayOverlay>
                      <FontAwesomeIcon
                        icon={
                          playingSong?.id === song.id
                            ? faStopCircle
                            : faPlayCircle
                        }
                        className="text-white text-4xl drop-shadow-lg transform hover:scale-110 transition-transform"
                      />
                    </PlayOverlay>
                  </ImageContainer>
                  <SongInfo>
                    <SongTitle>{song.name}</SongTitle>
                    <ArtistName>{song.artists[0].name}</ArtistName>
                  </SongInfo>
                </SongCard>
              ))}
            </SongsGrid>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

// PropTypesの設定
SimilarSongsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedSong: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    album: PropTypes.shape({
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onSongPlay: PropTypes.func.isRequired,
};

export default SimilarSongsModal;
