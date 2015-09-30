# gpx-trimmer-js
GPXをトリミングするためのJSモジュール。

# 方針
- IOは絡めずにブラウザでもNodeでも使えるようにする

# 入力
- 文字列で受けとる

# 出力
- UTF8の文字列で返す

# 機能
- 重複整理
    - まとめる距離
    - 最後のデータを残すか、平均化するか
- 飛んだデータの整理
    - 異常値を検出して削除
    - 歩行、自転車、乗り物、距離を指定
- 時間制限
    - 開始時間と終了時間を与えて範囲外を削除
    - GPXが不足していたら時間を追加
    - nullを渡したらデータの端まで

# サンプル
## 開発
- コマンドラインからnodeで実行

## 公開時
- nodejs+express+ejsで作成
- クライアントはBootstrap
