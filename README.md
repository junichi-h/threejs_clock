# threejs_clock

[Three.js](https://threejs.org/)を使って時計を作ってみる。

## 自分なりの目標（課題）
 * [Geometry](https://threejs.org/docs/index.html#api/core/Geometry)や[Mesh](https://threejs.org/docs/index.html#api/objects/Mesh)、[AmbientLight](https://threejs.org/docs/index.html#api/lights/AmbientLight)などを理解すること
 * 3Dの計算に慣れること。（今まで2Dはよくやってたけど3Dは毛嫌いしてた...）
 * 座標になれること。
 * 2Dで言う所のレイヤー深度にも少し理解 & 慣れたい。
 * FPSを60キープすること。
 * なるべく、自分のコードで書くこと。（ネットから拾ってコピペはしない）← 実案件になったらコピペでは解決しなさそうなので。

## 実際にやってみて難しかった事（できなかったこと）
 * 各時計の針を自分が意図した場所に配置できなかったこと。
  （[dat.gui](https://workshop.chromeexperiments.com/examples/gui)を使い一つ一つ解決
 * 時計の回転時に各Objectの回転軸の中心がObjectの中心になっていたので苦労した。
   ・自分としてはContaienr的なのをひいてあげて Objectの `height / 2` ずらせば行けると思った。
   ・もしくは、 `matrix` 的なので `height / 2` みたいなことをするのか？と思った。
   ・結果的に[Group](https://threejs.org/docs/#api/objects/Group)を使って解決した。
 * 自分のコードを書くことを心がけたので演出ができなかった。。  :tired_face:
 （↑はどうしたらいいかがわからず... DOMとは違う...）

## requirement
このプロジェクトを実行するには[yarn](https://yarnpkg.com/lang/en/)が必要なのでインストールしてください。

またNodeのバージョンは `7.7.x` 位がいいかもです。
PostCSS（使ってないけど）を読ませてるので古いバージョンだとコケます。。

### yarnインストール方法
 * Macは[こちら](https://yarnpkg.com/en/docs/install)
 * windowsは[こちら](https://yarnpkg.com/en/docs/install#windows-tab) 



## インストール

```
yarn install
```


## ローカル起動

```
yarn start
```

[http://localhost:9000](http://localhost:9000)で起動されます。


## ビルド

```
yarn prod
```