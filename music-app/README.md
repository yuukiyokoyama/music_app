## Music App
Spotify Japan 急上昇チャートの曲が聴けたり、選択した曲から似ている曲を教えてくれたりするアプリです。

## 使用技術
### フロントエンド
- React
- Router
- React Hooks (useState,useEffect,useContext,useRef)
- Axios
- Spotify API
- Tailwind CSS
- styled-components

### バックエンド
- supabase

## 主要機能
1. ユーザー認証
   - メールアドレスとパスワードを使用したサインアップ/ログイン。

2. 検索機能
   - アーティスト、曲名を入れて検索できます。

3. 人気曲一覧
   - Spotify Japan 急上昇チャートから曲を一覧表示させています。

4. 選択した曲から似ている曲を5曲表示
   - Spotify APIで得られる楽曲特徴データ(ライブ感、曲の明るさ、テンポ(BPM)、エネルギッシュさ、曲の人気の50以上)から選択した曲と似ている曲が表示されます。

5. ログアウト機能
