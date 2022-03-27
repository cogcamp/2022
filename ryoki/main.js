var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
  //初期設定を実行する
    this.config();
    
    
    // ボール作成
    this.createBall();
    this.createBall2();
    
    // パドル作成
    
    this.createPaddle();
    // スペースキーのクリックでボール発射
    this.input.keyboard.on('keydown-SPACE', function(event){
        //ゲーム開始状態ならば
        if(this.paddle.isStart){
            //ボール発射
            this.ball.setVelocity(this.ballSpeedX,this.ballSpeedY);
            this.ball2.setVelocity(this.ball2SpeedX,this.ball2SpeedY);
            this.paddle.isStart = false;
            
        }
    },this);
    
    this.createBlocks();
    
    this.lifeText = this.add.text(30,20,'ライフ:' + this.life,{
        font:'20px Open Sans',
        fill:'#ff0000'
    });
    
};
    
    mainScene.update = function(){
        //ボールがシーンの最下部に到達した
        if(this.ball.y>= this.game.config.height - this.ball.width /2){
            this.failToHit();
        }else if(this.ball2.y>= this.game.config.height - this.ball2.width/2){
            this.failToHit();
        }
        //キーボードのカーソルオブジェクトを取得
        var cursors = this.input.keyboard.createCursorKeys();
        var x = 0;
        
    
    //右カーソルをクリックすると
    if(cursors.right.isDown){
        x = this.paddle.x + this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x,52,748);
    }
    //左カーソルをクリックすると
    if(cursors.left.isDown){
        x = this.paddle.x - this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x,52,748);
    }
    
    //パドルの上にボールが乗っているなら
    if(this.paddle.isStart){
        this.ball.setPosition(this.paddle.x,500);
        this.ball2.setPosition(this.paddle.x,500);
    }
        
    
    
};

mainScene.config = function() {
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#000000');
    
    // パドルの移動速度
    this.paddleSpeed = 10;
    
    // ボール発射の加速度
    this.ballSpeedX = 0;
    this.ballSpeedY = -200;
    this.ball2SpeedX = 0;
    this.ball2SpeedY = -150;
    
    // ライフ
    this.life = 3;
};

mainScene.createBall = function() {
    // ボール作成
    this.ball = this.physics.add.image(400, 500 , 'ball1');
    this.ball.setDisplaySize(22,22);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    
};
mainScene.createBall2 = function(){
    this.ball2 = this.physics.add.image(400,500,'ball2');
    this.ball2.setDisplaySize(22,22);
    this.ball2.setCollideWorldBounds(true);
    this.ball2.setBounce(1);
}

mainScene.createPaddle = function() {
     // パドル作成
     this.paddle = this.physics.add.image(400,550,'paddle1');
     this.paddle.setDisplaySize(104,24);
     this.paddle.setImmovable();
     this.paddle.isStart = true;
     this.physics.add.collider(this.paddle,this.ball,this.hitPaddle,null,this);
     this.physics.add.collider(this.paddle,this.ball2,this.hitPaddle,null,this);
    
};

mainScene.hitPaddle = function (paddle, ball) {
    // ボールにX方向の角度を設定
    var diff = 0;
    if(ball.x < paddle.x){
        //ボールがパドルの左側に衝突
        diff = paddle.x - ball.x;
        ball.setVelocityX(-10*diff);
    }
        
    else if(ball.x>paddle.x){
        //ボールがパドルの右側に衝突
        diff = ball.x - paddle.x;
        ball.setVelocityX(10*diff);
    
        
    }else{
        //x方向の加速度はなし
        ball.setVelocityX(0);
    }
    
};

mainScene.createBlocks = function() {
    // 横10列、縦6行並べる
    var blockColors = ['red1',  'green1','yellow1','silver' , 'blue1', 'purple1'];
    this.blocks = this.physics.add.staticGroup();
    for(var i = 0 ; i<6; i++){
        for(var j = 0; j<10; j++){
            var color = blockColors[i];
            var block = this.blocks.create(80 + j*64, 80 + i*32 , color);
            block.setOrigin(0,0);
            block.setDisplaySize(64, 32);
            block.refreshBody();
        }
    }
    
    this.physics.add.collider(this.ball, this.blocks,this.hitBlock,null,this);
    this.physics.add.collider(this.ball2,this.blocks,this.hitBlock,null,this);
    
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
    this.ball2.setVelocity(0);
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
