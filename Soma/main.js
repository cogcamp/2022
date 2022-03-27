var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
    // 初期設定を実行する
    this.config();
    
    
    // ボール作成
    this.createBall();
    
    
    // パドル作成
    this.createPaddle();
    
    
    // スペースキーのクリックでボール発射
    this.input.keyboard.on('keydown-SPACE', function(event){
        //ゲーム開始状態ならば
        if(this.paddle.isStart){
            //ボール発射
            this.ball.setVelocity(this.ballSpeedX,this.ballSpeedY);
            this.paddle.inStart = false;
            
            this.timeEvent = this.time.addEvent({
                delay: 1500,
                callback: this.cahngeballspeed,
                loop: true,
                callbackScope: this
            });}

    },this);
    
    
    // ブロック作成
    this.createBlocks();
    
    
    // ライフのテキスト表示
    this.lifeText = this.add.text(30,20,'ライフ:'+this.life,{
        font:'20px Open Sans',
        fill: '#ff0000'
    });
    
};
mainScene.cahngeballspeed = function(){
      this.ball.setVelocity(this.ballSpeedX,this.ballSpeedY);
      var random = Math.floor( Math.random() * 11 );
      var ballSpeedY = random;
      var ballSpeedX = random;
      
    
}

mainScene.update = function() {
    // ボールがシーンの最下部に到達した
    if(this.ball.y >= this.game.config.height - this.ball.width / 2){
        this.failToHit();
    }
    
    
    // キーボードのカーソルオブジェクトを取得
    var cursors = this.input.keyboard.createCursorKeys();
    var x = 0;
    var a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    var d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    //右カーソルをクリックすると
    if(d.isDown){
        x = this.paddle.x + this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x,52,748)};
    //左カーソルをクリックすると
    if(a.isDown){
        x = this.paddle.x - this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x,52,748)};
    //パドルの上にボールが載っているなら
    if(this.paddle.inStart){
        this.ball.setPosition(this.paddle.x,500);
    }
    
};

mainScene.config = function() {
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#fff');
    
    // パドルの移動速度
    this.paddleSpeed = 40;
    
    // ボール発射の加速度
    this.ballSpeedX = 0;
    this.ballSpeedY = -2000;
    
    // ライフ
    this.life = 7;
};

mainScene.createBall = function() {
    // ボール作成
    this.ball = this.physics.add.image(400,500,'ball1');
    this.ball.setDisplaySize(22,22);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    
};

mainScene.createPaddle = function() {
     // パドル作成
     this.paddle = this.physics.add.image(400,550,'paddle1');
     this.paddle.setDisplaySize(500,2);
     this.paddle.setImmovable();
     this.paddle.isStart = true;
     this.physics.add.collider(this.paddle,this.ball, this.hitPaddle, null, this);
    
};

mainScene.hitPaddle = function (paddle, ball) {
    // ボールにX方向の角度を設定
    var diff = 0;
    if(ball.x < paddle.x){
    ball.setVelocityX(-10 * diff);}
    else if(ball.x > paddle.x){
        //ボールがパドルの右側に衝突
        diff = ball.x - paddle.x;
        ball.setVelocityX(10 * diff);
    }else{
        ball.setVelocityX(0);
    }
    
};

mainScene.createBlocks = function() {
    //ブロック数指定、縦、横
    var blocknum = 10;
    var blocknuma = 13;
    // 横10列、縦6行並べる
    //ブロックの色の配列
    var blockColors =['red1','red2','green1','green2','yellow1','yellow2','silver1','blue1','blue2','purple1','purple2','silver2'];
    
    //物理エンジン対象固定オブジェクトグループ作成
    this.blocks = this.physics.add.staticGroup();
    
    //縦に6行
    for(var i =0; i<blocknum;i++){
        //横に10列
        for(var j = 0; j < blocknuma;j++){
            var color= blockColors[i];
            var block = this.blocks.create(80 + j * 64, 80 + i * 32,color);
            block.setOrigin(0,0);
            block.setDisplaySize(64,32);
            block.refreshBody();
        }
    }
    
    this.physics.add.collider(this.ball,this.blocks,this.hitBlock,null,this);
    
    
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

