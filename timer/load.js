// 画像読込のシーン
var loadScene = new Phaser.Scene("loadScene");
loadScene.preload = function() {
};
loadScene.create = function() {
    // 読み込み完了後にstartSceneを起動
    this.scene.start("startScene");
};
