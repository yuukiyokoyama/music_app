import PropTypes from "prop-types";
import { faPlayCircle, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const PlayerFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1f2937;
  padding: 1.25rem;
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SongInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AlbumArt = styled.img`
  border-radius: 9999px;
  margin-right: 0.75rem;
  height: 50px;
  width: 50px;
`;

const SongDetails = styled.div``;

const SongName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
`;

const ArtistName = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const ControlButton = styled(FontAwesomeIcon)`
  color: white;
  font-size: 1.875rem;
  margin: 0 0.5rem;
  height: 40px;
  width: 40px;
  cursor: pointer;
`;

const Player = (props) => {
  return (
    <PlayerFooter>
      <PlayerGrid>
        {/* アルバムアートと曲情報を表示する部分 */}
        <SongInfoContainer>
          <AlbumArt src={props.song.album.images[0].url} alt="thumbnail" />
          <SongDetails>
            <SongName>{props.song.name}</SongName>
            <ArtistName>{props.song.artists[0].name}</ArtistName>
          </SongDetails>
        </SongInfoContainer>
        {/* 再生・停止ボタン */}
        <div className="flex items-center justify-center">
          <ControlButton
            onClick={props.onButtonClick} // ボタンをクリックしたときの処理
            icon={props.isPlay ? faStopCircle : faPlayCircle} // 再生中か停止中かでアイコンを切り替え
          />
        </div>
      </PlayerGrid>
    </PlayerFooter>
  );
};

// PropTypesの設定
Player.propTypes = {
  song: PropTypes.shape({
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
  onButtonClick: PropTypes.func.isRequired,
  isPlay: PropTypes.bool.isRequired,
};

export default Player;
