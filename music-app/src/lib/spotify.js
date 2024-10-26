import axios from "axios";

class SpotifyClient {
  constructor() {
    this.token = null; // アクセストークンを格納するメンバ変数
  }

  // エラーハンドリングの共通関数
  handleError(error, methodName) {
    console.error(`${methodName} Error:`, error.message);
    throw new Error(`エラーが発生しました: ${error.message}`);
  }

  // アクセストークンを取得するメソッド
  async getAccessToken() {
    if (this.token) {
      return this.token;
    }

    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          },
        }
      );

      this.token = response.data.access_token;
      return this.token;
    } catch (error) {
      this.handleError(error, "getAccessToken");
    }
  }

  // 人気の曲を取得するメソッド
  async getPopularSongs() {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "getPopularSongs");
    }
  }

  // 曲を検索するメソッド
  async searchSongs(keyword) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: keyword,
          type: "track",
        },
      });
      return response.data.tracks;
    } catch (error) {
      this.handleError(error, "searchSongs");
    }
  }

  // 音楽の特徴を取得するメソッド
  async getAudioFeatures(trackId) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `https://api.spotify.com/v1/audio-features/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "getAudioFeatures");
    }
  }

  // 推奨曲を取得するメソッド
  async getRecommendations(trackId, features) {
    try {
      const token = await this.getAccessToken();
      const params = {
        limit: 20,
        seed_tracks: trackId,
        target_liveness: features.liveness,
        target_valence: features.valence,
        target_energy: features.energy,
        target_tempo: features.tempo,
        min_popularity: 50,
      };

      const response = await axios.get(
        "https://api.spotify.com/v1/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        }
      );

      return response.data.tracks;
    } catch (error) {
      this.handleError(error, "getRecommendations");
    }
  }
}

const spotify = new SpotifyClient();
// 即時関数
(async () => {
  try {
    await spotify.getAccessToken(); // 初回にアクセストークンを取得
  } catch (error) {
    console.error(error.message);
  }
})();
export default spotify;
