// method one of defining a Screen: separate functions.
// make sure the names don't conflict.
// -andy

TestWorldScreen = new Screen ({
	backgroundColor: 0x66CC99,
	init: function()
	{

		this.nessie = this.createPlayer();
		this.stage.addChild(this.nessie);

		// init empty enemy array
		this.enemies = [];
		this.enemyTimer = 0;

		// spawn single enemy (for now) at left edge
		var enemy = this.addEnemy({
			scale: 3,
			target: this.nessie
		});
	},
	update: function(delta)
	{
		if(exists(this.nessie))
		{
			this.updatePlayer(delta,this.nessie);
		}

		for(var i = 0; i < this.enemies.length; i++)
		{
			var enemy = this.enemies[i];
			if(enemy.smart == false && !recTouch(enemy.getBounds(),STAGE_RECT))
			{ // if enemy should be removed
				this.removeEnemyIndex(i);
				i--;
			}
			else
			{ // if enemy is still around
				if(enemy.smart == true)
				{
					enemy.lifetime -= delta;
					if(enemy.lifetime <= 0)
					{
						enemy.smart = false;
					}
				}
				this.updateEnemy(delta,enemy,this.nessie);
				if ( exists(this.nessie) && recTouch ( enemy, this.nessie ))
				{
					debug("ACK");
					this.removeEnemyIndex(i);
					i--;
				}
			}
		}
		this.enemyTimer += delta;
		if(this.enemyTimer >= 3)
		{
			this.enemyTimer -= 3;
			this.addEnemy({
				scale: 3,
				target: this.nessie
			});
		}
	},
	onKeyDown: function()
	{

	},
	onMouseDown: function()
	{

	}
	// remember, you need commas after every
	// key-value pair except the last one!
});

TestWorldScreen.createPlayer = function()
{
	// init player at center of screen
	var nessie = Images.createSprite("bunny1.png");
	nessie.anchor.x = 0.5;
	nessie.anchor.y = 0.5;
	nessie.velocity = new PIXI.Point();
	nessie.position.x = STAGE_W/2;
	nessie.position.y = STAGE_H/2;
	nessie.scale.x = 2;
	nessie.scale.y = 2;
	return nessie;
}

TestWorldScreen.updatePlayer = function(delta,player)
{
	// update player
	var prUp = Input.anyKeyDown(KEYS_UP);
	var prDown = Input.anyKeyDown(KEYS_DOWN);
	var prLeft = Input.anyKeyDown(KEYS_LEFT);
	var prRight = Input.anyKeyDown(KEYS_RIGHT);

	var mUp = prUp && !prDown;
	var mDown = prDown && !prUp;
	var mLeft = prLeft && !prRight;
	var mRight = prRight && !prLeft;

	var playerMoving = mUp || mDown || mLeft || mRight;

	if(playerMoving)
	{
		var dx = 0;
		var dy = 0;

		if (mUp || mDown)
		{
		  dy = PLAYER_ACCELERATION * delta * (mDown ? 1 : -1) * ((mLeft || mRight) ? 1/DIAG : 1);
		}

		if (mLeft || mRight)
		{
		  dx = PLAYER_ACCELERATION * delta * (mRight ? 1 : -1) * ((mUp || mDown) ? 1/DIAG : 1);
		}

		player.velocity.x += dx;
		player.velocity.y += dy;
	}
	else
	{
		var vel = player.velocity;
		var speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y);
		var decelAmount = PLAYER_ACCELERATION*delta;

		if (speed != 0 && speed - PLAYER_MIN_SPEED <= decelAmount ) // if very close to min speed
		{
			var targetSpeed = PLAYER_MIN_SPEED;
			var mult = targetSpeed/speed;
			player.velocity.x *= mult;
			player.velocity.y *= mult;
		}
		else if (speed != 0) // if going fast
		{
			var targetSpeed = speed - decelAmount;
			var mult = targetSpeed/speed;
			player.velocity.x *= mult;
			player.velocity.y *= mult;
		}
	}

	player.position.x += player.velocity.x*delta;
	player.position.y += player.velocity.y*delta;

	var vel = player.velocity;
	var speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y);

	if(speed >= PLAYER_MIN_ROTATION_SPEED)
	{
		player.rotation = Math.atan2(vel.x,-vel.y);
	}
}

TestWorldScreen.addEnemy = function(cfg)
{
	var enemy = this.createEnemy(cfg);
	this.enemies.push(enemy);
	this.stage.addChild(enemy);
	return enemy;
}

TestWorldScreen.removeEnemyIndex = function(index)
{
	this.stage.removeChild(this.enemies[index]);
	arrayRemoveIndex(this.enemies,index);
	debug("Removed enemy " + index);
}

TestWorldScreen.createEnemy = function(cfg)
{
	var scale = validateObject(cfg.scale,1);
	var target = validateObject(cfg.target,null);
	var lifetime = 1+Math.random()*4;

	var enemy = Images.createSprite("bunny2.png");
	enemy.smart = true;
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;

	// random position
	var side = getRandomInt(4);
	switch ( side )
	{
	case 0:
		enemy.position.x = -ENEMY_START_OFFSET;
		enemy.position.y = Math.random()*STAGE_H;
		break;
	case 1:
		enemy.position.y = -ENEMY_START_OFFSET;
		enemy.position.x = Math.random()*STAGE_W;
		break;
	case 2:
		enemy.position.x = STAGE_W+ENEMY_START_OFFSET;
		enemy.position.y = Math.random()*STAGE_H;
		break;
	case 3:
		enemy.position.y = STAGE_H+ENEMY_START_OFFSET;
		enemy.position.x = Math.random()*STAGE_W;
		break;
	}

	enemy.scale.x = scale;
	enemy.scale.y = scale;
	enemy.target = target;
	enemy.lifetime = lifetime;
	enemy.speed = ENEMY_MIN_SPEED;
	if (exists(target))
	{
		pointAt(enemy,target);
	}
	else
	{
		var center = {
			position: new PIXI.Point(STAGE_W/2,STAGE_H/2)
		}
		pointAt(enemy,center);
		enemy.smart = false;
	}
	return enemy;
}

TestWorldScreen.updateEnemy = function(delta,enemy,player)
{
	if(enemy.smart == true && exists(enemy.target))
	{
		pointAt(enemy,enemy.target);
	}

	enemy.position.x -= delta*ENEMY_MIN_SPEED*Math.cos(enemy.rotation+Math.PI/2);
	enemy.position.y -= delta*ENEMY_MIN_SPEED*Math.sin(enemy.rotation+Math.PI/2);
}

TestWorldScreen.init();



TestMenuScreen = new Screen ({
	init: function()
	{
		this.testWords = new PIXI.Text("PROJECT NESSIE 2014 (try clicking on this screen)", {
			font : "64px Arial",
			fill: "001166",
			wordWrap: true,
			wordWrapWidth: 800
		});
		this.testWords.position.x = 0;
		this.testWords.position.y = STAGE_H/3;
		this.stage.addChild(this.testWords);


		// just for fun.... ;)
		this.doges = ["wow","many game","such eduation","loch ness","amaze hackathon"];
		var doges = this.doges;

		for(var i = 0; i < doges.length; i++)
		{
			var dogeWord = new PIXI.Text(doges[i], {
				font : "36px Comic Sans MS",
				fill: getRandomInt(99) + "" + getRandomInt(99) + "" + getRandomInt(99)
			});
			dogeWord.position.x = Math.random()*STAGE_W/2;
			dogeWord.position.y = Math.random()*STAGE_H/2+STAGE_H/4;
			this.stage.addChild(dogeWord);
		}
	},
	update: function(delta)
	{
	},
	onKeyDown: function(keyCode)
	{
		if (arrayContains(KEYS_EXIT,keyCode))
		{
			Game.setScreen(TestWorldScreen);
		}
	},
	onMouseDown: function(point)
	{
		var doges = this.doges;
		var dogeWord = new PIXI.Text(doges[getRandomInt(doges.length)], {
			font : "36px Comic Sans MS",
			fill: getRandomInt(99) + "" + getRandomInt(99) + "" + getRandomInt(99)
		});
		dogeWord.position.x = point.x;
		dogeWord.position.y = point.y;
		this.stage.addChild(dogeWord);
	}
});