var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
    // 初期設定を実行する
    this.config();
    
    // ボール作成
    this.createBall();
  
    
    // パドル作成
    this.createPaddle();
    
    
    // スペースキーのクリックでボール発射
    this.input.keyboard.on('keyboard - SPACE', function(event) {
        //ゲーム開始状態ならば
        if (this.paddle.isStart) {
            //ボール発射
            this.ball.setVelocity(this.ballSppedX, this.ballSppedY);
            this.paddle.isStart = false;
        }
    },this);
    
    // ブロック作成
    
    
    // ライフのテキスト表示
    
};

mainScene.update = function() {
    // ボールがシーンの最下部に到達した
    
    
    // キーボードのカーソルオブジェクトを取得
    var cursors = this.input.keyboard.createCursorKeys();
    var x = 0;
    //右カーソルをクリックすると
    if(cursors.right.isDown){
        x = this.paddle.x + this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x, 52, 748);
    }
    //左カーソルをクリックすると
    if(cursors.left.isDown){
        x = this.paddle.x - this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x, 52, 748);
    }
    //パドルの上にボールが乗っていないなら
    if(this.paddle.isStart){
        this.ball.setPosition(this.paddle.x, 500);
    }
    
};

mainScene.config = function() {
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#cccccc');
    
    // パドルの移動速度
    this.paddleSpeed = 10;
    
    // ボール発射の加速度
    this.ballSpeedX = 0;
    this.ballSpeedY = -300;
    
    // ライフ
    this.life = 3;
};

mainScene.createBall = function() {
    // ボール作成
    this.ball = this.physics.add.image(400, 500, 'ball1');
    this.ball.setDisplaySize(22,22);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
};

mainScene.createPaddle = function() {
     // パドル作成
    this.paddle = this.physics.add.image(400, 550, 'paddle1');
    this.paddle.setDisplaySize(104,24);
    this.paddle.setImmovable();
    this.paddle.isStart = true;
    this.physics.add.colloider(this.paddle, this.ball, this.hitPaddle, null, this);
};

mainScene.hitPaddle = function (paddle, ball) {
    // ボールにX方向の角度を設定
    
};

mainScene.createBlocks = function() {
    // 横10列、縦6行並べる
    
    
};

mainScene.hitBlock = function (ball, block) {
    // 衝突したブロックを削除
    block.destroy();
    // ブロックの残りを判定
    if (this.blocks.countActive() == 0) {
        // ブロックがなくなると、0.5秒後にゲームクリア
        this.time.addEvent({
            duration: 500,
            callback: this.gameClear,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene.gameClear = function() {
    // ゲームクリア
    alert("おめでとうございます");
    // スタートシーンに移動
    this.scene.start("startScene");
};

mainScene.failToHit =  function () {
    // ボールを打ち返すことに失敗
    this.ball.setVelocity(0);
    this.paddle.isStart = true;
    // ライフを減らす
    this.life--;
    this.lifeText.text = 'ライフ：' + this.life;
    // ライフが0になると
    if(this.life <= 0) {
        // 0.5秒後にゲームオーバー
        this.time.addEvent({
            duration: 500,
            callback: this.gameOver,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene.gameOver = function() {
    // ゲームオーバー
    alert("ゲームオーバー");
    // スタートシーンに移動
    this.scene.start("startScene");
};
