import PropTypes from "prop-types";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const LoadingContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SongGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
  }
`;

const SongItem = styled.div`
  cursor: pointer;
`;

const SongImage = styled.img`
  width: 100%;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
`;

const SongTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ArtistName = styled.p`
  color: #9ca3af;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const SongList = (props) => {
  if (props.isLoading) {
    return (
      <LoadingContainer>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </LoadingContainer>
    );
  }

  return (
    <SongGrid>
      {/* 渡された曲のリストをマッピングし、個々の曲を表示 */}
      {props.songs.map((song) => (
        // 曲がクリックされた時に親コンポーネントに選択された曲を伝える
        <SongItem key={song.id} onClick={() => props.onSongSelected(song)}>
          <SongImage alt="thumbnail" src={song.album.images[0].url} />
          <SongTitle>{song.name}</SongTitle>
          <ArtistName>By {song.artists[0].name}</ArtistName>
        </SongItem>
      ))}
    </SongGrid>
  );
};

// PropTypesの設定
SongList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  songs: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default SongList;
